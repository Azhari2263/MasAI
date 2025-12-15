// src/app/api/admin/statistics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function checkAdminAuth(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
        return { authorized: false, userId: null }
    }
    return { authorized: true, userId: 'admin-user-id' }
}

export async function GET(request: NextRequest) {
    try {
        const auth = await checkAdminAuth(request)
        if (!auth.authorized) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorized'
            }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const period = searchParams.get('period') || '30' // days
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - parseInt(period))

        // Get application statistics
        const [
            totalApplications,
            pendingApplications,
            processingApplications,
            approvedApplications,
            rejectedApplications,
            totalEstimations,
            totalUsers,
            recentApplications
        ] = await Promise.all([
            db.application.count(),
            db.application.count({ where: { status: 'PENDING' } }),
            db.application.count({ where: { status: 'PROCESSING' } }),
            db.application.count({ where: { status: 'APPROVED' } }),
            db.application.count({ where: { status: 'REJECTED' } }),
            db.estimation.count(),
            db.user.count({ where: { role: 'USER' } }),
            db.application.findMany({
                take: 10,
                orderBy: { created_at: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true }
                    },
                    estimation: {
                        select: {
                            object_type: true,
                            estimated_gold_value: true,
                            max_loan_amount: true
                        }
                    }
                }
            })
        ])

        // Calculate total loan amount
        const totalLoanAmount = await db.application.aggregate({
            where: { status: 'APPROVED' },
            _sum: {
                approved_amount: true
            }
        })

        // Get applications by status for chart
        const applicationsByStatus = [
            { status: 'PENDING', count: pendingApplications },
            { status: 'PROCESSING', count: processingApplications },
            { status: 'APPROVED', count: approvedApplications },
            { status: 'REJECTED', count: rejectedApplications }
        ]

        // Get applications trend (last 30 days)
        const trendData = await db.application.groupBy({
            by: ['created_at'],
            where: {
                created_at: { gte: startDate }
            },
            _count: true
        })

        // Get top branches by applications
        const topBranches = await db.application.groupBy({
            by: ['branch_name'],
            _count: true,
            orderBy: {
                _count: {
                    branch_name: 'desc'
                }
            },
            take: 5
        })

        // Calculate approval rate
        const approvalRate =
            totalApplications > 0
                ? ((approvedApplications / totalApplications) * 100).toFixed(2)
                : '0.00'


        // Calculate average processing time
        const processedApplications = await db.application.findMany({
            where: {
                OR: [
                    { status: 'APPROVED' },
                    { status: 'REJECTED' }
                ]
            },
            select: {
                created_at: true,
                updated_at: true
            }
        })

        const avgProcessingTime = processedApplications.length > 0
            ? processedApplications.reduce((acc, app) => {
                const diff = new Date(app.updated_at).getTime() - new Date(app.created_at).getTime()
                return acc + diff
            }, 0) / processedApplications.length
            : 0

        const avgProcessingHours = (avgProcessingTime / (1000 * 60 * 60)).toFixed(2)

        return NextResponse.json({
            success: true,
            data: {
                overview: {
                    totalApplications,
                    pendingApplications,
                    processingApplications,
                    approvedApplications,
                    rejectedApplications,
                    totalEstimations,
                    totalUsers,
                    totalLoanAmount: totalLoanAmount._sum.approved_amount || 0,
                    approvalRate: parseFloat(approvalRate),
                    avgProcessingHours: parseFloat(avgProcessingHours)
                },
                charts: {
                    applicationsByStatus,
                    trendData,
                    topBranches
                },
                recentActivity: recentApplications.map(app => ({
                    id: app.id,
                    applicantName: app.full_name,
                    email: app.email,
                    status: app.status,
                    objectType: app.estimation?.object_type,
                    loanAmount: app.estimation?.max_loan_amount,
                    submittedDate: app.created_at,
                    branch: app.branch_name
                }))
            }
        })

    } catch (error) {
        console.error('Admin statistics error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch statistics'
        }, { status: 500 })
    }
}

// Export statistics as CSV
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAdminAuth(request)
        if (!auth.authorized) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorized'
            }, { status: 401 })
        }

        const body = await request.json()
        const { startDate, endDate, format = 'csv' } = body

        const applications = await db.application.findMany({
            where: {
                created_at: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined
                }
            },
            include: {
                user: {
                    select: { name: true, email: true, phone: true }
                },
                estimation: {
                    select: {
                        estimation_id: true,
                        object_type: true,
                        estimated_weight: true,
                        karat: true,
                        estimated_gold_value: true,
                        max_loan_amount: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        })

        if (format === 'csv') {
            // Generate CSV
            const headers = [
                'ID',
                'Estimation ID',
                'Applicant Name',
                'Email',
                'Phone',
                'Object Type',
                'Weight (g)',
                'Karat',
                'Estimated Value',
                'Loan Amount',
                'Status',
                'Branch',
                'Submitted Date',
                'Updated Date'
            ]

            const rows = applications.map(app => [
                app.application_number,
                app.estimation?.estimation_id || '',
                app.full_name,
                app.email,
                app.phone,
                app.estimation?.object_type || '',
                app.estimation?.estimated_weight || '',
                app.estimation?.karat || '',
                app.estimation?.estimated_gold_value || '',
                app.estimation?.max_loan_amount || '',
                app.status,
                app.branch_name || '',
                new Date(app.created_at).toLocaleString('id-ID'),
                new Date(app.updated_at).toLocaleString('id-ID')
            ])

            const csv = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n')

            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="applications-export-${Date.now()}.csv"`
                }
            })
        }

        // Return JSON
        return NextResponse.json({
            success: true,
            data: applications,
            count: applications.length
        })

    } catch (error) {
        console.error('Admin export error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to export data'
        }, { status: 500 })
    }
}