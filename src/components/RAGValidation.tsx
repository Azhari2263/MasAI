'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import EstimationResults from "@/components/EstimationResults"
import { 
  Brain,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Loader2,
  Eye,
  FileText,
  Award,
  Target,
  Search,
  RefreshCw,
  Lightbulb
} from 'lucide-react'

interface ValidationResult {
  is_valid: boolean
  confidence_score: number
  validation_steps: {
    retrieval: {
      success: boolean
      confidence: number
      relevant_rules: string[]
    }
    generation: {
      success: boolean
      confidence: number
      generated_text: string
    }
    reflection: {
      success: boolean
      confidence: number
      issues_found: string[]
    }
    validation: {
      success: boolean
      confidence: number
      final_decision: string
    }
  }
  recommendations: string[]
}

interface RAGValidationProps {
  analysisData: any
  onValidationComplete?: (result: ValidationResult) => void
}

export default function RAGValidation({ analysisData, onValidationComplete }: RAGValidationProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showEstimationResults, setShowEstimationResults] = useState(false)

  const simulateValidation = async () => {
    setIsValidating(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock validation result
      const mockResult: ValidationResult = {
        is_valid: true,
        confidence_score: 0.87,
        validation_steps: {
          retrieval: {
            success: true,
            confidence: 0.85,
            relevant_rules: [
              'Berat minimum untuk gadai Kalung: 1 gram',
              'LTV maksimal untuk emas 22K: 80%',
              'Kondisi Baik memenuhi syarat gadai',
              'Harga beli emas mengacu harga pasar Pegadaian',
              'Biaya administrasi sesuai ketentuan'
            ]
          },
          generation: {
            success: true,
            confidence: 0.88,
            generated_text: 'Berdasarkan analisis, kalung emas 22K dengan berat 12.5 gram dalam kondisi baik layak untuk digadai. Estimasi nilai: Rp 15.625.000 dengan plafon pinjaman maksimal Rp 12.500.000 (80% LTV). Tidak ada risiko signifikan yang teridentifikasi.'
          },
          reflection: {
            success: true,
            confidence: 0.82,
            issues_found: []
          },
          validation: {
            success: true,
            confidence: 0.95,
            final_decision: 'APPROVED - Analisis valid dan sesuai regulasi Pegadaian'
          }
        },
        recommendations: [
          'Proses dapat dilanjutkan ke tahap berikutnya',
          'Siapkan dokumen identitas pemohon',
          'Jadwalkan pemeriksaan fisik di cabang terdekat'
        ]
      }

      setValidationResult(mockResult)
      onValidationComplete?.(mockResult)
    } catch (err) {
      setError('Validasi gagal. Silakan coba lagi.')
    } finally {
      setIsValidating(false)
    }
  }

  const getStepIcon = (step: string, success: boolean) => {
    if (step === 'retrieval') return <Search className="w-4 h-4" />
    if (step === 'generation') return <Brain className="w-4 h-4" />
    if (step === 'reflection') return <Eye className="w-4 h-4" />
    if (step === 'validation') return <Shield className="w-4 h-4" />
    
    return success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />
  }

  const getStepName = (step: string) => {
    if (step === 'retrieval') return 'Retrieval'
    if (step === 'generation') return 'Generation'
    if (step === 'reflection') return 'Reflection'
    if (step === 'validation') return 'Validation'
    return step
  }

  return (
    <div className="space-y-6">
      {/* Validation Header */}
      <Card className="border-amber-200">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-amber-600" />
          </div>
          <CardTitle className="text-amber-800">Self-Reflective RAG Validation</CardTitle>
          <CardDescription>
            Validasi analisis AI dengan knowledge base Pegadaian menggunakan 4 tahap validasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!validationResult && (
            <div className="text-center">
              <Button
                onClick={simulateValidation}
                disabled={isValidating}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Melakukan Validasi RAG...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Mulai Validasi
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Progress */}
      {isValidating && (
        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-800">Validasi RAG</span>
                <span className="text-sm text-amber-600">Sedang berlangsung...</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>Retrieval</span>
                      <span className="text-blue-600">Mengambil aturan...</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Menunggu...</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Menunggu...</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Menunggu...</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Validation Results */}
      {validationResult && (
        <div className="space-y-4">
          {/* Overall Result */}
          <Alert className={
            validationResult.is_valid ? 
            "border-green-200 bg-green-50" : 
            "border-yellow-200 bg-yellow-50"
          }>
            {validationResult.is_valid ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            )}
            <AlertDescription className={
              validationResult.is_valid ? "text-green-800" : "text-yellow-800"
            }>
              {validationResult.is_valid ? 
                `Validasi BERHASIL dengan confidence score ${(validationResult.confidence_score * 100).toFixed(1)}%` :
                `Validasi memerlukan perhatian khusus dengan confidence score ${(validationResult.confidence_score * 100).toFixed(1)}%`
              }
            </AlertDescription>
          </Alert>

          {/* Validation Steps */}
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(validationResult.validation_steps).map(([step, data]) => (
              <Card key={step} className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-amber-700 flex items-center gap-2">
                    {getStepIcon(step, data.success)}
                    {getStepName(step)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className={
                      data.success ? 
                      "bg-green-100 text-green-800" : 
                      "bg-red-100 text-red-800"
                    }>
                      {data.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span>{(data.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={data.confidence * 100} className="h-2" />
                  </div>
                  
                  {/* Step-specific content */}
                  {step === 'retrieval' && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2">Aturan Relevan:</p>
                      <ul className="space-y-1">
                        {(data as any).relevant_rules.slice(0, 2).map((rule: string, index: number) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                            <span className="text-amber-500">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {step === 'generation' && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {(data as any).generated_text.substring(0, 100)}...
                      </p>
                    </div>
                  )}
                  
                  {step === 'reflection' && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600">
                        Issues: {(data as any).issues_found.length} ditemukan
                      </p>
                    </div>
                  )}
                  
                  {step === 'validation' && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 font-medium">
                        {(data as any).final_decision}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          {validationResult.recommendations.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Rekomendasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {validationResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={() => setShowEstimationResults(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Lihat Estimasi Lengkap
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setValidationResult(null)}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Validasi Ulang
            </Button>
          </div>
        </div>
      )}

      {/* Estimation Results */}
      {showEstimationResults && analysisData && (
        <EstimationResults 
          analysisData={analysisData}
          ragValidation={validationResult}
        />
      )}
    </div>
  )
}