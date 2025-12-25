'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ChatbotWidget from '@/components/Chatbot' // ← IMPORT
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AuthModal from "@/components/AuthModal"
import { useAuth } from '@/contexts/AuthContext'
import {
  Sparkles,
  TrendingUp,
  Shield,
  Brain,
  Eye,
  Calculator,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogIn,
  UserPlus,
  Camera,
  Award,
  Star,
  ArrowRight,
  Info,
  Zap,
  Target,
  CheckCircle,
  Clock,
  Globe,
  Phone,
  Mail
} from 'lucide-react'

function LandingPage() {
  const { user, isInitialized, getRedirectPath } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const router = useRouter()

  // Redirect jika user sudah login berdasarkan role
  useEffect(() => {
    if (isInitialized && user) {
      const redirectPath = getRedirectPath()
      router.push(redirectPath)
    }
  }, [user, isInitialized, router, getRedirectPath])

  // Tampilkan loading selama initialisasi
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="text-amber-700">Memuat aplikasi...</p>
        </div>
      </div>
    )
  }

  // Jangan render landing page jika user sudah login
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="text-amber-700">
            {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' 
              ? 'Mengalihkan ke admin panel...' 
              : 'Mengalihkan ke dashboard...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  MasAI
                </h1>
                <p className="text-xs text-amber-600">Sistem Penaksir Emas Cerdas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={() => {
                  setAuthTab('login')
                  setIsAuthModalOpen(true)
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Masuk
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                onClick={() => {
                  setAuthTab('register')
                  setIsAuthModalOpen(true)
                }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Daftar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Multimodal AI & RAG</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Penaksir Emas Cerdas
            </span>
            <br />
            <span className="text-gray-800">untuk Pegadaian</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistem cerdas berbasis AI untuk estimasi nilai emas secara akurat,
            cepat, dan transparan dengan teknologi Multimodal AI dan Self-Reflective RAG
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              onClick={() => {
                setAuthTab('register')
                setIsAuthModalOpen(true)
              }}
            >
              <Camera className="w-5 h-5 mr-2" />
              Mulai Estimasi Sekarang
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={() => {
                setAuthTab('login')
                setIsAuthModalOpen(true)
              }}
            >
              <Info className="w-5 h-5 mr-2" />
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-amber-800 mb-4">Teknologi Kami</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Menggabungkan kekuatan AI, machine learning, dan knowledge base untuk memberikan estimasi emas yang akurat
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-amber-800">Multimodal AI</CardTitle>
                <CardDescription>Analisis gambar dan teks dengan deep learning</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Computer Vision untuk deteksi objek</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Image Recognition untuk identifikasi perhiasan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Pattern Recognition untuk analisis kondisi</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-amber-800">Self-Reflective RAG</CardTitle>
                <CardDescription>Validasi dengan knowledge base Pegadaian</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Retrieval dari regulasi Pegadaian</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Generation dengan context awareness</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Reflection untuk quality check</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-amber-800">Real-time Analytics</CardTitle>
                <CardDescription>Analisis data harga emas secara real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Integration dengan API Pegadaian</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Market trend analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Price prediction modeling</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-amber-800">User Experience</CardTitle>
                <CardDescription>Interface yang intuitif dan mudah digunakan</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Responsive design untuk semua device</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Progressive web app (PWA)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Real-time status updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-amber-800 mb-4">Keunggulan MasAI</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform inovatif yang menggabungkan kecerdasan buatan dengan regulasi Pegadaian
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-amber-600">95%</div>
                <p className="text-sm text-gray-600">Akurasi Estimasi</p>
              </CardContent>
            </Card>
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-amber-600">2</div>
                <p className="text-sm text-gray-600">Menit Proses</p>
              </CardContent>
            </Card>
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-amber-600">24/7</div>
                <p className="text-sm text-gray-600">Tersedia</p>
              </CardContent>
            </Card>
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-amber-600">100%</div>
                <p className="text-sm text-gray-600">Regulasi Compliance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-amber-800 mb-4">Cara Kerja</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Proses estimasi emas yang mudah dan transparan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-amber-800 mb-2">1. Upload Foto</h4>
              <p className="text-sm text-gray-600">
                Ambil foto emas Anda dan upload melalui aplikasi
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-amber-800 mb-2">2. AI Analysis</h4>
              <p className="text-sm text-gray-600">
                AI menganalisis jenis, berat, karat, dan kondisi emas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-amber-800 mb-2">3. Hasil Estimasi</h4>
              <p className="text-sm text-gray-600">
                Dapatkan estimasi nilai dan plafon pinjaman secara instan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-amber-800 mb-4">
                Siap Memulai Estimasi Emas Anda?
              </CardTitle>
              <CardDescription className="text-lg">
                Daftar sekarang dan nikmati kemudahan estimasi dengan teknologi AI
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  onClick={() => {
                    setAuthTab('register')
                    setIsAuthModalOpen(true)
                  }}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Daftar Sekarang
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  onClick={() => {
                    setAuthTab('login')
                    setIsAuthModalOpen(true)
                  }}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sudah Punya Akun
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-100 to-orange-100 border-t border-amber-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-amber-800">MasAI</span>
              </div>
              <p className="text-sm text-gray-600">
                Sistem Penaksir Emas Cerdas untuk Pegadaian
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-3">Fitur</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Analisis AI</li>
                <li>Estimasi Harga</li>
                <li>Tracking Status</li>
                <li>Admin Dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-3">Teknologi</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Multimodal AI</li>
                <li>Self-Reflective RAG</li>
                <li>Real-time Analytics</li>
                <li>Cloud Computing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-3">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>support@masai.id</li>
                <li>(021) 1234-5678</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 MasAI. All rights reserved. Powered by Pegadaian.</p>
          </div>
        </div>
      </footer>

      {/* CHATBOT - TAMBAHKAN DI SINI */}
      <ChatbotWidget />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authTab}
      />
    </div>
  )
}

// Hapus AuthProvider wrapper karena sudah ada di layout.tsx
export default function Home() {
  return <LandingPage />
}