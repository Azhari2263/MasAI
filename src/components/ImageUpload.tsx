'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEstimation } from '@/contexts/EstimationContext'
import { useAuth } from '@/contexts/AuthContext'
import RAGValidation from "@/components/RAGValidation"
import {
  Upload, Camera, X, Loader2, CheckCircle, AlertCircle,
  Sparkles, Eye, Scale, Diamond, ImageIcon, RefreshCw
} from 'lucide-react'

interface AnalysisResult {
  object_type: string
  estimated_weight: number
  karat: number
  condition: string
  confidence_scores: {
    object_detection: number
    weight_estimation: number
    karat_analysis: number
    condition_analysis: number
  }
}

export default function ImageUpload() {
  const { user } = useAuth()
  const { addEstimation } = useEstimation()

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [showRAGValidation, setShowRAGValidation] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      setIsCameraOpen(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    } catch (err) {
      setError('Tidak dapat mengakses kamera. Pastikan izin diberikan.')
      console.error(err)
    }
  }

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraOpen(false)
  }, [])

  const captureImage = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg')
        setSelectedImage(dataUrl)
        setAnalysisResult(null)
        setError(null)
        setProgress(0)
        stopCamera()
      }
    }
  }, [stopCamera])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Ukuran file terlalu besar. Maksimal 10MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setAnalysisResult(null)
        setError(null)
        setProgress(0)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const resetUpload = useCallback(() => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setError(null)
    setProgress(0)
    setShowRAGValidation(false)
    stopCamera()
  }, [stopCamera])

  const simulateAnalysis = useCallback(async () => {
    if (!selectedImage) return
    setIsAnalyzing(true)
    setError(null)
    setProgress(0)

    try {
      const progressSteps = [
        { step: 'Mendeteksi objek...', progress: 20 },
        { step: 'Menganalisis karakteristik...', progress: 40 },
        { step: 'Mengestimasi berat...', progress: 60 },
        { step: 'Menganalisis karat...', progress: 80 },
        { step: 'Validasi hasil...', progress: 100 }
      ]

      for (const { progress } of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 600))
        setProgress(progress)
      }

      const mockResult: AnalysisResult = {
        object_type: 'Cincin',
        estimated_weight: 6,
        karat: 22,
        condition: 'Baik',
        confidence_scores: {
          object_detection: 94,
          weight_estimation: 77,
          karat_analysis: 85,
          condition_analysis: 88
        }
      }

      setAnalysisResult(mockResult)

      // Generate estimation ID
      const timestamp = Date.now()
      const estimationId = `EST-${timestamp}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Calculate values
      const goldPrice = 1250000
      const estimatedValue = mockResult.estimated_weight * goldPrice
      const maxLtv = 80
      const maxLoan = Math.floor(estimatedValue * (maxLtv / 100))
      const adminFee = 16500
      const netLoan = maxLoan - adminFee

      // Save estimation to context
      if (user) {
        addEstimation({
          id: estimationId,
          estimation_id: estimationId,
          object_type: mockResult.object_type,
          estimated_weight: mockResult.estimated_weight,
          karat: mockResult.karat,
          condition: mockResult.condition,
          confidence_scores: mockResult.confidence_scores,
          gold_price_per_gram: goldPrice,
          estimated_gold_value: estimatedValue,
          max_loan_amount: maxLoan,
          net_loan_amount: netLoan,
          status: 'DRAFT',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          image_url: selectedImage
        })
      }
    } catch (err) {
      setError('Gagal menganalisis. Coba lagi.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [selectedImage, addEstimation, user])

  return (
    <div className="space-y-6 w-full">
      {!selectedImage && (
        <Card className="border-2 border-dashed border-amber-300 bg-amber-50/30 w-full">
          <CardContent className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-1">
              <Upload className="w-8 h-8 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-amber-900">Upload Foto Emas</h3>
              <p className="text-sm text-gray-500">Ambil foto langsung atau upload dari galeri</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg pt-2">
              <Button
                onClick={() => document.getElementById('file-input')?.click()}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white h-11 text-base shadow-sm"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Galeri
              </Button>
              <Button
                variant="outline"
                onClick={startCamera}
                className="flex-1 border-amber-500 text-amber-700 hover:bg-amber-50 h-11 text-base shadow-sm"
              >
                <Camera className="w-4 h-4 mr-2" />
                Kamera
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG • Max: 10MB</p>
            <input id="file-input" type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </CardContent>
        </Card>
      )}

      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="bg-black rounded-2xl overflow-hidden max-w-md w-full relative shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
            <div className="p-4 z-10 flex justify-between items-center bg-black/40 backdrop-blur-md absolute top-0 left-0 right-0">
              <span className="text-white font-medium">Ambil Foto</span>
              <button onClick={stopCamera} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>
            <div className="p-6 bg-black flex justify-center items-center pb-8">
              <button onClick={captureImage} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-95 transition-transform">
                <div className="w-16 h-16 rounded-full bg-amber-500"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <Card className="border-amber-200 overflow-hidden bg-white">
            <div className="relative h-64 bg-gray-100 flex items-center justify-center">
              <img src={selectedImage} alt="Preview" className="h-full w-full object-contain" />
              <button
                onClick={resetUpload}
                className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 text-gray-700 hover:text-red-600 p-2 rounded-full shadow-sm transition-colors border border-gray-200"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {!analysisResult && !isAnalyzing && (
              <div className="p-6 flex justify-center bg-amber-50/50">
                <Button
                  onClick={simulateAnalysis}
                  size="lg"
                  className="w-full sm:w-auto px-10 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg text-lg h-12"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Mulai Analisis AI
                </Button>
              </div>
            )}
          </Card>

          {isAnalyzing && (
            <Card className="border-amber-200 shadow-sm">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="flex justify-between items-end text-amber-900">
                  <span className="font-semibold text-lg flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                    Menganalisis...
                  </span>
                  <span className="font-bold text-2xl text-amber-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-4 bg-gray-100 rounded-full" />
                <p className="text-center text-sm text-gray-500 animate-pulse">
                  AI sedang mengidentifikasi karakteristik emas Anda...
                </p>
              </CardContent>
            </Card>
          )}

          {analysisResult && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <Alert className="bg-green-50 border-green-200 text-green-800 py-4">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <AlertDescription className="font-medium text-base ml-2">
                  Analisis AI selesai! Hasil estimasi telah tersedia dan disimpan ke riwayat Anda.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-100">
                      <span className="text-gray-600">Jenis Perhiasan</span>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-sm px-3">
                        {analysisResult.object_type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-100">
                      <span className="text-gray-600">Estimasi Berat</span>
                      <span className="font-bold text-gray-900 text-lg flex items-center gap-1">
                        <Scale className="w-4 h-4 text-gray-400" /> {analysisResult.estimated_weight} gr
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-100">
                      <span className="text-gray-600">Karat</span>
                      <span className="font-bold text-gray-900 text-lg flex items-center gap-1">
                        <Diamond className="w-4 h-4 text-gray-400" /> {analysisResult.karat}K
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-gray-600">Kondisi</span>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm px-3">
                        {analysisResult.condition}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="space-y-5 pt-4">
                    {[
                      { label: 'Deteksi Objek', val: analysisResult.confidence_scores.object_detection },
                      { label: 'Estimasi Berat', val: analysisResult.confidence_scores.weight_estimation },
                      { label: 'Analisis Karat', val: analysisResult.confidence_scores.karat_analysis },
                      { label: 'Kondisi Fisik', val: analysisResult.confidence_scores.condition_analysis },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium text-gray-600">
                          <span>{item.label}</span>
                          <span className="text-gray-900">{item.val}%</span>
                        </div>
                        <Progress value={item.val} className="h-2 rounded-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white shadow-md h-12 text-lg"
                  onClick={() => setShowRAGValidation(true)}
                >
                  Validasi dengan RAG
                </Button>
                <Button
                  variant="outline"
                  onClick={resetUpload}
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 h-12 text-lg"
                >
                  Analisis Ulang
                </Button>
              </div>

              {showRAGValidation && (
                <div className="pt-6 border-t border-amber-100 animate-in slide-in-from-bottom-8 fade-in duration-500">
                  <RAGValidation
                    analysisData={analysisResult}
                    onValidationComplete={(res) => console.log(res)}
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}