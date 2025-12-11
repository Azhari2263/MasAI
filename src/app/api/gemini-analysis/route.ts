import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Enable mock mode if no API key or for testing
const MOCK_MODE = !process.env.GEMINI_API_KEY || process.env.GEMINI_MOCK_MODE === 'true'

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
    mock_mode?: boolean
    error?: string
}

// Mock analysis function
function getMockAnalysis(): any {
    const types = ['Cincin', 'Kalung', 'Gelang', 'Anting', 'Liontin']
    const conditions = ['Sangat Baik', 'Baik', 'Cukup']
    const karats = [14, 16, 18, 22, 24]

    const type = types[Math.floor(Math.random() * types.length)]

    // Weight ranges based on type
    const weightRanges: Record<string, [number, number]> = {
        'Cincin': [2, 15],
        'Kalung': [5, 50],
        'Gelang': [10, 80],
        'Anting': [1, 10],
        'Liontin': [2, 20]
    }

    const [minWeight, maxWeight] = weightRanges[type] || [5, 30]
    const weight = Math.round((Math.random() * (maxWeight - minWeight) + minWeight) * 10) / 10

    return {
        object_type: type,
        estimated_weight: weight,
        karat: karats[Math.floor(Math.random() * karats.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        confidence_scores: {
            object_detection: Math.floor(Math.random() * 15) + 85,
            weight_estimation: Math.floor(Math.random() * 20) + 70,
            karat_analysis: Math.floor(Math.random() * 20) + 75,
            condition_analysis: Math.floor(Math.random() * 15) + 80
        },
        reasoning: `Mock analysis: Detected ${type} with estimated weight ${weight}g. This is simulated data for testing purposes.`
    }
}

// Helper function to try multiple models
async function tryModelAnalysis(imageData: string, prompt: string) {
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro']
    let lastError = null

    for (const modelName of models) {
        try {
            console.log(`Trying model: ${modelName}`)
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            })

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageData,
                        mimeType: 'image/jpeg'
                    }
                }
            ])

            return await result.response
        } catch (error: any) {
            console.log(`Model ${modelName} failed:`, error.message)
            lastError = error

            // If quota exceeded, try next model
            if (error.message.includes('quota') || error.message.includes('429')) {
                continue
            } else {
                // If not quota issue, throw immediately
                throw error
            }
        }
    }

    // All models failed
    throw lastError || new Error('All models failed')
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

        // If mock mode, return mock data
        if (MOCK_MODE) {
            console.log('🎭 Running in MOCK MODE - using simulated analysis')

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            const mockData = getMockAnalysis()

            return NextResponse.json({
                success: true,
                analysis_result: mockData,
                raw_analysis: mockData.reasoning,
                mock_mode: true
            })
        }

        // Real Gemini API analysis with improved prompt
        const prompt = `You are an expert gold jewelry appraiser. Carefully analyze this image and identify the gold jewelry.

CRITICAL: Focus on these visual characteristics to identify jewelry type correctly:

1. KALUNG (Necklace):
   - Long chain worn around the neck
   - Has clasp or closure mechanism
   - Length typically 40-60cm
   - May have pendant attached
   - Chain links visible

2. CINCIN (Ring):
   - Circular band
   - Small, fits on finger
   - Diameter 16-22mm
   - May have stone setting
   - Complete circle or adjustable band

3. GELANG (Bracelet):
   - Circular/oval band for wrist
   - Diameter 60-80mm (larger than ring)
   - May have clasp
   - Chain or solid band style

4. ANTING (Earring):
   - Pair of small ornaments
   - Has hook or post for ear
   - Usually sold/shown in pairs
   - Very small size

5. LIONTIN (Pendant):
   - Decorative piece that hangs
   - Has bail/loop at top
   - Meant to be attached to chain
   - Various shapes (heart, cross, etc)

ANALYSIS STEPS:
1. First, look at the OVERALL SHAPE and SIZE
2. Identify distinguishing features (clasp, chain links, closure type)
3. Estimate dimensions based on visible scale
4. Determine karat from gold color (24K=bright yellow, 22K=rich yellow, 18K=slightly pale, 14-16K=lighter tone)
5. Assess condition (scratches, tarnish, polish level)
6. Provide confidence scores based on image clarity

IMPORTANT:
- If you see a CHAIN with visible links = most likely KALUNG
- If circular and SMALL (finger size) = CINCIN
- If circular and MEDIUM (wrist size) = GELANG
- If PAIR of small items = ANTING
- If decorative piece with hanging loop = LIONTIN
- Be conservative with confidence if image is unclear
- Weight estimation based on visible size and jewelry type standards

RESPOND IN THIS EXACT JSON FORMAT (no markdown):
{
  "object_type": "ONLY ONE OF: Kalung|Cincin|Gelang|Anting|Liontin",
  "estimated_weight": number,
  "karat": 14|16|18|22|24,
  "condition": "Sangat Baik|Baik|Cukup",
  "confidence_scores": {
    "object_detection": number (0-100),
    "weight_estimation": number (0-100),
    "karat_analysis": number (0-100),
    "condition_analysis": number (0-100)
  },
  "visual_features": "describe what you see that led to this identification",
  "reasoning": "explain your analysis step by step"
}

WEIGHT RANGES (use these as guidelines):
- Cincin: 2-15g (most common: 3-8g)
- Kalung: 5-50g (chain weight + pendant if any)
- Gelang: 10-80g (depends on thickness)
- Anting: 1-10g per pair (usually 2-5g)
- Liontin: 2-20g (without chain)

CONFIDENCE GUIDELINES:
- 90-100: Very clear image, obvious jewelry type
- 80-89: Good image quality, confident identification
- 70-79: Decent image, reasonable confidence
- Below 70: Poor image quality or unclear jewelry type

If the image shows a CHAIN with multiple links = Almost certainly KALUNG (not Gelang)
If unsure between types, choose the most likely based on SIZE and VISIBLE FEATURES.`

        // Convert base64 to buffer for Gemini
        const base64Data = body.image_base64.replace(/^data:image\/\w+;base64,/, '')

        // Log image info for debugging
        console.log('Image size (base64):', base64Data.length, 'characters')
        console.log('Estimated image size:', Math.round(base64Data.length * 0.75 / 1024), 'KB')

        // Try analysis with fallback models
        const response = await tryModelAnalysis(base64Data, prompt)
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
            raw_analysis: `Visual Features: ${analysisData.visual_features || 'N/A'}\n\nReasoning: ${analysisData.reasoning || text}`,
            mock_mode: false
        }

        // Log detailed analysis for debugging
        console.log('=== ANALYSIS RESULT ===')
        console.log('Type:', normalizedResult.object_type)
        console.log('Weight:', normalizedResult.estimated_weight, 'grams')
        console.log('Karat:', normalizedResult.karat, 'K')
        console.log('Visual Features:', analysisData.visual_features)
        console.log('Confidence:', normalizedResult.confidence_scores.object_detection, '%')

        return NextResponse.json(apiResponse)

    } catch (error) {
        console.error('Gemini Analysis Error:', error)

        // If quota error, suggest using mock mode
        const isQuotaError = error instanceof Error &&
            (error.message.includes('quota') || error.message.includes('429'))

        return NextResponse.json({
            success: false,
            error: isQuotaError
                ? 'Gemini API quota exceeded. Please enable mock mode by setting GEMINI_MOCK_MODE=true in .env.local'
                : (error instanceof Error ? error.message : 'Analysis failed'),
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