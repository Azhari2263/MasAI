'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert" // Tambahkan ini
import { useAuth } from '@/contexts/AuthContext'
import ImageUpload from '@/components/ImageUpload' // Tambahkan ini
import {
    Sparkles,
    Home,
    FileText,
    Calculator,
    MapPin,
    User,
    Clock,
    TrendingUp,
    LogOut,
    Search, // Tambahkan ini
    CheckCircle, // Tambahkan ini
    Info // Tambahkan ini
} from 'lucide-react'

export default function Dashboard() {
    const { user, logout } = useAuth()
    const [activeSection, setActiveSection] = useState('overview')

    // Tambahkan fungsi ini
    const trackApplication = (applicationId: string) => {
        console.log('Tracking application:', applicationId)
        // Implementasi logika tracking di sini
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <Card className="border-amber-200">
                    <CardContent className="pt-6">
                        <p className="text-amber-800">Anda harus login untuk mengakses halaman ini.</p>
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
                                <CardDescription>
                                    Sistem Penaksir Emas Cerdas Berbasis AI
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-white rounded-lg">
                                        <Calculator className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-amber-600">0</div>
                                        <p className="text-sm text-gray-600">Estimasi Aktif</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg">
                                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-blue-600">0</div>
                                        <p className="text-sm text-gray-600">Pengajuan Gadai</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg">
                                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-green-600">Rp 0</div>
                                        <p className="text-sm text-gray-600">Total Plafon</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* <Card className="border-amber-200">
                            <CardHeader>
                                <CardTitle className="text-amber-800">Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    onClick={() => setActiveSection('estimation')}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                >
                                    <Calculator className="w-4 h-4 mr-2" />
                                    Buat Estimasi Emas Baru
                                </Button>
                            </CardContent>
                        </Card> */}

                        <Card className="border-amber-200">
                            <CardHeader>
                                <CardTitle className="text-amber-800">Aktivitas Terbaru</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p>Belum ada aktivitas</p>
                                    <p className="text-sm">Mulai dengan membuat estimasi emas pertama Anda</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )

            // --- CASE UNTUK ESTIMASI (FITUR DEMO DIGABUNG DI SINI) ---
            case 'estimation':
                return (
                    <Card className="border-amber-200">
                        <CardHeader className="text-center">
                            <CardTitle className="text-amber-800">Estimasi Emas dengan AI</CardTitle>
                            <CardDescription>
                                Upload foto emas Anda dan dapatkan estimasi harga secara instan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Komponen inti untuk upload (dari fitur "demo") */}
                            <div className="mt-6 flex justify-center">
                                <ImageUpload />
                            </div>
                        </CardContent>
                    </Card>
                )

            // --- CASE TERPISAH UNTUK TRACKING ---
            case 'tracking':
                return (
                    <div className="mt-8 max-w-4xl mx-auto">
                        <Card className="border-amber-200">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl text-amber-800">Tracking Pengajuan Gadai</CardTitle>
                                <CardDescription>
                                    Monitor status pengajuan gadai emas Anda secara real-time
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Search Form */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Masukkan nomor pengajuan..."
                                            className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            id="tracking-input"
                                        />
                                    </div>
                                    <Button
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                        onClick={() => {
                                            const input = document.getElementById('tracking-input') as HTMLInputElement;
                                            if (input.value) {
                                                // Gunakan ID contoh untuk demo
                                                input.value = 'EST-1705123456789-SAMPLE';
                                                trackApplication(input.value);
                                            }
                                        }}
                                    >
                                        <Search className="w-4 h-4 mr-2" />
                                        Cari
                                    </Button>
                                </div>

                                {/* Sample Tracking Info */}
                                <Alert className="border-amber-200 bg-amber-50">
                                    <Info className="w-4 h-4 text-amber-600" />
                                    <AlertDescription className="text-sm text-amber-800">
                                        <strong>Demo:</strong> Gunakan ID <code>EST-1705123456789-SAMPLE</code> untuk melihat contoh tracking.
                                    </AlertDescription>
                                </Alert>

                                {/* Status Timeline */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-amber-800">Status Pengajuan</h3>

                                    <div className="space-y-4">
                                        {/* ... (Isi timeline status tetap sama) ... */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-green-700">Pengajuan Dibuat</h4>
                                                    <span className="text-sm text-gray-500">12 Jan 2024, 10:30</span>
                                                </div>
                                                <p className="text-sm text-gray-600">Pengajuan gadai telah berhasil dibuat</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-green-700">Analisis AI Selesai</h4>
                                                    <span className="text-sm text-gray-500">12 Jan 2024, 10:35</span>
                                                </div>
                                                <p className="text-sm text-gray-600">Analisis AI dan estimasi nilai selesai</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-blue-700">Menunggu Verifikasi</h4>
                                                    <span className="text-sm text-gray-500">12 Jan 2024, 11:00</span>
                                                </div>
                                                <p className="text-sm text-gray-600">Menunggu verifikasi fisik di cabang</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-gray-500">Disetujui/Ditolak</h4>
                                                    <span className="text-sm text-gray-400">Menunggu</span>
                                                </div>
                                                <p className="text-sm text-gray-400">Keputusan final akan segera diproses</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Application Details */}
                                <Card className="border-amber-200 bg-amber-50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-amber-800">Detail Pengajuan</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm text-gray-600">Nomor Pengajuan</span>
                                                <p className="font-medium">EST-1705123456789-SAMPLE</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Nama Pemohon</span>
                                                <p className="font-medium">Ahmad Wijaya</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Jenis Emas</span>
                                                <p className="font-medium">Kalung 22K</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Estimasi Berat</span>
                                                <p className="font-medium">12.5 gram</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Estimasi Nilai</span>
                                                <p className="font-medium text-green-600">Rp 15.625.000</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Plafon Pinjaman</span>
                                                <p className="font-medium text-blue-600">Rp 12.500.000</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>
                )

            case 'history':
                return (
                    <Card className="border-amber-200">
                        <CardHeader>
                            <CardTitle className="text-amber-800">Riwayat Estimasi</CardTitle>
                            <CardDescription>
                                Lihat semua estimasi yang telah Anda buat
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p>Belum ada riwayat estimasi</p>
                            </div>
                        </CardContent>
                    </Card>
                )

            case 'profile':
                return (
                    <Card className="border-amber-200">
                        <CardHeader>
                            <CardTitle className="text-amber-800">Profil Pengguna</CardTitle>
                            <CardDescription>
                                Kelola informasi akun Anda
                            </CardDescription>
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
                        </CardContent>
                    </Card>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {/* Header */}
            <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-amber-800">MasAI Dashboard</h1>
                                <p className="text-xs text-amber-600">Sistem Penaksir Emas Cerdas</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={logout}
                                className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Keluar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <Card className="border-amber-200">
                            <CardContent className="pt-6">
                                <nav className="space-y-2">
                                    <Button
                                        variant={activeSection === 'overview' ? 'default' : 'ghost'}
                                        className={activeSection === 'overview'
                                            ? 'w-full justify-start bg-amber-500 text-white hover:bg-amber-600'
                                            : 'w-full justify-start text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                                        }
                                        onClick={() => setActiveSection('overview')}
                                    >
                                        <Home className="w-4 h-4 mr-2" />
                                        Beranda
                                    </Button>
                                    <Button
                                        variant={activeSection === 'estimation' ? 'default' : 'ghost'}
                                        className={activeSection === 'estimation'
                                            ? 'w-full justify-start bg-amber-500 text-white hover:bg-amber-600'
                                            : 'w-full justify-start text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                                        }
                                        onClick={() => setActiveSection('estimation')}
                                    >
                                        <Calculator className="w-4 h-4 mr-2" />
                                        Estimasi Emas
                                    </Button>
                                    <Button
                                        variant={activeSection === 'tracking' ? 'default' : 'ghost'}
                                        className={activeSection === 'tracking'
                                            ? 'w-full justify-start bg-amber-500 text-white hover:bg-amber-600'
                                            : 'w-full justify-start text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                                        }
                                        onClick={() => setActiveSection('tracking')}
                                    >
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Tracking
                                    </Button>
                                    <Button
                                        variant={activeSection === 'history' ? 'default' : 'ghost'}
                                        className={activeSection === 'history'
                                            ? 'w-full justify-start bg-amber-500 text-white hover:bg-amber-600'
                                            : 'w-full justify-start text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                                        }
                                        onClick={() => setActiveSection('history')}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Riwayat
                                    </Button>
                                    <Button
                                        variant={activeSection === 'profile' ? 'default' : 'ghost'}
                                        className={activeSection === 'profile'
                                            ? 'w-full justify-start bg-amber-500 text-white hover:bg-amber-600'
                                            : 'w-full justify-start text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                                        }
                                        onClick={() => setActiveSection('profile')}
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Profil
                                    </Button>
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}