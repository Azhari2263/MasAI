'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/contexts/AuthContext'
import { useEstimation } from '@/contexts/EstimationContext'
import ImageUpload from '@/components/ImageUpload'
import { UserTrackingSection, UserHistorySection } from '@/components/UserTracking'
import {
    Sparkles, Home, FileText, Calculator, MapPin, User,
    Clock, TrendingUp, LogOut, Menu, X, ChevronLeft,
    Calendar, Download, Search, Mail, Phone, 
    DollarSign, Package, CheckCircle
} from 'lucide-react'

// Define interfaces khusus untuk halaman ini
interface UserEstimation {
    id: string
    object_type: string
    karat: number
    weight?: number
    max_loan_amount: number
    status: string
    image_url?: string
    created_at: string
}

interface UserApplication {
    id: string
    loan_amount: number
    status: string
    created_at: string
    object_type?: string
    // Tambahkan properti lain yang mungkin ada
    applicantName?: string
    email?: string
    phone?: string
    branch?: string
    estimationId?: string
    weight?: number
    karat?: number
    estimatedValue?: number
    submittedDate?: string
}

interface UserData {
    id: string
    name: string
    email: string
    phone?: string
    role: string
    created_at?: string
}

// Komponen Bell inline untuk menghindari konflik import
const BellIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
)

