import { NextRequest, NextResponse } from 'next/server'

interface TrackingRequest {
  estimation_id: string
  user_info?: {
    email?: string
    phone?: string
  }
}

interface TrackingResponse {
  success: boolean
  estimation_id: string
  status: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED'
  current_step: string
  progress_percentage: number
  timeline: Array<{
    step: string
    status: 'completed' | 'in_progress' | 'pending'
    timestamp: string
    description: string
  }>
  estimation_details?: {
    object_type: string
    estimated_weight: number
    karat: number
    condition: string
    estimated_gold_value: number
    max_loan_amount: number
  }
  next_actions: string[]
  estimated_completion_time?: string
  error?: string
}

// Mock database for demo purposes
const MOCK_APPLICATIONS: Record<string, any> = {
  'EST-1705123456789-ABC123': {
    status: 'PROCESSING',
    current_step: 'document_verification',
    progress_percentage: 60,
    timeline: [
      {
        step: 'Pengajuan Dibuat',
        status: 'completed',
        timestamp: '2024-01-12T10:30:00Z',
        description: 'Pengajuan gadai telah berhasil dibuat'
      },
      {
        step: 'Analisis AI Selesai',
        status: 'completed',
        timestamp: '2024-01-12T10:35:00Z',
        description: 'Analisis AI dan estimasi nilai selesai'
      },
      {
        step: 'Menunggu Verifikasi',
        status: 'completed',
        timestamp: '2024-01-12T11:00:00Z',
        description: 'Menunggu verifikasi fisik di cabang'
      },
      {
        step: 'Verifikasi Dokumen',
        status: 'in_progress',
        timestamp: '2024-01-12T14:00:00Z',
        description: 'Memverifikasi dokumen identitas dan kelengkapan berkas'
      },
      {
        step: 'Penilaian Fisik',
        status: 'pending',
        timestamp: null,
        description: 'Penilaian fisik emas di cabang'
      },
      {
        step: 'Keputusan Final',
        status: 'pending',
        timestamp: null,
        description: 'Keputusan persetujuan atau penolakan'
      }
    ],
    estimation_details: {
      object_type: 'Kalung',
      estimated_weight: 12.5,
      karat: 22,
      condition: 'Baik',
      estimated_gold_value: 15625000,
      max_loan_amount: 12500000
    },
    next_actions: [
      'Siapkan dokumen identitas (KTP/SIM)',
      'Datang ke cabang Pegadaian terdekat',
      'Bawa emas yang akan digadai'
    ],
    estimated_completion_time: '2024-01-13T17:00:00Z'
  },
  'EST-1705123456789-DEF456': {
    status: 'APPROVED',
    current_step: 'completed',
    progress_percentage: 100,
    timeline: [
      {
        step: 'Pengajuan Dibuat',
        status: 'completed',
        timestamp: '2024-01-11T09:00:00Z',
        description: 'Pengajuan gadai telah berhasil dibuat'
      },
      {
        step: 'Analisis AI Selesai',
        status: 'completed',
        timestamp: '2024-01-11T09:05:00Z',
        description: 'Analisis AI dan estimasi nilai selesai'
      },
      {
        step: 'Menunggu Verifikasi',
        status: 'completed',
        timestamp: '2024-01-11T09:30:00Z',
        description: 'Menunggu verifikasi fisik di cabang'
      },
      {
        step: 'Verifikasi Dokumen',
        status: 'completed',
        timestamp: '2024-01-11T13:00:00Z',
        description: 'Memverifikasi dokumen identitas dan kelengkapan berkas'
      },
      {
        step: 'Penilaian Fisik',
        status: 'completed',
        timestamp: '2024-01-11T15:00:00Z',
        description: 'Penilaian fisik emas di cabang'
      },
      {
        step: 'Keputusan Final',
        status: 'completed',
        timestamp: '2024-01-11T16:30:00Z',
        description: 'Pengajuan telah disetujui'
      }
    ],
    estimation_details: {
      object_type: 'Cincin',
      estimated_weight: 8.2,
      karat: 24,
      condition: 'Sangat Baik',
      estimated_gold_value: 10250000,
      max_loan_amount: 8712500
    },
    next_actions: [
      'Dana dapat dicairkan di cabang',
      'Simpan bukti gadai dengan baik'
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackingRequest = await request.json()

    // Validate request
    if (!body.estimation_id) {
      return NextResponse.json({
        success: false,
        error: 'Estimation ID is required'
      }, { status: 400 })
    }

    const { estimation_id, user_info } = body

    // Look up application in mock database
    const application = MOCK_APPLICATIONS[estimation_id]

    if (!application) {
      return NextResponse.json({
        success: false,
        error: 'Application not found'
      }, { status: 404 })
    }

    // In a real app, you would verify user authorization here
    // For demo purposes, we'll return the data directly

    const response: TrackingResponse = {
      success: true,
      estimation_id: estimation_id,
      status: application.status,
      current_step: application.current_step,
      progress_percentage: application.progress_percentage,
      timeline: application.timeline,
      estimation_details: application.estimation_details,
      next_actions: application.next_actions,
      estimated_completion_time: application.estimated_completion_time
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Tracking API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const estimationId = searchParams.get('estimation_id')

    if (!estimationId) {
      return NextResponse.json({
        success: false,
        error: 'Estimation ID is required'
      }, { status: 400 })
    }

    // Look up application in mock database
    const application = MOCK_APPLICATIONS[estimationId]

    if (!application) {
      return NextResponse.json({
        success: false,
        error: 'Application not found'
      }, { status: 404 })
    }

    const response: TrackingResponse = {
      success: true,
      estimation_id: estimationId,
      status: application.status,
      current_step: application.current_step,
      progress_percentage: application.progress_percentage,
      timeline: application.timeline,
      estimation_details: application.estimation_details,
      next_actions: application.next_actions,
      estimated_completion_time: application.estimated_completion_time
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Tracking API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}