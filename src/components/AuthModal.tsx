'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from '@/contexts/AuthContext'
import { LogIn, UserPlus, Eye, EyeOff, Mail, Phone, Lock, User, X } from 'lucide-react'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    defaultTab?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
    const { login, register, isLoading } = useAuth()
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })

    // Handler Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!loginData.email || !loginData.password) {
            setError('Email dan password harus diisi');
            return
        }
        const success = await login(loginData.email, loginData.password)
        if (success) {
            onClose();
            setLoginData({ email: '', password: '' })
        } else {
            setError('Email atau password salah')
        }
    }

    // Handler Register dengan validasi lengkap
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const { name, email, phone, password, confirmPassword } = registerData

        if (!name || !email || !phone || !password || !confirmPassword) {
            setError('Semua field harus diisi')
            return
        }

        if (password !== confirmPassword) {
            setError('Password dan konfirmasi harus sama')
            return
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter')
            return
        }

        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/
        if (!regex.test(password)) {
            setError('Password harus mengandung huruf, angka, dan simbol')
            return
        }

        const success = await register(registerData)
        if (success) {
            onClose()
            setRegisterData({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
        } else {
            setError('Registrasi gagal')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-amber-100/90 via-orange-100/90 to-yellow-100/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md border-amber-200 shadow-2xl bg-white/95 relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <CardHeader className="text-center pt-6 pb-2">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-amber-800 text-xl font-bold">MasAI</CardTitle>
                            <CardDescription className="text-xs">Sistem Penaksir Emas AI</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
                        <TabsList className="grid w-full grid-cols-2 bg-amber-50 h-9 mb-4">
                            <TabsTrigger value="login" className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-white">Masuk</TabsTrigger>
                            <TabsTrigger value="register" className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-white">Daftar</TabsTrigger>
                        </TabsList>

                        {/* Login Form */}
                        <TabsContent value="login" className="mt-0">
                            <form onSubmit={handleLogin} className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="email" className="text-xs text-gray-600">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-amber-600/50" />
                                        <Input
                                            id="email" type="email" placeholder="nama@email.com"
                                            className="pl-9 h-9 text-sm border-amber-200 focus:border-amber-500"
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
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Masukkan password"
                                            className="pr-10 h-9 text-sm border-amber-200 focus:border-amber-500 text-left"
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
                                {error && <Alert className="py-2 px-3 border-red-200 bg-red-50"><AlertDescription className="text-red-800 text-xs">{error}</AlertDescription></Alert>}

                                <Button type="submit" className="w-full h-9 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm shadow-sm" disabled={isLoading}>
                                    {isLoading ? '...' : 'Masuk'}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Register Form */}
                        <TabsContent value="register" className="mt-0">
                            <form onSubmit={handleRegister} className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="reg-name" className="text-xs">Nama</Label>
                                        <Input
                                            id="reg-name" placeholder="John"
                                            className="h-9 text-sm border-amber-200"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="reg-phone" className="text-xs">HP</Label>
                                        <Input
                                            id="reg-phone" placeholder="081..."
                                            className="h-9 text-sm border-amber-200"
                                            value={registerData.phone}
                                            onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="reg-email" className="text-xs">Email</Label>
                                    <Input
                                        id="reg-email" type="email" placeholder="nama@email.com"
                                        className="h-9 text-sm border-amber-200"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {/* Password */}
                                    <div className="space-y-1 relative">
                                        <Label htmlFor="reg-password" className="text-xs">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="reg-password"
                                                type={showPassword ? 'text' : 'password'}
                                                className="h-9 text-sm border-amber-200 pr-10"
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
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
                                    {/* Konfirmasi Password */}
                                    <div className="space-y-1 relative">
                                        <Label htmlFor="reg-confirm" className="text-xs">Konfirmasi</Label>
                                        <div className="relative">
                                            <Input
                                                id="reg-confirm"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                className="h-9 text-sm border-amber-200 pr-10"
                                                value={registerData.confirmPassword}
                                                onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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

                                {error && <Alert className="py-2 border-red-200 bg-red-50"><AlertDescription className="text-red-800 text-xs">{error}</AlertDescription></Alert>}

                                <Button type="submit" className="w-full h-9 mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm" disabled={isLoading}>
                                    {isLoading ? '...' : 'Daftar'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
