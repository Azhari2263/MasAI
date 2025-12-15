'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/AuthContext'
import { useEstimation } from '@/contexts/EstimationContext'
import ImageUpload from '@/components/ImageUpload'
import { UserTrackingSection, UserHistorySection } from '@/components/UserTracking'
import {
    Sparkles, Home, FileText, Calculator, MapPin, User,
    Clock, TrendingUp, LogOut, Menu, X, ChevronLeft
} from 'lucide-react'

export default function Dashboard() {
    const { user, logout } = useAuth()
    const { getUserEstimations, getUserApplications } = useEstimation()
    const [activeSection, setActiveSection] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const menuItems = [
        { id: 'overview', label: 'Beranda', icon: Home },
        { id: 'estimation', label: 'Estimasi Emas', icon: Calculator },
        { id: 'tracking', label: 'Tracking Pengajuan', icon: MapPin },
        { id: 'history', label: 'Riwayat Transaksi', icon: FileText },
        { id: 'profile', label: 'Profil Pengguna', icon: User },
    ]

    const currentMenuItem = menuItems.find(item => item.id === activeSection)
    const pageTitle = currentMenuItem ? currentMenuItem.label : 'Dashboard'

    // Get user data
    const userEstimations = getUserEstimations()
    const userApplications = getUserApplications()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true)
            } else {
                setSidebarOpen(false)
            }
        }
        handleResize()
    }, [])

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSidebarOpen(false)
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <Card className="border-amber-200">
                    <CardContent className="pt-6">
                        <p className="text-amber-800">Loading...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                            <CardHeader>
                                <CardTitle className="text-amber-800">Selamat Datang, {user.name}!</CardTitle>
                                <CardDescription>Sistem Penaksir Emas Cerdas Berbasis AI</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-amber-100">
                                        <Calculator className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-amber-600">{userEstimations.length}</div>
                                        <p className="text-sm text-gray-600">Total Estimasi</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-amber-100">
                                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-blue-600">{userApplications.length}</div>
                                        <p className="text-sm text-gray-600">Pengajuan Gadai</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-amber-100">
                                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-green-600">
                                            Rp {(userEstimations.reduce((sum, e) => sum + e.max_loan_amount, 0) / 1000000).toFixed(1)}jt
                                        </div>
                                        <p className="text-sm text-gray-600">Total Plafon</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-amber-200">
                            <CardHeader>
                                <CardTitle className="text-amber-800">Aktivitas Terbaru</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {userEstimations.length > 0 ? (
                                    <div className="space-y-3">
                                        {userEstimations.slice(0, 3).map((estimation) => (
                                            <div key={estimation.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {estimation.image_url && (
                                                        <img
                                                            src={estimation.image_url}
                                                            alt={estimation.object_type}
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {estimation.object_type} - {estimation.karat}K
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(estimation.created_at).toLocaleDateString('id-ID')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-amber-100 text-amber-800">
                                                    {estimation.status}
                                                </Badge>
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
                    </div>
                )

            case 'estimation':
                return (
                    <Card className="border-amber-200">
                        <CardHeader className="text-center">
                            <CardTitle className="text-amber-800">Estimasi Emas dengan AI</CardTitle>
                            <CardDescription>Upload foto emas Anda dan dapatkan estimasi harga secara instan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-6 flex justify-center">
                                <ImageUpload />
                            </div>
                        </CardContent>
                    </Card>
                )

            case 'tracking':
                return <UserTrackingSection />

            case 'history':
                return <UserHistorySection />

            case 'profile':
                return (
                    <Card className="border-amber-200">
                        <CardHeader>
                            <CardTitle className="text-amber-800">Profil Pengguna</CardTitle>
                            <CardDescription>Kelola informasi akun Anda</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Nama</label>
                                    <p className="text-lg">{user.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-lg">{user.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Telepon</label>
                                    <p className="text-lg">{user.phone || 'Belum diisi'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Role</label>
                                    <Badge className={
                                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                                                'bg-green-100 text-green-800'
                                    }>
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-amber-200">
                                <h3 className="font-semibold text-amber-800 mb-3">Statistik Pengguna</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                                        <p className="text-2xl font-bold text-amber-600">{userEstimations.length}</p>
                                        <p className="text-sm text-gray-600">Total Estimasi</p>
                                    </div>
                                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">{userApplications.length}</p>
                                        <p className="text-sm text-gray-600">Pengajuan</p>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-amber-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-amber-200 h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-amber-800">MasAI</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
                    {menuItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeSection === item.id ? 'default' : 'ghost'}
                            className={`w-full justify-start ${activeSection === item.id ? 'bg-amber-500 text-white hover:bg-amber-600' : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'}`}
                            onClick={() => {
                                setActiveSection(item.id)
                                if (window.innerWidth < 1024) setSidebarOpen(false)
                            }}
                        >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.label}
                        </Button>
                    ))}
                </nav>
            </aside>

            <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-amber-200 h-16">
                    <div className="container mx-auto px-4 h-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-amber-50 text-amber-800">
                                {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                            <h1 className="text-xl font-bold text-amber-800 hidden sm:block">{pageTitle}</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 hidden md:block">Halo, {user.name}</span>
                            <Button variant="outline" size="sm" onClick={logout} className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300">
                                <LogOut className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Keluar</span>
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8">
                    <div className="container mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    )
}