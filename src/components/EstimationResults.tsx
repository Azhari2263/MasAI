'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Calculator,
  TrendingUp,
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  Info,
  Download,
  Share2,
  RefreshCw,
  Eye,
  Scale,
  Diamond,
  Award,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

interface AnalysisData {
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

interface EstimationResult {
  success: boolean
  estimation_id: string
  analysis_result: AnalysisData
  price_calculation: {
    gold_price_per_gram: number
    estimated_gold_value: number
    max_ltv_percentage: number
    max_loan_amount: number
    admin_fee: number
    net_loan_amount: number
  }
  rag_validation?: {
    is_valid: boolean
    confidence_score: number
    validation_steps: any
    recommendations: string[]
  }
  application_status: string
  created_at: string
  expires_at: string
}

interface EstimationResultsProps {
  analysisData: AnalysisData
  ragValidation?: any
}

export default function EstimationResults({ analysisData, ragValidation }: EstimationResultsProps) {
  const [estimationResult, setEstimationResult] = useState<EstimationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculateEstimation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/estimation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_data: analysisData,
          include_rag_validation: true
        })
      })

      const result: EstimationResult = await response.json()

      if (result.success) {
        setEstimationResult(result)
      } else {
        setError(result.error || 'Estimation failed')
      }
    } catch (err) {
      setError('Failed to calculate estimation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (analysisData) {
      calculateEstimation()
    }
  }, [analysisData])

  if (isLoading) {
    return (
      <Card className="border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-amber-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Menghitung Estimasi</h3>
              <p className="text-sm text-gray-600">Sedang menghitung nilai emas dan plafon pinjaman...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <AlertDescription className="text-red-800">{error}</AlertDescription>
      </Alert>
    )
  }

  if (!estimationResult) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Estimasi berhasil! ID: {estimationResult.estimation_id}
        </AlertDescription>
      </Alert>

      {/* Main Estimation Results */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-amber-800">Hasil Estimasi & Plafon Pinjaman</CardTitle>
          <CardDescription>
            Berdasarkan analisis AI dan harga emas terkini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-amber-200 bg-white">
              <CardContent className="pt-6 text-center">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-sm text-gray-600 mb-1">Harga Emas Hari Ini</div>
                <div className="text-2xl font-bold text-amber-600">
                  {formatCurrency(estimationResult.price_calculation.gold_price_per_gram)}
                </div>
                <div className="text-xs text-gray-500">per gram</div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white">
              <CardContent className="pt-6 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-sm text-gray-600 mb-1">Estimasi Nilai Emas</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(estimationResult.price_calculation.estimated_gold_value)}
                </div>
                <div className="text-xs text-gray-500">
                  {analysisData.estimated_weight}g × {formatCurrency(estimationResult.price_calculation.gold_price_per_gram)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white">
              <CardContent className="pt-6 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm text-gray-600 mb-1">Maks. Plafon Pinjaman</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(estimationResult.price_calculation.max_loan_amount)}
                </div>
                <div className="text-xs text-gray-500">
                  {estimationResult.price_calculation.max_ltv_percentage}% LTV
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Detailed Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Rincian Perhitungan
              </h4>
              <div className="space-y-3 bg-white p-4 rounded-lg border border-amber-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Berat Emas</span>
                  <span className="font-medium">{analysisData.estimated_weight} gram</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Karat</span>
                  <span className="font-medium">{analysisData.karat}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Harga per Gram</span>
                  <span className="font-medium">{formatCurrency(estimationResult.price_calculation.gold_price_per_gram)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nilai Emas</span>
                  <span className="font-medium text-green-600">{formatCurrency(estimationResult.price_calculation.estimated_gold_value)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">LTV Maksimal</span>
                  <span className="font-medium">{estimationResult.price_calculation.max_ltv_percentage}%</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                  <span>Plafon Pinjaman</span>
                  <span className="text-blue-600">{formatCurrency(estimationResult.price_calculation.max_loan_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Biaya Admin</span>
                  <span className="font-medium">-{formatCurrency(estimationResult.price_calculation.admin_fee)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                  <span>Dana Diterima</span>
                  <span className="text-green-600">{formatCurrency(estimationResult.price_calculation.net_loan_amount)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Informasi Estimasi
              </h4>
              <div className="space-y-3 bg-white p-4 rounded-lg border border-amber-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ID Estimasi</span>
                  <span className="font-medium text-xs">{estimationResult.estimation_id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-amber-100 text-amber-800">{estimationResult.application_status}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dibuat</span>
                  <span className="font-medium">{new Date(estimationResult.created_at).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Berlaku Hingga</span>
                  <span className="font-medium">{new Date(estimationResult.expires_at).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jenis Perhiasan</span>
                  <span className="font-medium">{analysisData.object_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kondisi</span>
                  <Badge className={
                    analysisData.condition === 'Sangat Baik' ? 'bg-green-100 text-green-800' :
                    analysisData.condition === 'Baik' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {analysisData.condition}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* RAG Validation Status */}
          {estimationResult.rag_validation && (
            <div>
              <h4 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Validasi RAG
              </h4>
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Status Validasi</span>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      estimationResult.rag_validation.is_valid ? 
                      'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {estimationResult.rag_validation.is_valid ? 'Valid' : 'Perlu Review'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {(estimationResult.rag_validation.confidence_score * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>
                <Progress value={estimationResult.rag_validation.confidence_score * 100} className="h-2 mb-3" />
                {estimationResult.rag_validation.recommendations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Rekomendasi:</p>
                    <ul className="space-y-1">
                      {estimationResult.rag_validation.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50">
            <Info className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800">
              <strong>Penting:</strong> Estimasi ini berdasarkan analisis AI dan harga emas terkini. 
              Nilai final dapat berubah setelah pemeriksaan fisik di cabang Pegadaian. 
              Estimasi berlaku selama 24 jam.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={() => window.location.href = '#tracking'}
            >
              <FileText className="w-4 h-4 mr-2" />
              Ajukan Gadai Sekarang
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Langkah Selanjutnya
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <h5 className="font-medium text-amber-800 mb-2">1. Siapkan Dokumen</h5>
              <p className="text-sm text-gray-600">KTP/SIM, NPWP (jika perlu), dan emas asli</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <h5 className="font-medium text-amber-800 mb-2">2. Kunjungi Cabang</h5>
              <p className="text-sm text-gray-600">Datang ke cabang Pegadaian terdekat</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <h5 className="font-medium text-amber-800 mb-2">3. Cairkan Dana</h5>
              <p className="text-sm text-gray-600">Dana cair dalam 1x24 jam</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}