// src/app/api/admin/applications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Middleware untuk check admin role
async function checkAdminAuth(request: NextRequest) {
  // TODO: Implement proper authentication
  // For now, we'll use a simple header check
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return { authorized: false, userId: null }
  }
  
  // In production, verify JWT token and check role
  // const token = authHeader.replace('Bearer ', '')
  // const decoded = verifyToken(token)
  // if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
  //   return { authorized: false, userId: null }
  // }
  
  return { authorized: true, userId: 'admin-user-id' }
}

// GET - Fetch all applications with filters
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
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status && status !== 'ALL') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { application_number: { contains: search } },
        { full_name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } }
      ]
    }

    // Fetch applications with pagination
    const [applications, total] = await Promise.all([
      db.application.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          },
          estimation: {
            select: {
              object_type: true,
              estimated_weight: true,
              karat: true,
              condition: true,
              estimated_gold_value: true,
              max_loan_amount: true,
              estimation_id: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      db.application.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Admin applications fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch applications'
    }, { status: 500 })
  }
}

// PUT - Update application status (Approve/Reject)
export async function PUT(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { application_id, action, rejection_reason } = body

    if (!application_id || !action) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Fetch application
    const application = await db.application.findUnique({
      where: { id: application_id },
      include: {
        estimation: true,
        user: true
      }
    })

    if (!application) {
      return NextResponse.json({
        success: false,
        error: 'Application not found'
      }, { status: 404 })
    }

    // Update based on action
    let updatedApplication
    let statusLog

    if (action === 'APPROVE') {
      updatedApplication = await db.application.update({
        where: { id: application_id },
        data: {
          status: 'APPROVED',
          approved_by: auth.userId,
          approved_at: new Date(),
          current_step: 'approved',
          progress_percentage: 100
        }
      })

      // Create status log
      statusLog = await db.applicationStatusLog.create({
        data: {
          application_id: application_id,
          step: 'Persetujuan',
          status: 'completed',
          description: 'Pengajuan telah disetujui oleh admin',
          created_by: auth.userId
        }
      })

      // Create audit log
      await db.auditLog.create({
        data: {
          user_id: auth.userId,
          action: 'APPROVE',
          resource: 'application',
          resource_id: application_id,
          new_values: JSON.stringify({ status: 'APPROVED' }),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown'
        }
      })

      // TODO: Send notification to user
      // await sendApprovalNotification(application.user.email, application)

    } else if (action === 'REJECT') {
      if (!rejection_reason) {
        return NextResponse.json({
          success: false,
          error: 'Rejection reason is required'
        }, { status: 400 })
      }

      updatedApplication = await db.application.update({
        where: { id: application_id },
        data: {
          status: 'REJECTED',
          rejection_reason,
          current_step: 'rejected',
          progress_percentage: 0
        }
      })

      // Create status log
      statusLog = await db.applicationStatusLog.create({
        data: {
          application_id: application_id,
          step: 'Penolakan',
          status: 'completed',
          description: `Pengajuan ditolak: ${rejection_reason}`,
          created_by: auth.userId
        }
      })

      // Create audit log
      await db.auditLog.create({
        data: {
          user_id: auth.userId,
          action: 'REJECT',
          resource: 'application',
          resource_id: application_id,
          new_values: JSON.stringify({ 
            status: 'REJECTED', 
            rejection_reason 
          }),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown'
        }
      })

      // TODO: Send notification to user
      // await sendRejectionNotification(application.user.email, application, rejection_reason)

    } else if (action === 'PROCESS') {
      updatedApplication = await db.application.update({
        where: { id: application_id },
        data: {
          status: 'PROCESSING',
          current_step: 'processing',
          progress_percentage: 50
        }
      })

      statusLog = await db.applicationStatusLog.create({
        data: {
          application_id: application_id,
          step: 'Pemrosesan',
          status: 'in_progress',
          description: 'Pengajuan sedang diproses oleh admin',
          created_by: auth.userId
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `Application ${action.toLowerCase()}ed successfully`,
      data: updatedApplication
    })

  } catch (error) {
    console.error('Admin application update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update application'
    }, { status: 500 })
  }
}

// DELETE - Delete application
export async function DELETE(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const application_id = searchParams.get('id')

    if (!application_id) {
      return NextResponse.json({
        success: false,
        error: 'Application ID is required'
      }, { status: 400 })
    }

    // Check if application exists
    const application = await db.application.findUnique({
      where: { id: application_id }
    })

    if (!application) {
      return NextResponse.json({
        success: false,
        error: 'Application not found'
      }, { status: 404 })
    }

    // Store old values for audit
    const oldValues = JSON.stringify(application)

    // Delete application (cascades will delete status logs)
    await db.application.delete({
      where: { id: application_id }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        user_id: auth.userId,
        action: 'DELETE',
        resource: 'application',
        resource_id: application_id,
        old_values: oldValues,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully'
    })

  } catch (error) {
    console.error('Admin application delete error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete application'
    }, { status: 500 })
  }
}