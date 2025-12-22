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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    Edit,
    Trash2,
    MoreVertical,
    Search,
    Filter,
    Download,
    Send,
    AlertTriangle,
    Calendar,
    DollarSign,
    Shield,
    Home,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft
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
            objectType: 'Kalung',
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
            objectType: 'Cincin',
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
            objectType: 'Gelang',
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
            objectType: 'Liontin',
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
            objectType: 'Gelang',
            weight: 20.0,
            karat: 18,
            estimatedValue: 25000000,
            loanAmount: 18750000,
            status: 'COMPLETED',
            submittedDate: '2024-01-09 16:30',
            branch: 'Jakarta Timur'
        }
    ])

    const [selectedApp, setSelectedApp] = useState<Application | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState<'view' | 'approve' | 'reject' | 'delete'>('view')
    const [rejectionReason, setRejectionReason] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [activeSection, setActiveSection] = useState('applications')
    const [sidebarOpen, setSidebarOpen] = useState(false)

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
        { label: 'Total Pengajuan', value: applications.length, icon: FileText, color: 'amber' },
        { label: 'Menunggu', value: applications.filter(a => a.status === 'PENDING').length, icon: Clock, color: 'yellow' },
        { label: 'Diproses', value: applications.filter(a => a.status === 'PROCESSING').length, icon: TrendingUp, color: 'blue' },
        { label: 'Disetujui', value: applications.filter(a => a.status === 'APPROVED').length, icon: CheckCircle, color: 'green' },
        { label: 'Ditolak', value: applications.filter(a => a.status === 'REJECTED').length, icon: XCircle, color: 'red' },
        { label: 'Selesai', value: applications.filter(a => a.status === 'COMPLETED').length, icon: Shield, color: 'gray' }
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
            PENDING: { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-800' },
            PROCESSING: { label: 'Diproses', class: 'bg-blue-100 text-blue-800' },
            APPROVED: { label: 'Disetujui', class: 'bg-green-100 text-green-800' },
            REJECTED: { label: 'Ditolak', class: 'bg-red-100 text-red-800' },
            COMPLETED: { label: 'Selesai', class: 'bg-gray-100 text-gray-800' }
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Badge className={config.class}>{config.label}</Badge>
    }

    const openDialog = (app: Application, type: 'view' | 'approve' | 'reject' | 'delete') => {
        setSelectedApp(app)
        setDialogType(type)
        setDialogOpen(true)
        setRejectionReason('')
    }

    const handleApprove = () => {
        if (selectedApp) {
            setApplications(applications.map(app =>
                app.id === selectedApp.id ? { ...app, status: 'APPROVED' } : app
            ))
            setDialogOpen(false)
        }
    }

    const handleReject = () => {
        if (selectedApp && rejectionReason) {
            setApplications(applications.map(app =>
                app.id === selectedApp.id ? { ...app, status: 'REJECTED' } : app
            ))
            setDialogOpen(false)
        }
    }

    const handleDelete = () => {
        if (selectedApp) {
            setApplications(applications.filter(app => app.id !== selectedApp.id))
            setDialogOpen(false)
        }
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
            app.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <Card key={index} className="border-amber-200 hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">{stat.label}</p>
                                                <p className="text-2xl md:text-3xl font-bold text-amber-600">{stat.value}</p>
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
                                    <div className="space-y-3">
                                        {applications.slice(0, 5).map(app => (
                                            <div key={app.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{app.applicantName}</p>
                                                        <p className="text-xs text-gray-500">{app.submittedDate}</p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(app.status)}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-amber-200">
                                <CardHeader>
                                    <CardTitle className="text-amber-800">Statistik Cepat</CardTitle>
                                </CardHeader>
                                <CardContent>
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
                                </CardContent>
                            </Card>
                        </div>
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
                                        <CardDescription>Approve, reject, atau hapus pengajuan pengguna</CardDescription>
                                    </div>
                                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Data
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari nama, ID, atau email..."
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

                                <div className="border rounded-lg overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-amber-50">
                                            <tr>
                                                <th className="text-left p-3 font-semibold text-sm">ID</th>
                                                <th className="text-left p-3 font-semibold text-sm">Pemohon</th>
                                                <th className="text-left p-3 font-semibold text-sm">Objek</th>
                                                <th className="text-left p-3 font-semibold text-sm">Nilai</th>
                                                <th className="text-left p-3 font-semibold text-sm">Plafon</th>
                                                <th className="text-left p-3 font-semibold text-sm">Status</th>
                                                <th className="text-left p-3 font-semibold text-sm">Tanggal</th>
                                                <th className="text-center p-3 font-semibold text-sm">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredApplications.map(app => (
                                                <tr key={app.id} className="border-t hover:bg-amber-50/50 transition-colors">
                                                    <td className="p-3 font-medium">{app.id}</td>
                                                    <td className="p-3">
                                                        <div>
                                                            <p className="font-medium">{app.applicantName}</p>
                                                            <p className="text-xs text-gray-500">{app.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div>
                                                            <p>{app.objectType}</p>
                                                            <p className="text-xs text-gray-500">{app.weight}g - {app.karat}K</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">{formatCurrency(app.estimatedValue)}</td>
                                                    <td className="p-3 font-medium text-blue-600">{formatCurrency(app.loanAmount)}</td>
                                                    <td className="p-3">{getStatusBadge(app.status)}</td>
                                                    <td className="p-3 text-sm">{app.submittedDate}</td>
                                                    <td className="p-3">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => openDialog(app, 'view')}>
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    Lihat Detail
                                                                </DropdownMenuItem>
                                                                {app.status === 'PENDING' && (
                                                                    <>
                                                                        <DropdownMenuItem onClick={() => openDialog(app, 'approve')}>
                                                                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                                                            Setujui
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => openDialog(app, 'reject')}>
                                                                            <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                                                            Tolak
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                                <DropdownMenuItem
                                                                    onClick={() => openDialog(app, 'delete')}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredApplications.length === 0 && (
                                    <div className="text-center py-12">
                                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Tidak ada pengajuan yang ditemukan</p>
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
                                <div className="border-t pt-6">
                                    <h3 className="font-semibold text-gray-700 mb-4">Data Ekspor</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <Button variant="outline" className="border-amber-200">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export PDF
                                        </Button>
                                        <Button variant="outline" className="border-amber-200">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export Excel
                                        </Button>
                                        <Button variant="outline" className="border-amber-200">
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
                    {menuItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeSection === item.id ? 'default' : 'ghost'}
                            className={`w-full justify-start ${activeSection === item.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'}`}
                            onClick={() => {
                                setActiveSection(item.id)
                                if (window.innerWidth < 1024) setSidebarOpen(false)
                            }}
                        >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.label}
                        </Button>
                    ))}
                    
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
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-amber-200 h-16">
                    <div className="container mx-auto px-4 h-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                                {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                            <h1 className="text-xl font-bold text-amber-800 hidden sm:block">{pageTitle}</h1>
                            {user && (
                                <p className="text-sm text-gray-600 hidden md:block">
                                    Selamat datang, <span className="font-semibold text-amber-700">{user.name || 'Admin'}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0">
                                {user?.role || 'Administrator'}
                            </Badge>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                onClick={() => setLogoutDialogOpen(true)}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-amber-900">{pageTitle}</h1>
                                    <p className="text-gray-600 mt-1">
                                        {activeSection === 'dashboard' && 'Ringkasan aktivitas dan statistik sistem'}
                                        {activeSection === 'applications' && 'Kelola semua pengajuan gadai emas dari pelanggan'}
                                        {activeSection === 'analytics' && 'Analisis data dan laporan performa'}
                                        {activeSection === 'users' && 'Manajemen pengguna dan hak akses'}
                                        {activeSection === 'settings' && 'Pengaturan sistem dan konfigurasi'}
                                    </p>
                                </div>
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
                        </div>
                        {renderContent()}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-amber-200 bg-white/50 py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                            <p>© 2024 Admin Panel - Sistem Gadai Emas</p>
                            <p className="mt-2 md:mt-0">Versi 1.0.0</p>
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
                                className="flex-1"
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
                                <DialogDescription>ID: {selectedApp.id} | Estimasi ID: {selectedApp.estimationId}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Nama Pemohon</Label>
                                        <p className="font-medium">{selectedApp.applicantName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Email</Label>
                                        <p className="font-medium">{selectedApp.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Telepon</Label>
                                        <p className="font-medium">{selectedApp.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Cabang</Label>
                                        <p className="font-medium">{selectedApp.branch}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Jenis Objek</Label>
                                        <p className="font-medium">{selectedApp.objectType}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Berat & Karat</Label>
                                        <p className="font-medium">{selectedApp.weight}g - {selectedApp.karat}K</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Estimasi Nilai</Label>
                                        <p className="font-medium text-green-600">{formatCurrency(selectedApp.estimatedValue)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Plafon Pinjaman</Label>
                                        <p className="font-medium text-blue-600">{formatCurrency(selectedApp.loanAmount)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Status</Label>
                                        <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-600 text-sm">Tanggal Pengajuan</Label>
                                        <p className="font-medium">{selectedApp.submittedDate}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <Label className="text-gray-600 text-sm">Catatan:</Label>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {selectedApp.status === 'PENDING' && 'Pengajuan sedang menunggu persetujuan.'}
                                        {selectedApp.status === 'PROCESSING' && 'Pengajuan sedang diproses oleh tim verifikasi.'}
                                        {selectedApp.status === 'APPROVED' && 'Pengajuan telah disetujui dan siap untuk dicairkan.'}
                                        {selectedApp.status === 'REJECTED' && 'Pengajuan ditolak berdasarkan kebijakan yang berlaku.'}
                                        {selectedApp.status === 'COMPLETED' && 'Proses gadai telah selesai.'}
                                    </p>
                                </div>
                            </div>
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
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Nama: {selectedApp.applicantName}</li>
                                        <li>• Objek: {selectedApp.objectType} ({selectedApp.weight}g, {selectedApp.karat}K)</li>
                                        <li>• Nilai: {formatCurrency(selectedApp.estimatedValue)}</li>
                                        <li>• Plafon: {formatCurrency(selectedApp.loanAmount)}</li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
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
                                    <p className="text-xs text-gray-500 mt-1">Alasan ini akan dikirimkan ke pemohon.</p>
                                </div>
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        Penolakan tidak dapat dibatalkan dan pemohon akan menerima notifikasi via email.
                                    </AlertDescription>
                                </Alert>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
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
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• ID Pengajuan: {selectedApp.id}</li>
                                        <li>• Nama Pemohon: {selectedApp.applicantName}</li>
                                        <li>• Email: {selectedApp.email}</li>
                                        <li>• Telepon: {selectedApp.phone}</li>
                                        <li>• Nilai: {formatCurrency(selectedApp.estimatedValue)}</li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
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