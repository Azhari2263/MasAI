import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface AnalysisRequest {
  image_base64: string
}

interface AnalysisResponse {
  success: boolean
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
  raw_analysis?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()

    if (!body.image_base64) {
      return NextResponse.json({
        success: false,
        error: 'Image is required'
      }, { status: 400 })
    }

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Prepare the prompt for gold estimation
    const prompt = `Analyze this gold jewelry image and provide detailed estimation:

INSTRUCTIONS:
- Identify the type of gold jewelry (Kalung/Necklace, Cincin/Ring, Gelang/Bracelet, Anting/Earring, Liontin/Pendant)
- Estimate the weight in grams based on visible size and type
- Estimate the karat (purity: 14K, 16K, 18K, 22K, 24K) based on color and appearance
- Assess the physical condition (Sangat Baik/Excellent, Baik/Good, Cukup/Fair)
- Provide confidence scores (0-100) for each estimation

RESPOND ONLY IN THIS JSON FORMAT (no markdown, no extra text):
{
  "object_type": "string (Kalung/Cincin/Gelang/Anting/Liontin)",
  "estimated_weight": number (in grams, decimal allowed),
  "karat": number (14, 16, 18, 22, or 24),
  "condition": "string (Sangat Baik/Baik/Cukup)",
  "confidence_scores": {
    "object_detection": number (0-100),
    "weight_estimation": number (0-100),
    "karat_analysis": number (0-100),
    "condition_analysis": number (0-100)
  },
  "reasoning": "string (brief explanation of your analysis)"
}

IMPORTANT GUIDELINES:
- Weight estimation should be realistic for the jewelry type:
  * Cincin/Ring: 2-15 grams
  * Kalung/Necklace: 5-50 grams
  * Gelang/Bracelet: 10-80 grams
  * Anting/Earring: 1-10 grams (per pair)
  * Liontin/Pendant: 2-20 grams
- Karat estimation based on gold color:
  * 24K: Bright yellow, pure gold
  * 22K: Rich yellow
  * 18K: Yellow with slight copper tone
  * 14K-16K: Lighter yellow/pinkish tone
- Condition assessment:
  * Sangat Baik: No visible scratches, shiny, well-maintained
  * Baik: Minor wear, some scratches, still good overall
  * Cukup: Visible wear, scratches, may need polishing
- Be conservative with confidence scores if image quality is poor`

    // Convert base64 to buffer for Gemini
    const base64Data = body.image_base64.replace(/^data:image\/\w+;base64,/, '')
    
    // Generate content with image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      }
    ])

    const response = await result.response
    const text = response.text()

    console.log('Gemini Raw Response:', text)

    // Parse the JSON response
    let analysisData
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysisData = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.error('Raw text:', text)
      
      // Fallback: try to extract JSON from text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse Gemini response as JSON')
      }
    }

    // Validate and normalize the response
    const normalizedResult = {
      object_type: analysisData.object_type || 'Unknown',
      estimated_weight: Math.max(0.1, Math.min(100, parseFloat(analysisData.estimated_weight) || 5)),
      karat: [14, 16, 18, 22, 24].includes(parseInt(analysisData.karat)) 
        ? parseInt(analysisData.karat) 
        : 22,
      condition: ['Sangat Baik', 'Baik', 'Cukup'].includes(analysisData.condition)
        ? analysisData.condition
        : 'Baik',
      confidence_scores: {
        object_detection: Math.max(0, Math.min(100, analysisData.confidence_scores?.object_detection || 85)),
        weight_estimation: Math.max(0, Math.min(100, analysisData.confidence_scores?.weight_estimation || 75)),
        karat_analysis: Math.max(0, Math.min(100, analysisData.confidence_scores?.karat_analysis || 80)),
        condition_analysis: Math.max(0, Math.min(100, analysisData.confidence_scores?.condition_analysis || 85))
      }
    }

    const apiResponse: AnalysisResponse = {
      success: true,
      analysis_result: normalizedResult,
      raw_analysis: analysisData.reasoning || text
    }

    return NextResponse.json(apiResponse)

  } catch (error) {
    console.error('Gemini Analysis Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed',
      analysis_result: {
        object_type: 'Error',
        estimated_weight: 0,
        karat: 0,
        condition: 'Unknown',
        confidence_scores: {
          object_detection: 0,
          weight_estimation: 0,
          karat_analysis: 0,
          condition_analysis: 0
        }
      }
    }, { status: 500 })
  }
}