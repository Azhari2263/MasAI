import { NextRequest, NextResponse } from 'next/server'
import { ragValidator } from '@/lib/rag-validator'

interface EstimationRequest {
  image_base64?: string
  analysis_data: {
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
  user_info?: {
    name: string
    email: string
    phone: string
  }
}

interface EstimationResponse {
  success: boolean
  estimation_id: string
  analysis_result: {
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
  application_status: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED'
  created_at: string
  expires_at: string
  error?: string
}

// Mock gold price data - in real app, this would come from Pegadaian API
const MOCK_GOLD_PRICE = 1250000 // Rp 1.250.000 per gram

function getMaxLTV(karat: number): number {
  if (karat >= 24) return 85
  if (karat >= 22) return 80
  if (karat >= 18) return 75
  if (karat >= 16) return 70
  return 65
}

function calculateAdminFee(loanAmount: number): number {
  // Admin fee calculation based on Pegadaian regulations
  if (loanAmount <= 1000000) return 5500
  if (loanAmount <= 5000000) return 11000
  if (loanAmount <= 10000000) return 16500
  if (loanAmount <= 50000000) return 22000
  return 33000
}

function generateEstimationId(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `EST-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body: EstimationRequest = await request.json()

    // Validate request
    if (!body.analysis_data) {
      return NextResponse.json({
        success: false,
        error: 'Analysis data is required'
      }, { status: 400 })
    }

    const { analysis_data, user_info } = body

    // Validate analysis data
    if (!analysis_data.object_type || !analysis_data.estimated_weight || !analysis_data.karat) {
      return NextResponse.json({
        success: false,
        error: 'Invalid analysis data: missing required fields'
      }, { status: 400 })
    }

    // Calculate price estimation
    const maxLTV = getMaxLTV(analysis_data.karat)
    const estimatedGoldValue = analysis_data.estimated_weight * MOCK_GOLD_PRICE
    const maxLoanAmount = Math.floor(estimatedGoldValue * (maxLTV / 100))
    const adminFee = calculateAdminFee(maxLoanAmount)
    const netLoanAmount = maxLoanAmount - adminFee

    // Perform RAG validation (optional, based on request)
    let ragValidation = undefined
    if (body.include_rag_validation) {
      try {
        ragValidation = await ragValidator.validateAnalysis(analysis_data)
      } catch (error) {
        console.error('RAG validation failed:', error)
        // Continue without RAG validation if it fails
      }
    }

    // Generate estimation response
    const estimationId = generateEstimationId()
    const createdAt = new Date().toISOString()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    const response: EstimationResponse = {
      success: true,
      estimation_id: estimationId,
      analysis_result: analysis_data,
      price_calculation: {
        gold_price_per_gram: MOCK_GOLD_PRICE,
        estimated_gold_value: estimatedGoldValue,
        max_ltv_percentage: maxLTV,
        max_loan_amount: maxLoanAmount,
        admin_fee: adminFee,
        net_loan_amount: netLoanAmount
      },
      rag_validation: ragValidation,
      application_status: 'DRAFT',
      created_at: createdAt,
      expires_at: expiresAt
    }

    // In a real app, you would save this to database here
    console.log('Estimation created:', {
      estimation_id: estimationId,
      user_info: user_info,
      analysis_data: analysis_data,
      price_calculation: response.price_calculation
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error('Estimation API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current gold price
    const searchParams = request.nextUrl.searchParams
    const includeHistory = searchParams.get('include_history') === 'true'

    const response = {
      success: true,
      current_gold_price: MOCK_GOLD_PRICE,
      currency: 'IDR',
      unit: 'gram',
      last_updated: new Date().toISOString(),
      price_history: includeHistory ? [
        { date: '2024-01-12', price: 1245000 },
        { date: '2024-01-11', price: 1240000 },
        { date: '2024-01-10', price: 1235000 },
        { date: '2024-01-09', price: 1230000 },
        { date: '2024-01-08', price: 1225000 }
      ] : null
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Gold price API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch gold price'
    }, { status: 500 })
  }
}