export default function Dashboard() {
    const { user: authUser, logout } = useAuth()
    const { getUserEstimations, getUserApplications } = useEstimation()
    const [activeSection, setActiveSection] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userActiveSection') || 'overview'
        }
        return 'overview'
    })
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('userActiveSection', activeSection)
        }
    }, [activeSection])

    const menuItems = [
        { id: 'overview', label: 'Beranda', icon: Home },
        { id: 'estimation', label: 'Estimasi Emas', icon: Calculator },
        { id: 'tracking', label: 'Tracking Pengajuan', icon: MapPin },
        { id: 'history', label: 'Riwayat Transaksi', icon: FileText },
        { id: 'profile', label: 'Profil Pengguna', icon: User },
    ]

    const currentMenuItem = menuItems.find(item => item.id === activeSection)
    const pageTitle = currentMenuItem ? currentMenuItem.label : 'Dashboard'

    // Get user data dengan type safety - gunakan tipe khusus
    const userEstimationsRaw = getUserEstimations?.() || []
    const userApplicationsRaw = getUserApplications?.() || []
    
    // Konversi ke tipe yang sesuai
    const userEstimations: UserEstimation[] = userEstimationsRaw.map((est: any) => ({
        id: est.id || '',
        object_type: est.object_type || est.objectType || 'Emas',
        karat: est.karat || 18,
        weight: est.weight || 0,
        max_loan_amount: est.max_loan_amount || est.loanAmount || 0,
        status: est.status || 'DRAFT',
        image_url: est.image_url,
        created_at: est.created_at || new Date().toISOString()
    }))
    
    const userApplications: UserApplication[] = userApplicationsRaw.map((app: any) => ({
        id: app.id || '',
        loan_amount: app.loan_amount || app.loanAmount || 0,
        status: app.status || 'PENDING',
        created_at: app.created_at || app.submittedDate || new Date().toISOString(),
        object_type: app.object_type || app.objectType,
        applicantName: app.applicantName,
        email: app.email,
        phone: app.phone,
        branch: app.branch,
        estimationId: app.estimationId,
        weight: app.weight,
        karat: app.karat,
        estimatedValue: app.estimatedValue,
        submittedDate: app.submittedDate
    }))
    
    // Safe user data
    const user: UserData = authUser || {
        id: '',
        name: 'Pengguna',
        email: '',
        role: 'USER',
        created_at: new Date().toISOString()
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true)
            } else {
                setSidebarOpen(false)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            setLogoutDialogOpen(false)
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string, class: string }> = {
            PENDING: { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            PROCESSING: { label: 'Diproses', class: 'bg-blue-100 text-blue-800 border-blue-200' },
            APPROVED: { label: 'Disetujui', class: 'bg-green-100 text-green-800 border-green-200' },
            REJECTED: { label: 'Ditolak', class: 'bg-red-100 text-red-800 border-red-200' },
            COMPLETED: { label: 'Selesai', class: 'bg-gray-100 text-gray-800 border-gray-200' },
            DRAFT: { label: 'Draft', class: 'bg-gray-100 text-gray-800 border-gray-200' }
        }
        const config = statusConfig[status] || statusConfig.DRAFT
        return <Badge className={`${config.class} border`}>{config.label}</Badge>
    }

    const stats = [
        { 
            label: 'Total Estimasi', 
            value: userEstimations.length, 
            icon: Calculator, 
            color: 'amber'
        },
        { 
            label: 'Pengajuan Aktif', 
            value: userApplications.length, 
            icon: FileText, 
            color: 'blue'
        },
        { 
            label: 'Disetujui', 
            value: userApplications.filter(a => a.status === 'APPROVED').length, 
            icon: CheckCircle, 
            color: 'green'
        },
        { 
            label: 'Total Plafon', 
            value: userApplications.reduce((sum, app) => sum + app.loan_amount, 0),
            icon: TrendingUp, 
            color: 'purple'
        }
    ]

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <Card key={index} className="border-amber-200 hover:shadow-md transition-shadow duration-300">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">{stat.label}</p>
                                                <p className="text-2xl font-bold text-amber-600">
                                                    {stat.label === 'Total Plafon' 
                                                        ? formatCurrency(stat.value as number)
                                                        : stat.value.toString()}
                                                </p>
                                            </div>
                                            <div className={`w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center`}>
                                                <stat.icon className={`w-6 h-6 text-amber-600`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border-amber-200">
                                <CardHeader>
                                    <CardTitle className="text-amber-800">Aktivitas Terbaru</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {userEstimations.length > 0 ? (
                                        <div className="space-y-3">
                                            {userEstimations.slice(0, 5).map((estimation) => (
                                                <div key={estimation.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {estimation.object_type} - {estimation.karat}K
                                                            </p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(estimation.created_at).toLocaleDateString('id-ID')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {getStatusBadge(estimation.status)}
                                                        <span className="text-sm font-medium text-blue-600">
                                                            {formatCurrency(estimation.max_loan_amount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p>Belum ada aktivitas</p>
                                            <p className="text-sm">Mulai dengan membuat estimasi emas pertama Anda</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-amber-200">
                                <CardHeader>
                                    <CardTitle className="text-amber-800">Pengajuan Terbaru</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {userApplications.length > 0 ? (
                                        <div className="space-y-3">
                                            {userApplications.slice(0, 5).map((application) => (
                                                <div key={application.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                                                    <div>
                                                        <p className="font-medium text-gray-900">APP-{application.id.slice(-6)}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(application.created_at).toLocaleDateString('id-ID')}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {getStatusBadge(application.status)}
                                                        <span className="text-sm font-medium text-green-600">
                                                            {formatCurrency(application.loan_amount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p>Belum ada pengajuan</p>
                                            <p className="text-sm">Mulai dengan membuat estimasi terlebih dahulu</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-amber-200">
                            <CardHeader>
                                <CardTitle className="text-amber-800">Statistik Cepat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">Total Nilai Gadai</span>
                                            <span className="text-sm font-semibold text-amber-600">
                                                {formatCurrency(userApplications.reduce((sum, app) => sum + app.loan_amount, 0))}
                                            </span>
                                        </div>
                                        <div className="w-full bg-amber-100 rounded-full h-2">
                                            <div 
                                                className="bg-amber-500 h-2 rounded-full" 
                                                style={{ width: '75%' }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">Rata-rata Plafon</span>
                                            <span className="text-sm font-semibold text-amber-600">
                                                {userApplications.length > 0 
                                                    ? formatCurrency(userApplications.reduce((sum, app) => sum + app.loan_amount, 0) / userApplications.length)
                                                    : formatCurrency(0)
                                                }
                                            </span>
                                        </div>
                                        <div className="w-full bg-amber-100 rounded-full h-2">
                                            <div 
                                                className="bg-amber-400 h-2 rounded-full" 
                                                style={{ width: '60%' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )

            case 'estimation':
                return (
                    <Card className="border-amber-200">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-amber-800">Estimasi Emas dengan AI</CardTitle>
                                    <CardDescription>Upload foto emas Anda dan dapatkan estimasi harga secara instan</CardDescription>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calculator className="w-4 h-4" />
                                    <span>{userEstimations.length} estimasi dibuat</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="max-w-2xl mx-auto">
                                <ImageUpload />
                            </div>
                        </CardContent>
                    </Card>
                )

            case 'tracking':
                return (
                    <div className="space-y-6">
                        <Card className="border-amber-200">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-amber-800">Tracking Pengajuan</CardTitle>
                                        <CardDescription>Pantau status pengajuan gadai Anda</CardDescription>
                                    </div>
                                    <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Data
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <UserTrackingSection />
                            </CardContent>
                        </Card>
                    </div>
                )

            case 'history':
                return (
                    <div className="space-y-6">
                        <Card className="border-amber-200">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-amber-800">Riwayat Transaksi</CardTitle>
                                        <CardDescription>Lihat semua estimasi dan pengajuan yang pernah dibuat</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1 max-w-sm">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Cari estimasi..."
                                                className="pl-9"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <UserHistorySection />
                            </CardContent>
                        </Card>
                    </div>
                )

            case 'profile':
                return (
                    <Card className="border-amber-200">
                        <CardHeader>
                            <CardTitle className="text-amber-800">Profil Pengguna</CardTitle>
                            <CardDescription>Kelola informasi akun Anda</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Informasi Pribadi
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <User className="w-5 h-5 text-amber-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                                                    <p className="font-medium">{user.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-amber-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-amber-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Telepon</p>
                                                    <p className="font-medium">{user.phone || 'Belum diisi'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                            <Badge className="w-4 h-4" />
                                            Status Akun
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600">Role</p>
                                                <Badge className={`mt-1 ${
                                                    user.role === 'ADMIN' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0' :
                                                    user.role === 'SUPER_ADMIN' ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-0' :
                                                    'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0'
                                                }`}>
                                                    {user.role}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Tanggal Bergabung</p>
                                                <p className="font-medium">
                                                    {user.created_at 
                                                        ? new Date(user.created_at).toLocaleDateString('id-ID')
                                                        : new Date().toLocaleDateString('id-ID')
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-amber-200">
                                <h3 className="font-semibold text-amber-800 mb-4">Statistik Pengguna</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                                        <Calculator className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-amber-600">{userEstimations.length}</p>
                                        <p className="text-sm text-gray-600">Total Estimasi</p>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-blue-600">{userApplications.length}</p>
                                        <p className="text-sm text-gray-600">Pengajuan</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-green-600">
                                            {userApplications.filter(a => a.status === 'APPROVED').length}
                                        </p>
                                        <p className="text-sm text-gray-600">Disetujui</p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-purple-600">
                                            {formatCurrency(userApplications.reduce((sum, app) => sum + app.loan_amount, 0))}
                                        </p>
                                        <p className="text-sm text-gray-600">Total Plafon</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    // Hapus loading state jika user null, langsung render dengan user default
    if (!authUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <Card className="border-amber-200">
                    <CardContent className="pt-6">
                        <div className="animate-pulse">
                            <div className="h-4 bg-amber-200 rounded w-32 mb-4"></div>
                            <div className="h-8 bg-amber-200 rounded w-48"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-amber-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between p-4 border-b border-amber-200 h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-amber-800">User Panel</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
                    <div className="mb-4 px-2">
                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500">Pelanggan</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={activeSection === item.id ? 'default' : 'ghost'}
                                className={`w-full justify-start ${activeSection === item.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-sm' : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'}`}
                                onClick={() => {
                                    setActiveSection(item.id)
                                    if (window.innerWidth < 1024) setSidebarOpen(false)
                                }}
                            >
                                <item.icon className="w-4 h-4 mr-3" />
                                {item.label}
                            </Button>
                        ))}
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-amber-100">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setLogoutDialogOpen(true)}
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Logout
                        </Button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-amber-200 h-16">
                    <div className="container mx-auto px-4 h-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                                {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                {new Date().toLocaleDateString('id-ID', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Button variant="ghost" size="icon" className="relative">
                                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2"></div>
                                    <BellIcon className="w-5 h-5" />
                                </Button>
                            </div>
                            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0">
                                {user.role}
                            </Badge>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
                                onClick={() => setLogoutDialogOpen(true)}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-amber-900">{pageTitle}</h1>
                                    <p className="text-gray-600 mt-1">
                                        {activeSection === 'overview' && 'Ringkasan aktivitas dan statistik akun Anda'}
                                        {activeSection === 'estimation' && 'Estimasi nilai emas Anda dengan teknologi AI'}
                                        {activeSection === 'tracking' && 'Pantau status pengajuan gadai Anda'}
                                        {activeSection === 'history' && 'Lihat riwayat estimasi dan transaksi Anda'}
                                        {activeSection === 'profile' && 'Kelola informasi profil dan akun Anda'}
                                    </p>
                                </div>
                                {(activeSection === 'tracking' || activeSection === 'history') && userApplications.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 px-4 py-2 rounded-lg">
                                        <FileText className="w-4 h-4" />
                                        <span>
                                            Total <span className="font-semibold text-amber-700">{userApplications.length}</span> pengajuan
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {renderContent()}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-amber-200 bg-white/80 py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                                <p>© 2025 - Dashboard Pengguna</p>
                                <Badge variant="outline" className="text-xs">v1.0.0</Badge>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Akun aktif
                                </span>
                                {/* <span className="hidden md:inline">|</span> */}
                                {/* <span>Member sejak: {
                                    user.created_at 
                                        ? new Date(user.created_at).toLocaleDateString('id-ID')
                                        : new Date().toLocaleDateString('id-ID')
                                }</span> */}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Dialog Konfirmasi Logout (Simplified) */}
            {logoutDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <LogOut className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Konfirmasi Logout</h3>
                                <p className="text-sm text-gray-600">Apakah Anda yakin ingin logout dari dashboard?</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="outline"
                                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                                onClick={() => setLogoutDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                onClick={handleLogout}
                            >
                                Ya, Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}