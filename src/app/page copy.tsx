'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ImageUpload from "@/components/ImageUpload"
import { 
  Upload, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle,
  Zap,
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
  Image,
  Scale,
  Diamond,
  Award,
  Star,
  ArrowRight,
  Info,
  Search
} from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')

  const trackApplication = async (estimationId: string) => {
    try {
      const response = await fetch(`/api/tracking?estimation_id=${estimationId}`)
      const result = await response.json()
      
      if (result.success) {
        console.log('Tracking result:', result)
        // Update UI with tracking data
      } else {
        console.error('Tracking failed:', result.error)
      }
    } catch (error) {
      console.error('Tracking error:', error)
    }
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
              <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                <LogIn className="w-4 h-4 mr-2" />
                Masuk
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Daftar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-amber-100 border border-amber-200">
            <TabsTrigger value="home" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Beranda
            </TabsTrigger>
            <TabsTrigger value="demo" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Demo
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Tracking
            </TabsTrigger>
            <TabsTrigger value="technology" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Teknologi
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Tentang
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="mt-8">
            <div className="grid gap-8">
              {/* Hero Section */}
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-6">
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
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                    <Camera className="w-5 h-5 mr-2" />
                    Coba Demo Sekarang
                  </Button>
                  <Button size="lg" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                    <Info className="w-5 h-5 mr-2" />
                    Pelajari Lebih Lanjut
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-amber-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <Brain className="w-6 h-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-amber-800">Multimodal AI</CardTitle>
                    <CardDescription>Analisis gambar emas dengan kecerdasan buatan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Deteksi jenis perhiasan</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Estimasi berat & karat</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Analisis kondisi fisik</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-amber-800">Self-Reflective RAG</CardTitle>
                    <CardDescription>Validasi dengan knowledge base Pegadaian</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>4 tahap validasi</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Confidence scoring</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Error checking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <Calculator className="w-6 h-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-amber-800">Estimasi Akurat</CardTitle>
                    <CardDescription>Perhitungan harga berdasarkan regulasi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Harga emas harian</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>LTV sesuai regulasi</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Plafon pinjaman realistis</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center border-amber-200">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-amber-600">95%</div>
                    <p className="text-sm text-gray-600">Akurasi Estimasi</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-amber-200">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-amber-600">&lt;2</div>
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
          </TabsContent>

          {/* Demo Tab */}
          <TabsContent value="demo" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-amber-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-amber-800">Demo Analisis Emas</CardTitle>
                  <CardDescription>
                    Upload foto emas Anda dan dapatkan estimasi harga secara instan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="mt-8">
            <div className="max-w-4xl mx-auto">
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
                        const input = document.getElementById('tracking-input') as HTMLInputElement
                        if (input.value) {
                          // Use sample ID for demo
                          input.value = 'EST-1705123456789-SAMPLE'
                          trackApplication(input.value)
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
          </TabsContent>

          {/* Technology Tab */}
          <TabsContent value="technology" className="mt-8">
            <div className="grid gap-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-amber-800 mb-4">Teknologi Kami</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Menggabungkan kekuatan AI, machine learning, dan knowledge base untuk memberikan estimasi emas yang akurat
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-amber-200">
                  <CardHeader>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <Brain className="w-6 h-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-amber-800">Multimodal AI</CardTitle>
                    <CardDescription>Analisis gambar dan teks dengan deep learning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Computer Vision untuk deteksi objek</li>
                      <li>• Image Recognition untuk identifikasi perhiasan</li>
                      <li>• Object Detection untuk estimasi ukuran</li>
                      <li>• Pattern Recognition untuk analisis kondisi</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-200">
                  <CardHeader>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-amber-800">Self-Reflective RAG</CardTitle>
                    <CardDescription>Validasi dengan knowledge base Pegadaian</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Retrieval dari regulasi Pegadaian</li>
                      <li>• Generation dengan context awareness</li>
                      <li>• Reflection untuk quality check</li>
                      <li>• Validation dengan compliance checking</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-200">
                  <CardHeader>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-amber-800">Real-time Analytics</CardTitle>
                    <CardDescription>Analisis data harga emas secara real-time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Integration dengan API Pegadaian</li>
                      <li>• Market trend analysis</li>
                      <li>• Price prediction modeling</li>
                      <li>• Risk assessment algorithms</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-200">
                  <CardHeader>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-amber-800">User Experience</CardTitle>
                    <CardDescription>Interface yang intuitif dan mudah digunakan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Responsive design untuk semua device</li>
                      <li>• Progressive web app (PWA)</li>
                      <li>• Real-time status updates</li>
                      <li>• Accessibility compliance</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-amber-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-amber-800">Tentang MasAI</CardTitle>
                  <CardDescription>
                    Sistem Penaksir Emas Cerdas Berbasis Multimodal AI & Self-Reflective RAG
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-amber-800 mb-2">MasAI</h3>
                    <p className="text-gray-600">
                      Platform inovatif yang menggabungkan kecerdasan buatan dengan regulasi Pegadaian 
                      untuk memberikan estimasi nilai emas yang akurat, transparan, dan terpercaya.
                    </p>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-3">Misi Kami</h4>
                      <p className="text-sm text-gray-600">
                        Menyediakan solusi teknologi yang memudahkan masyarakat dalam mengestimasi 
                        nilai emas dengan cepat dan akurat, mendukung inklusi keuangan melalui 
                        layanan gadai yang lebih transparan dan accessible.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-3">Visi Kami</h4>
                      <p className="text-sm text-gray-600">
                        Menjadi platform terdepan dalam estimasi nilai emas berbasis AI di Indonesia, 
                        mendukung transformasi digital Pegadaian dan meningkatkan kepercayaan 
                        masyarakat terhadap layanan gadai syariah.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-amber-800 mb-3">Keunggulan MasAI</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-amber-700">Akurasi Tinggi</h5>
                          <p className="text-sm text-gray-600">95% akurasi estimasi dengan AI validation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-amber-700">Proses Cepat</h5>
                          <p className="text-sm text-gray-600">Estimasi dalam kurang dari 2 menit</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-amber-700">Transparan</h5>
                          <p className="text-sm text-gray-600">Perhitungan yang jelas dan dapat dipertanggungjawabkan</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-amber-700">Compliance</h5>
                          <p className="text-sm text-gray-600">100% sesuai regulasi Pegadaian</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="border-amber-200 bg-amber-50">
                    <Award className="w-4 h-4 text-amber-600" />
                    <AlertDescription className="text-sm text-amber-800">
                      MasAI dikembangkan dengan kerjasama antara tim AI Pegadaian dan pakar machine learning 
                      untuk memastikan kualitas dan keandalan sistem.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-amber-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-amber-800">Admin Dashboard</CardTitle>
                  <CardDescription>
                    Kelola sistem dan monitor performa aplikasi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-amber-200">
                      <CardContent className="pt-6 text-center">
                        <Users className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-600">1,234</div>
                        <p className="text-sm text-gray-600">Total Users</p>
                      </CardContent>
                    </Card>
                    <Card className="border-amber-200">
                      <CardContent className="pt-6 text-center">
                        <FileText className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-600">456</div>
                        <p className="text-sm text-gray-600">Estimations</p>
                      </CardContent>
                    </Card>
                    <Card className="border-amber-200">
                      <CardContent className="pt-6 text-center">
                        <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-600">89%</div>
                        <p className="text-sm text-gray-600">Success Rate</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <Settings className="w-4 h-4 mr-2" />
                      Management Harga Emas
                    </Button>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <FileText className="w-4 h-4 mr-2" />
                      Management Estimasi
                    </Button>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <Users className="w-4 h-4 mr-2" />
                      Management Users
                    </Button>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics & Reports
                    </Button>
                  </div>

                  <Alert className="border-amber-200 bg-amber-50">
                    <Info className="w-4 h-4 text-amber-600" />
                    <AlertDescription className="text-sm text-amber-800">
                      Login sebagai admin diperlukan untuk mengakses fitur management.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

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
            <p>&copy; 2024 MasAI. All rights reserved. Powered by Pegadaian.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}