'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { LogIn, UserPlus, Eye, EyeOff, Mail, Phone, Lock, User, X, Shield, Briefcase } from 'lucide-react'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    defaultTab?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
    const { login, register, isLoading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [registerData, setRegisterData] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        password: '', 
        confirmPassword: '' 
    })

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setError(null)
            setActiveTab(defaultTab)
            if (defaultTab === 'login') {
                setLoginData({ email: '', password: '' })
            } else {
                setRegisterData({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
            }
        }
    }, [isOpen, defaultTab])

    // Handler Login - MODIFIKASI INI
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        if (!loginData.email || !loginData.password) {
            setError('Email dan password harus diisi')
            return
        }
        
        const success = await login(loginData.email, loginData.password)
        
        if (success) {
            // Reset form
            setLoginData({ email: '', password: '' })
            setError(null)
            onClose()
            
            // Cek role user dan redirect sesuai role
            const user = JSON.parse(localStorage.getItem('masai_user') || '{}')
            
            if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
                // Admin diarahkan ke /admin
                router.push('/admin')
            } else {
                // User regular diarahkan ke /dashboard
                router.push('/dashboard')
            }
        } else {
            setError('Email atau password salah')
        }
    }

    // Handler Register - MODIFIKASI INI
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const { name, email, phone, password, confirmPassword } = registerData

        // Validasi input
        if (!name || !email || !phone || !password || !confirmPassword) {
            setError('Semua field harus diisi')
            return
        }

        if (!email.includes('@')) {
            setError('Email tidak valid')
            return
        }

        if (phone.length < 10) {
            setError('Nomor telepon minimal 10 digit')
            return
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter')
            return
        }

        if (password !== confirmPassword) {
            setError('Password dan konfirmasi password tidak sama')
            return
        }

        const success = await register(registerData)
        
        if (success) {
            // Reset form
            setRegisterData({ 
                name: '', 
                email: '', 
                phone: '', 
                password: '', 
                confirmPassword: '' 
            })
            setError(null)
            onClose()
            
            // User yang register selalu diarahkan ke dashboard
            router.push('/dashboard')
        } else {
            setError('Registrasi gagal. Email mungkin sudah digunakan.')
        }
    }

    // Demo login helper dengan role-based redirect
    const handleDemoLogin = (role: 'admin' | 'user') => {
        if (role === 'admin') {
            setLoginData({
                email: 'admin@masai.id',
                password: 'admin123'
            })
        } else {
            setLoginData({
                email: 'user@masai.id',
                password: 'user123'
            })
        }
        setActiveTab('login')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md border-amber-200 shadow-2xl bg-white relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors z-10"
                    type="button"
                >
                    <X className="w-5 h-5" />
                </button>

                <CardHeader className="text-center pt-6 pb-2">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-amber-800 text-xl font-bold">MasAI</CardTitle>
                            <CardDescription className="text-xs">Sistem Penaksir Emas Cerdas</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
                        <TabsList className="grid w-full grid-cols-2 bg-amber-50 h-9 mb-4">
                            <TabsTrigger 
                                value="login" 
                                className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all"
                            >
                                <LogIn className="w-3 h-3 mr-1" />
                                Masuk
                            </TabsTrigger>
                            <TabsTrigger 
                                value="register" 
                                className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all"
                            >
                                <UserPlus className="w-3 h-3 mr-1" />
                                Daftar
                            </TabsTrigger>
                        </TabsList>

                        {/* Login Form */}
                        <TabsContent value="login" className="mt-0 space-y-4">
                            <form onSubmit={handleLogin} className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="email" className="text-xs text-gray-600">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-amber-600/50" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="nama@email.com"
                                            className="pl-9 h-9 text-sm border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1 relative">
                                    <Label htmlFor="password" className="text-xs text-gray-600">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-amber-600/50" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Masukkan password"
                                            className="pl-9 pr-10 h-9 text-sm border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                            disabled={isLoading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-amber-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <Alert className="py-2 px-3 border-red-200 bg-red-50">
                                        <AlertDescription className="text-red-800 text-xs">{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button 
                                    type="submit" 
                                    className="w-full h-9 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm shadow-sm transition-all" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Memproses...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Masuk
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Register Form */}
                        <TabsContent value="register" className="mt-0 space-y-4">
                            <form onSubmit={handleRegister} className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="reg-name" className="text-xs">Nama Lengkap</Label>
                                    <Input
                                        id="reg-name"
                                        placeholder="Contoh: Ahmad Wijaya"
                                        className="h-9 text-sm border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="reg-email" className="text-xs">Email</Label>
                                        <Input
                                            id="reg-email"
                                            type="email"
                                            placeholder="nama@email.com"
                                            className="h-9 text-sm border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="reg-phone" className="text-xs">Telepon</Label>
                                        <Input
                                            id="reg-phone"
                                            type="tel"
                                            placeholder="081234567890"
                                            className="h-9 text-sm border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            value={registerData.phone}
                                            onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1 relative">
                                        <Label htmlFor="reg-password" className="text-xs">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="reg-password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Min. 6 karakter"
                                                className="h-9 text-sm border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pr-10"
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                                                disabled={isLoading}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-amber-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative">
                                        <Label htmlFor="reg-confirm" className="text-xs">Konfirmasi</Label>
                                        <div className="relative">
                                            <Input
                                                id="reg-confirm"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Ulangi password"
                                                className="h-9 text-sm border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pr-10"
                                                value={registerData.confirmPassword}
                                                onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                disabled={isLoading}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-amber-600"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <Alert className="py-2 border-red-200 bg-red-50">
                                        <AlertDescription className="text-red-800 text-xs">{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button 
                                    type="submit" 
                                    className="w-full h-9 mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm transition-all" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Memproses...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Daftar
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}