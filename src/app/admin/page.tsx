'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from '@/contexts/AuthContext'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sparkles,
    FileText,
    Users,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Trash2,
    MoreVertical,
    Search,
    Filter,
    Download,
    AlertTriangle,
    Calendar,
    Home,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    CheckCheck,
    Play,
    DollarSign,
    Package,
    MapPin,
    Phone,
    Mail,
    User
} from 'lucide-react'

interface Application {
    id: string
    estimationId: string
    applicantName: string
    email: string
    phone: string
    objectType: string
    weight: number
    karat: number
    estimatedValue: number
    loanAmount: number
    status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
    submittedDate: string
    branch: string
}

export default function AdminDashboard() {
    const { user, logout } = useAuth()
    const [applications, setApplications] = useState<Application[]>([
        {
            id: 'APP001',
            estimationId: 'EST-1705123456789',
            applicantName: 'Ahmad Wijaya',
            email: 'ahmad@email.com',
            phone: '081234567890',
            objectType: 'Kalung Emas',
            weight: 12.5,
            karat: 22,
            estimatedValue: 15625000,
            loanAmount: 12500000,
            status: 'PENDING',
            submittedDate: '2024-01-12 10:30',
            branch: 'Jakarta Pusat'
        },
        {
            id: 'APP002',
            estimationId: 'EST-1705123456790',
            applicantName: 'Siti Rahmawati',
            email: 'siti@email.com',
            phone: '082345678901',
            objectType: 'Cincin Emas',
            weight: 8.5,
            karat: 24,
            estimatedValue: 10625000,
            loanAmount: 9031250,
            status: 'PROCESSING',
            submittedDate: '2024-01-12 11:15',
            branch: 'Jakarta Selatan'
        },
        {
            id: 'APP003',
            estimationId: 'EST-1705123456791',
            applicantName: 'Budi Santoso',
            email: 'budi@email.com',
            phone: '083456789012',
            objectType: 'Gelang Emas',
            weight: 15.0,
            karat: 18,
            estimatedValue: 18750000,
            loanAmount: 14062500,
            status: 'APPROVED',
            submittedDate: '2024-01-11 14:20',
            branch: 'Jakarta Utara'
        },
        {
            id: 'APP004',
            estimationId: 'EST-1705123456792',
            applicantName: 'Dewi Lestari',
            email: 'dewi@email.com',
            phone: '084567890123',
            objectType: 'Liontin Emas',
            weight: 5.5,
            karat: 21,
            estimatedValue: 6875000,
            loanAmount: 5500000,
            status: 'REJECTED',
            submittedDate: '2024-01-10 09:45',
            branch: 'Jakarta Barat'
        },
        {
            id: 'APP005',
            estimationId: 'EST-1705123456793',
            applicantName: 'Rudi Hartono',
            email: 'rudi@email.com',
            phone: '085678901234',
            objectType: 'Gelang Emas',
            weight: 20.0,
            karat: 18,
            estimatedValue: 25000000,
            loanAmount: 18750000,
            status: 'COMPLETED',
            submittedDate: '2024-01-09 16:30',
            branch: 'Jakarta Timur'
        },
        {
            id: 'APP006',
            estimationId: 'EST-1705123456794',
            applicantName: 'Maya Indah',
            email: 'maya@email.com',
            phone: '086789012345',
            objectType: 'Cincin Berlian',
            weight: 3.2,
            karat: 24,
            estimatedValue: 48000000,
            loanAmount: 38400000,
            status: 'PENDING',
            submittedDate: '2024-01-13 09:20',
            branch: 'Bandung'
        },
        {
            id: 'APP007',
            estimationId: 'EST-1705123456795',
            applicantName: 'Hendra Kurniawan',
            email: 'hendra@email.com',
            phone: '087890123456',
            objectType: 'Kalung Emas',
            weight: 18.7,
            karat: 22,
            estimatedValue: 23375000,
            loanAmount: 18700000,
            status: 'PROCESSING',
            submittedDate: '2024-01-13 11:45',
            branch: 'Surabaya'
        }
    ])

    const [selectedApp, setSelectedApp] = useState<Application | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState<'view' | 'process' | 'approve' | 'reject' | 'complete' | 'delete'>('view')
    const [rejectionReason, setRejectionReason] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [activeSection, setActiveSection] = useState('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'Pengajuan baru dari Ahmad Wijaya', time: '10 menit lalu', read: false },
        { id: 2, message: 'Pengajuan dari Siti Rahmawati perlu verifikasi', time: '1 jam lalu', read: false },
        { id: 3, message: '5 pengajuan menunggu persetujuan', time: '2 jam lalu', read: true }
    ])

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

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'applications', label: 'Pengajuan', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    const currentMenuItem = menuItems.find(item => item.id === activeSection)
    const pageTitle = currentMenuItem ? currentMenuItem.label : 'Admin Dashboard'

    const stats = [
        {
            label: 'Total Pengajuan',
            value: applications.length,
            icon: FileText,
            color: 'amber',
            change: '+12%',
            trend: 'up'
        },
        {
            label: 'Menunggu',
            value: applications.filter(a => a.status === 'PENDING').length,
            icon: Clock,
            color: 'yellow',
            change: '+3',
            trend: 'up'
        },
        {
            label: 'Diproses',
            value: applications.filter(a => a.status === 'PROCESSING').length,
            icon: TrendingUp,
            color: 'blue',
            change: '+2',
            trend: 'up'
        },
        {
            label: 'Disetujui',
            value: applications.filter(a => a.status === 'APPROVED').length,
            icon: CheckCircle,
            color: 'green',
            change: '+5%',
            trend: 'up'
        },
        {
            label: 'Ditolak',
            value: applications.filter(a => a.status === 'REJECTED').length,
            icon: XCircle,
            color: 'red',
            change: '-1',
            trend: 'down'
        },
        {
            label: 'Selesai',
            value: applications.filter(a => a.status === 'COMPLETED').length,
            icon: CheckCheck,
            color: 'gray',
            change: '+8%',
            trend: 'up'
        }
    ]

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            PROCESSING: { label: 'Diproses', class: 'bg-blue-100 text-blue-800 border-blue-200' },
            APPROVED: { label: 'Disetujui', class: 'bg-green-100 text-green-800 border-green-200' },
            REJECTED: { label: 'Ditolak', class: 'bg-red-100 text-red-800 border-red-200' },
            COMPLETED: { label: 'Selesai', class: 'bg-gray-100 text-gray-800 border-gray-200' }
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Badge className={`${config.class} border`}>{config.label}</Badge>
    }

    const openDialog = (app: Application, type: 'view' | 'process' | 'approve' | 'reject' | 'complete' | 'delete') => {
        setSelectedApp(app)
        setDialogType(type)
        setDialogOpen(true)
        if (type !== 'reject') {
            setRejectionReason('')
        }
    }

    const handleProcess = () => {
        if (selectedApp) {
            setApplications(applications.map(app =>
                app.id === selectedApp.id ? { ...app, status: 'PROCESSING' } : app
            ))
            setDialogOpen(false)
            addNotification(`Pengajuan ${selectedApp.id} diproses`)
        }
    }

    const handleApprove = () => {
        if (selectedApp) {
            setApplications(applications.map(app =>
                app.id === selectedApp.id ? { ...app, status: 'APPROVED' } : app
            ))
            setDialogOpen(false)
            addNotification(`Pengajuan ${selectedApp.id} disetujui`)
        }
    }

    const handleReject = () => {
        if (selectedApp && rejectionReason) {
            setApplications(applications.map(app =>
                app.id === selectedApp.id ? { ...app, status: 'REJECTED' } : app
            ))
            setDialogOpen(false)
            addNotification(`Pengajuan ${selectedApp.id} ditolak`)
        }
    }

    const handleComplete = () => {
        if (selectedApp) {
            setApplications(applications.map(app =>
                app.id === selectedApp.id ? { ...app, status: 'COMPLETED' } : app
            ))
            setDialogOpen(false)
            addNotification(`Pengajuan ${selectedApp.id} diselesaikan`)
        }
    }

    const handleDelete = () => {
        if (selectedApp) {
            setApplications(applications.filter(app => app.id !== selectedApp.id))
            setDialogOpen(false)
            addNotification(`Pengajuan ${selectedApp.id} dihapus`)
        }
    }

    const addNotification = (message: string) => {
        const newNotification = {
            id: notifications.length + 1,
            message,
            time: 'Baru saja',
            read: false
        }
        setNotifications([newNotification, ...notifications])
    }

    const markAllNotificationsAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })))
    }

    const handleLogout = async () => {
        try {
            await logout()
            setLogoutDialogOpen(false)
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.phone.includes(searchQuery)
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getActionMenuItems = (app: Application) => {
        const baseItems = [
            {
                label: 'Lihat Detail',
                icon: Eye,
                onClick: () => openDialog(app, 'view'),
                className: 'text-gray-700 hover:bg-gray-100'
            }
        ]

        switch (app.status) {
            case 'PENDING':
                return [
                    ...baseItems,
                    {
                        label: 'Diproses',
                        icon: Play,
                        onClick: () => openDialog(app, 'process'),
                        className: 'text-blue-600 hover:bg-blue-50'
                    }
                ]

            case 'PROCESSING':
                return [
                    ...baseItems,
                    {
                        label: 'Setujui',
                        icon: CheckCircle,
                        onClick: () => openDialog(app, 'approve'),
                        className: 'text-green-600 hover:bg-green-50'
                    },
                    {
                        label: 'Tolak',
                        icon: XCircle,
                        onClick: () => openDialog(app, 'reject'),
                        className: 'text-red-600 hover:bg-red-50'
                    }
                ]

            case 'APPROVED':
                return [
                    ...baseItems,
                    {
                        label: 'Selesai',
                        icon: CheckCheck,
                        onClick: () => openDialog(app, 'complete'),
                        className: 'text-gray-600 hover:bg-gray-50'
                    }
                ]

            case 'REJECTED':
                return [
                    ...baseItems,
                    {
                        label: 'Hapus',
                        icon: Trash2,
                        onClick: () => openDialog(app, 'delete'),
                        className: 'text-red-600 hover:bg-red-50'
                    }
                ]

            case 'COMPLETED':
                return [
                    ...baseItems,
                    {
                        label: 'Hapus',
                        icon: Trash2,
                        onClick: () => openDialog(app, 'delete'),
                        className: 'text-red-600 hover:bg-red-50'
                    }
                ]

            default:
                return baseItems
        }
    }

    const getStatusDescription = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Menunggu untuk diproses'
            case 'PROCESSING': return 'Sedang dalam proses verifikasi'
            case 'APPROVED': return 'Telah disetujui dan siap dicairkan'
            case 'REJECTED': return 'Tidak memenuhi persyaratan'
            case 'COMPLETED': return 'Proses telah selesai'
            default: return ''
        }
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <Card key={index} className="border-amber-200 hover:shadow-md transition-shadow duration-300">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                                <div className="flex items-baseline gap-2">
                                                    <p className="text-2xl md:text-3xl font-bold text-amber-600">{stat.value}</p>
                                                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {stat.change}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`w-12 h-12 ${stat.color === 'amber' ? 'bg-amber-100' : stat.color === 'yellow' ? 'bg-yellow-100' : stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : stat.color === 'red' ? 'bg-red-100' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color === 'amber' ? 'text-amber-600' : stat.color === 'yellow' ? 'text-yellow-600' : stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'red' ? 'text-red-600' : 'text-gray-600'}`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <Card className="border-amber-200 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-amber-800">Aktivitas Terbaru</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {applications.slice(0, 5).map(app => (
                                                <div key={app.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                            <FileText className="w-5 h-5 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{app.applicantName}</p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <Calendar className="w-3 h-3" />
                                                                {app.submittedDate}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {getStatusBadge(app.status)}
                                                        <span className="text-sm font-medium text-blue-600">{formatCurrency(app.loanAmount)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                <Card className="border-amber-200 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-amber-800">Notifikasi</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {notifications.slice(0, 4).map(notif => (
                                                <div key={notif.id} className={`p-3 rounded-lg ${notif.read ? 'bg-gray-50' : 'bg-blue-50'} border ${notif.read ? 'border-gray-200' : 'border-blue-200'}`}>
                                                    <div className="flex justify-between items-start">
                                                        <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>{notif.message}</p>
                                                        {!notif.read && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                </div>
                                            ))}
                                            {notifications.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                    onClick={markAllNotificationsAsRead}
                                                >
                                                    Tandai semua telah dibaca
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <Card className="border-amber-200">
                            <CardHeader>
                                <CardTitle className="text-amber-800">Statistik Keuangan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-4">Total Nilai Gadai</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm text-gray-600">Nilai Total Gadai</span>
                                                    <span className="text-sm font-semibold text-amber-600">
                                                        {formatCurrency(applications.reduce((sum, app) => sum + app.loanAmount, 0))}
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
                                                        {formatCurrency(applications.reduce((sum, app) => sum + app.loanAmount, 0) / applications.length)}
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
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-4">Distribusi Status</h3>
                                        <div className="space-y-3">
                                            {['PENDING', 'PROCESSING', 'APPROVED', 'REJECTED', 'COMPLETED'].map(status => {
                                                const count = applications.filter(app => app.status === status).length
                                                const percentage = applications.length > 0 ? (count / applications.length) * 100 : 0
                                                return (
                                                    <div key={status} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(status)}
                                                            <span className="text-sm text-gray-600">{count}</span>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">{percentage.toFixed(1)}%</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )

            case 'applications':
                return (
                    <div className="space-y-6">
                        <Card className="border-amber-200">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-amber-800">Kelola Pengajuan Gadai</CardTitle>
                                        <CardDescription>Kelola semua pengajuan gadai emas dari pelanggan</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                            <Filter className="w-4 h-4 mr-2" />
                                            Filter Lanjutan
                                        </Button>
                                        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export Data
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari nama, ID, email, atau telepon..."
                                            className="pl-9"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <div className="flex items-center">
                                                <Filter className="w-4 h-4 mr-2" />
                                                <SelectValue placeholder="Filter Status" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Semua Status</SelectItem>
                                            <SelectItem value="PENDING">Menunggu</SelectItem>
                                            <SelectItem value="PROCESSING">Diproses</SelectItem>
                                            <SelectItem value="APPROVED">Disetujui</SelectItem>
                                            <SelectItem value="REJECTED">Ditolak</SelectItem>
                                            <SelectItem value="COMPLETED">Selesai</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="border border-amber-200 rounded-lg overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-amber-50">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-sm text-amber-800">ID</th>
                                                <th className="text-left p-4 font-semibold text-sm text-amber-800">Pemohon</th>
                                                <th className="text-left p-4 font-semibold text-sm text-amber-800">Objek</th>
                                                <th className="text-left p-4 font-semibold text-sm text-amber-800">Nilai</th>
                                                <th className="text-left p-4 font-semibold text-sm text-amber-800">Plafon</th>
                                                <th className="text-left p-4 font-semibold text-sm text-amber-800">Status</th>
                                                <th className="text-left p-4 font-semibold text-sm text-amber-800">Tanggal</th>
                                                <th className="text-center p-4 font-semibold text-sm text-amber-800">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredApplications.map(app => {
                                                const actionItems = getActionMenuItems(app)

                                                return (
                                                    <tr key={app.id} className="border-t border-amber-100 hover:bg-amber-50/50 transition-colors duration-200">
                                                        <td className="p-4 font-medium text-gray-800">{app.id}</td>
                                                        <td className="p-4">
                                                            <div>
                                                                <p className="font-medium text-gray-800">{app.applicantName}</p>
                                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                    <Mail className="w-3 h-3" />
                                                                    {app.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div>
                                                                <p className="font-medium text-gray-800">{app.objectType}</p>
                                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                    <Package className="w-3 h-3" />
                                                                    {app.weight}g - {app.karat}K
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-green-600 font-medium">
                                                                {formatCurrency(app.estimatedValue)}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-blue-600 font-bold">
                                                                {formatCurrency(app.loanAmount)}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex flex-col gap-1">
                                                                {getStatusBadge(app.status)}
                                                                <span className="text-xs text-gray-500">
                                                                    {getStatusDescription(app.status)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {app.submittedDate}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <span className="sr-only">Buka menu</span>
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-48">
                                                                    {actionItems.map((item, index) => (
                                                                        <DropdownMenuItem
                                                                            key={index}
                                                                            onClick={item.onClick}
                                                                            className={item.className}
                                                                        >
                                                                            <item.icon className="w-4 h-4 mr-2" />
                                                                            {item.label}
                                                                        </DropdownMenuItem>
                                                                    ))}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredApplications.length === 0 && (
                                    <div className="text-center py-12">
                                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg mb-2">Tidak ada pengajuan yang ditemukan</p>
                                        {searchQuery && (
                                            <Button
                                                variant="link"
                                                onClick={() => setSearchQuery('')}
                                                className="mt-2"
                                            >
                                                Reset pencarian
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {filteredApplications.length > 0 && (
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div>
                                            Menampilkan <span className="font-semibold">{filteredApplications.length}</span> dari <span className="font-semibold">{applications.length}</span> pengajuan
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" disabled>
                                                Sebelumnya
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                1
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Selanjutnya
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )

            case 'analytics':
                return (
                    <Card className="border-amber-200">
                        <CardHeader>
                            <CardTitle className="text-amber-800">Analytics & Reports</CardTitle>
                            <CardDescription>Statistik dan laporan performa sistem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">Trend Pengajuan</h3>
                                        <div className="h-48 bg-amber-50 rounded-lg flex items-center justify-center">
                                            <p className="text-gray-500">Chart akan ditampilkan di sini</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">Distribusi Status</h3>
                                        <div className="h-48 bg-amber-50 rounded-lg flex items-center justify-center">
                                            <p className="text-gray-500">Pie chart akan ditampilkan di sini</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-amber-200 pt-6">
                                    <h3 className="font-semibold text-gray-700 mb-4">Data Ekspor</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export PDF
                                        </Button>
                                        <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export Excel
                                        </Button>
                                        <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export CSV
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            case 'users':
                return (
                    <Card className="border-amber-200">
                        <CardHeader>
                            <CardTitle className="text-amber-800">User Management</CardTitle>
                            <CardDescription>Kelola pengguna dan hak akses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Alert className="border-amber-200 bg-amber-50">
                                    <AlertDescription className="text-amber-800">
                                        Fitur manajemen pengguna sedang dalam pengembangan. Akan segera hadir!
                                    </AlertDescription>
                                </Alert>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Card className="border-amber-100">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Total Users</p>
                                                    <p className="text-2xl font-bold text-amber-600">0</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            case 'settings':
                return (
                    <Card className="border-amber-200">
                        <CardHeader>
                            <CardTitle className="text-amber-800">System Settings</CardTitle>
                            <CardDescription>Pengaturan sistem dan konfigurasi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <Alert className="border-amber-200 bg-amber-50">
                                    <AlertDescription className="text-amber-800">
                                        Halaman pengaturan sedang dalam pengembangan. Akan segera hadir!
                                    </AlertDescription>
                                </Alert>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-700">Fitur yang akan datang</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            Pengaturan Notifikasi
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            Konfigurasi Email
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            Manajemen Role
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-amber-500" />
                                            Backup Database
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
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
                        <span className="text-xl font-bold text-amber-800">Admin Panel</span>
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
                                <p className="font-semibold text-gray-800">{user?.name || 'Administrator'}</p>
                                <p className="text-xs text-gray-500">Admin Panel</p>
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
                            {/* <h1 className="text-xl font-bold text-amber-800 hidden sm:block">{pageTitle}</h1> */}
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
                                    <Bell className="w-5 h-5" />
                                </Button>
                            </div>
                            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0">
                                {user?.role || 'Super Admin'}
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
                                        {activeSection === 'dashboard' && 'Ringkasan aktivitas dan statistik sistem gadai emas'}
                                        {activeSection === 'applications' && 'Kelola semua pengajuan gadai emas dari pelanggan'}
                                        {activeSection === 'analytics' && 'Analisis data dan laporan performa sistem'}
                                        {activeSection === 'users' && 'Manajemen pengguna dan hak akses sistem'}
                                        {activeSection === 'settings' && 'Pengaturan sistem dan konfigurasi aplikasi'}
                                    </p>
                                </div>
                                {activeSection === 'applications' && filteredApplications.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 px-4 py-2 rounded-lg">
                                        <Filter className="w-4 h-4" />
                                        <span>
                                            Menampilkan <span className="font-semibold text-amber-700">{filteredApplications.length}</span> dari <span className="font-semibold text-amber-700">{applications.length}</span> pengajuan
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
                                <p>© 2024 GoldPledge - Sistem Gadai Emas Digital</p>
                                <Badge variant="outline" className="text-xs">v1.0.0</Badge>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Sistem aktif
                                </span>
                                <span className="hidden md:inline">|</span>
                                <span>{applications.length} pengajuan total</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Dialog Konfirmasi Logout */}
            <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-amber-800 flex items-center gap-2">
                            <LogOut className="w-5 h-5" />
                            Konfirmasi Logout
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin logout dari admin panel?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                        <Alert className="border-amber-200 bg-amber-50">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <AlertDescription className="text-amber-800">
                                Anda akan diarahkan ke halaman login setelah logout.
                            </AlertDescription>
                        </Alert>
                        <DialogFooter className="sm:justify-start gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setLogoutDialogOpen(false)}
                                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex-1"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Ya, Logout
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialogs untuk Pengajuan */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {dialogType === 'view' && selectedApp && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-amber-800 flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    Detail Pengajuan
                                </DialogTitle>
                                <DialogDescription>
                                    ID: {selectedApp.id} | Estimasi ID: {selectedApp.estimationId}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                                {/* Informasi Pemohon */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Informasi Pemohon
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                                                    <p className="font-medium">{selectedApp.applicantName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-medium">{selectedApp.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Telepon</p>
                                                    <p className="font-medium">{selectedApp.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Cabang</p>
                                                    <p className="font-medium">{selectedApp.branch}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Barang Gadai */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Informasi Barang Gadai
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm text-gray-600">Jenis Barang</p>
                                                <p className="font-medium">{selectedApp.objectType}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Berat</p>
                                                    <p className="font-medium">{selectedApp.weight} gram</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Kadar</p>
                                                    <p className="font-medium">{selectedApp.karat}K</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Nilai</p>
                                                <p className="font-bold text-green-600 text-lg">{formatCurrency(selectedApp.estimatedValue)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Plafon Pinjaman</p>
                                                <p className="font-bold text-blue-600 text-lg">{formatCurrency(selectedApp.loanAmount)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Status */}
                                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Informasi Status
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Status Pengajuan</p>
                                            <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {getStatusDescription(selectedApp.status)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Tanggal Pengajuan</p>
                                            <p className="font-medium">{selectedApp.submittedDate}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                ID: {selectedApp.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Catatan */}
                                {selectedApp.status === 'REJECTED' && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                        <AlertDescription className="text-red-800">
                                            Pengajuan ini ditolak. Pemohon telah menerima notifikasi penolakan.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {selectedApp.status === 'COMPLETED' && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <AlertDescription className="text-green-800">
                                            Pengajuan ini telah selesai. Dana telah dicairkan kepada pemohon.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </>
                    )}

                    {dialogType === 'process' && selectedApp && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-blue-800 flex items-center gap-2">
                                    <Play className="w-5 h-5" />
                                    Proses Pengajuan
                                </DialogTitle>
                                <DialogDescription>
                                    Anda akan memproses pengajuan dari <span className="font-semibold">{selectedApp.applicantName}</span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Alert className="border-blue-200 bg-blue-50">
                                    <Play className="w-4 h-4 text-blue-600" />
                                    <AlertDescription className="text-blue-800">
                                        Pengajuan akan dipindahkan ke status <span className="font-bold">"Diproses"</span> untuk diverifikasi lebih lanjut.
                                    </AlertDescription>
                                </Alert>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-2">Detail yang akan diproses:</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>Nama: <span className="font-medium">{selectedApp.applicantName}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            <span>Barang: <span className="font-medium">{selectedApp.objectType}</span> ({selectedApp.weight}g, {selectedApp.karat}K)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            <span>Nilai: <span className="font-medium text-green-600">{formatCurrency(selectedApp.estimatedValue)}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-blue-600" />
                                            <span>Plafon: <span className="font-medium text-blue-600">{formatCurrency(selectedApp.loanAmount)}</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                    Batal
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                    onClick={handleProcess}
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Proses Pengajuan
                                </Button>
                            </DialogFooter>
                        </>
                    )}

                    {dialogType === 'approve' && selectedApp && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-green-800 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Setujui Pengajuan
                                </DialogTitle>
                                <DialogDescription>
                                    Anda akan menyetujui pengajuan dari <span className="font-semibold">{selectedApp.applicantName}</span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        Plafon pinjaman sebesar <span className="font-bold">{formatCurrency(selectedApp.loanAmount)}</span> akan disetujui.
                                    </AlertDescription>
                                </Alert>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-2">Detail yang akan disetujui:</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>Nama: <span className="font-medium">{selectedApp.applicantName}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            <span>Barang: <span className="font-medium">{selectedApp.objectType}</span> ({selectedApp.weight}g, {selectedApp.karat}K)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            <span>Nilai: <span className="font-medium text-green-600">{formatCurrency(selectedApp.estimatedValue)}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-blue-600" />
                                            <span>Plafon: <span className="font-medium text-blue-600">{formatCurrency(selectedApp.loanAmount)}</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                    Batal
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                    onClick={handleApprove}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Setujui Pengajuan
                                </Button>
                            </DialogFooter>
                        </>
                    )}

                    {dialogType === 'reject' && selectedApp && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-red-800 flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Tolak Pengajuan
                                </DialogTitle>
                                <DialogDescription>
                                    Anda akan menolak pengajuan dari <span className="font-semibold">{selectedApp.applicantName}</span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Alasan Penolakan *</Label>
                                    <Textarea
                                        placeholder="Jelaskan alasan penolakan secara detail..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={4}
                                        className="mt-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Alasan ini akan dikirimkan ke pemohon via email.</p>
                                </div>
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        Penolakan tidak dapat dibatalkan. Pemohon akan menerima notifikasi penolakan.
                                    </AlertDescription>
                                </Alert>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                    Batal
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                    onClick={handleReject}
                                    disabled={!rejectionReason.trim()}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Tolak Pengajuan
                                </Button>
                            </DialogFooter>
                        </>
                    )}

                    {dialogType === 'complete' && selectedApp && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-gray-800 flex items-center gap-2">
                                    <CheckCheck className="w-5 h-5" />
                                    Tandai Selesai
                                </DialogTitle>
                                <DialogDescription>
                                    Anda akan menyelesaikan pengajuan dari <span className="font-semibold">{selectedApp.applicantName}</span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Alert className="border-gray-200 bg-gray-50">
                                    <CheckCheck className="w-4 h-4 text-gray-600" />
                                    <AlertDescription className="text-gray-800">
                                        Pengajuan akan ditandai sebagai <span className="font-bold">"Selesai"</span>. Pastikan dana sudah dicairkan kepada pemohon.
                                    </AlertDescription>
                                </Alert>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-2">Detail yang akan diselesaikan:</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>Nama: <span className="font-medium">{selectedApp.applicantName}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            <span>Barang: <span className="font-medium">{selectedApp.objectType}</span> ({selectedApp.weight}g, {selectedApp.karat}K)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-blue-600" />
                                            <span>Plafon: <span className="font-medium text-blue-600">{formatCurrency(selectedApp.loanAmount)}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>Status saat ini: <span className="font-medium">Disetujui</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                    Batal
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                                    onClick={handleComplete}
                                >
                                    <CheckCheck className="w-4 h-4 mr-2" />
                                    Tandai Selesai
                                </Button>
                            </DialogFooter>
                        </>
                    )}

                    {dialogType === 'delete' && selectedApp && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-red-800 flex items-center gap-2">
                                    <Trash2 className="w-5 h-5" />
                                    Hapus Pengajuan
                                </DialogTitle>
                                <DialogDescription>
                                    Anda akan menghapus pengajuan dari <span className="font-semibold">{selectedApp.applicantName}</span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Alert className="border-red-200 bg-red-50">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        <strong className="font-bold">Peringatan:</strong> Tindakan ini tidak dapat dibatalkan. Semua data terkait pengajuan ini akan dihapus permanen dari sistem.
                                    </AlertDescription>
                                </Alert>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-2">Data yang akan dihapus:</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            <span>ID Pengajuan: <span className="font-medium">{selectedApp.id}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>Nama Pemohon: <span className="font-medium">{selectedApp.applicantName}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>Email: <span className="font-medium">{selectedApp.email}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <span>Telepon: <span className="font-medium">{selectedApp.phone}</span></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            <span>Nilai: <span className="font-medium">{formatCurrency(selectedApp.estimatedValue)}</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                    Batal
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Hapus Permanen
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Komponen Bell untuk notifikasi
const Bell = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
)