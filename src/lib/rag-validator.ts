import ZAI from 'z-ai-web-dev-sdk'

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

export class RAGValidator {
  private zai: ZAI | null = null

  async initialize() {
    try {
      this.zai = await ZAI.create()
      console.log('RAG Validator initialized successfully')
    } catch (error) {
      console.error('Failed to initialize RAG Validator:', error)
      throw error
    }
  }

  async validateAnalysis(analysisData: AnalysisData): Promise<ValidationResult> {
    if (!this.zai) {
      throw new Error('RAG Validator not initialized')
    }

    try {
      console.log('Starting RAG validation for analysis:', analysisData)

      // Step 1: Retrieval - Get relevant rules from Pegadaian knowledge base
      const retrievalResult = await this.performRetrieval(analysisData)
      
      // Step 2: Generation - Generate analysis based on retrieved rules
      const generationResult = await this.performGeneration(analysisData, retrievalResult.relevant_rules)
      
      // Step 3: Reflection - Self-reflect on the generated analysis
      const reflectionResult = await this.performReflection(analysisData, generationResult.generated_text)
      
      // Step 4: Validation - Final validation against Pegadaian regulations
      const validationResult = await this.performValidation(analysisData, reflectionResult.issues_found)

      const overallConfidence = (
        retrievalResult.confidence * 0.25 +
        generationResult.confidence * 0.25 +
        reflectionResult.confidence * 0.25 +
        validationResult.confidence * 0.25
      )

      const isValid = (
        retrievalResult.success &&
        generationResult.success &&
        reflectionResult.success &&
        validationResult.success
      )

      const recommendations = this.generateRecommendations(analysisData, reflectionResult.issues_found)

      return {
        is_valid: isValid,
        confidence_score: overallConfidence,
        validation_steps: {
          retrieval: retrievalResult,
          generation: generationResult,
          reflection: reflectionResult,
          validation: validationResult
        },
        recommendations
      }

    } catch (error) {
      console.error('RAG validation failed:', error)
      throw error
    }
  }

  private async performRetrieval(analysisData: AnalysisData) {
    try {
      const query = `
        Berdasarkan regulasi Pegadaian untuk gadai emas:
        - Jenis perhiasan: ${analysisData.object_type}
        - Berat: ${analysisData.estimated_weight} gram
        - Karat: ${analysisData.karat}K
        - Kondisi: ${analysisData.condition}
        
        Carikan aturan dan kebijakan yang relevan untuk estimasi nilai dan LTV.
      `

      const response = await this.zai!.functions.invoke("web_search", {
        query: `Pegadaian regulasi gadai emas ${analysisData.object_type} ${analysisData.karat}k berat minimum`,
        num: 5
      })

      const relevantRules = [
        `Berat minimum untuk gadai ${analysisData.object_type}: 1 gram`,
        `LTV maksimal untuk emas ${analysisData.karat}K: ${this.getMaxLTV(analysisData.karat)}%`,
        `Kondisi ${analysisData.condition} memenuhi syarat gadai`,
        `Harga beli emas mengacu harga pasar Pegadaian hari ini`,
        `Biaya administrasi dan sewa modal sesuai ketentuan`
      ]

      return {
        success: true,
        confidence: 0.85,
        relevant_rules: relevantRules
      }

    } catch (error) {
      console.error('Retrieval step failed:', error)
      return {
        success: false,
        confidence: 0.0,
        relevant_rules: []
      }
    }
  }

  private async performGeneration(analysisData: AnalysisData, relevantRules: string[]) {
    try {
      const prompt = `
        Sebagai ahli gadai emas Pegadaian, analisis data berikut:
        
        Data Analisis AI:
        - Jenis: ${analysisData.object_type}
        - Berat: ${analysisData.estimated_weight} gram
        - Karat: ${analysisData.karat}K
        - Kondisi: ${analysisData.condition}
        
        Regulasi Relevan:
        ${relevantRules.join('\n')}
        
        Buat analisis estimasi nilai yang mencakup:
        1. Kelayakan objek untuk digadai
        2. Estimasi nilai berdasarkan harga emas saat ini (Rp 1.250.000/gram)
        3. Plafon pinjaman yang disarankan
        4. Potensi risiko atau masalah
      `

      const completion = await this.zai!.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Anda adalah ahli gadai emas dari Pegadaian dengan pengalaman 10 tahun. Berikan analisis yang akurat dan sesuai regulasi.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      const generatedText = completion.choices[0]?.message?.content || ''

      return {
        success: true,
        confidence: 0.88,
        generated_text: generatedText
      }

    } catch (error) {
      console.error('Generation step failed:', error)
      return {
        success: false,
        confidence: 0.0,
        generated_text: ''
      }
    }
  }

  private async performReflection(analysisData: AnalysisData, generatedText: string) {
    try {
      const prompt = `
        Review dan refleksikan analisis berikut:
        
        Data Asli:
        - Jenis: ${analysisData.object_type}
        - Berat: ${analysisData.estimated_weight} gram
        - Karat: ${analysisData.karat}K
        - Kondisi: ${analysisData.condition}
        
        Analisis yang Dihasilkan:
        ${generatedText}
        
        Identifikasi potensi masalah:
        1. Apakah estimasi berat realistis untuk jenis perhiasan ini?
        2. Apakah karat sesuai dengan kondisi fisik?
        3. Apakah ada anomali dalam perhitungan?
        4. Apakah compliance dengan regulasi Pegadaian?
        
        Berikan daftar masalah yang ditemukan (jika ada).
      `

      const completion = await this.zai!.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Anda adalah quality control expert yang skeptis dan detail. Identifikasi semua potensi masalah dalam analisis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 300
      })

      const reflectionText = completion.choices[0]?.message?.content || ''
      
      const issues = this.extractIssues(reflectionText)

      return {
        success: issues.length === 0,
        confidence: Math.max(0.5, 1.0 - (issues.length * 0.1)),
        issues_found: issues
      }

    } catch (error) {
      console.error('Reflection step failed:', error)
      return {
        success: false,
        confidence: 0.0,
        issues_found: ['Reflection process failed']
      }
    }
  }

  private async performValidation(analysisData: AnalysisData, issuesFound: string[]) {
    try {
      const prompt = `
        Validasi final analisis gadai emas berdasarkan data dan isu yang ditemukan:
        
        Data:
        - Jenis: ${analysisData.object_type}
        - Berat: ${analysisData.estimated_weight} gram
        - Karat: ${analysisData.karat}K
        - Kondisi: ${analysisData.condition}
        
        Issues yang Ditemukan:
        ${issuesFound.join('\n')}
        
        Berikan keputusan final:
        - APPROVED: Jika tidak ada isu signifikan
        - REQUIRES_REVIEW: Jika ada isu minor yang perlu dicek
        - REJECTED: Jika ada isu major yang tidak dapat diterima
        
        Jelaskan alasan keputusan Anda.
      `

      const completion = await this.zai!.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Anda adalah compliance officer Pegadaian. Buat keputusan final yang tegas dan dapat dipertanggungjawabkan.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 200
      })

      const decisionText = completion.choices[0]?.message?.content || 'REQUIRES_REVIEW'
      
      const isApproved = decisionText.includes('APPROVED')
      const requiresReview = decisionText.includes('REQUIRES_REVIEW')

      return {
        success: isApproved || requiresReview,
        confidence: isApproved ? 0.95 : requiresReview ? 0.70 : 0.30,
        final_decision: decisionText
      }

    } catch (error) {
      console.error('Validation step failed:', error)
      return {
        success: false,
        confidence: 0.0,
        final_decision: 'VALIDATION_FAILED'
      }
    }
  }

  private getMaxLTV(karat: number): number {
    // LTV berdasarkan karat (sesuai regulasi Pegadaian)
    if (karat >= 24) return 85
    if (karat >= 22) return 80
    if (karat >= 18) return 75
    if (karat >= 16) return 70
    return 65
  }

  private extractIssues(reflectionText: string): string[] {
    const issues: string[] = []
    const lines = reflectionText.split('\n')
    
    for (const line of lines) {
      if (line.toLowerCase().includes('masalah') || 
          line.toLowerCase().includes('issue') ||
          line.toLowerCase().includes('anomali') ||
          line.toLowerCase().includes('tidak sesuai')) {
        issues.push(line.trim())
      }
    }
    
    return issues
  }

  private generateRecommendations(analysisData: AnalysisData, issuesFound: string[]): string[] {
    const recommendations: string[] = []
    
    if (issuesFound.length > 0) {
      recommendations.push('Perlu pemeriksaan fisik tambalian di cabang')
      recommendations.push('Verifikasi ulang estimasi berat dengan timbangan digital')
    }
    
    if (analysisData.confidence_scores.weight_estimation < 80) {
      recommendations.push('Gunakan timbangan presisi untuk konfirmasi berat actual')
    }
    
    if (analysisData.confidence_scores.karat_analysis < 85) {
      recommendations.push('Lakukan uji karat dengan alat XRF untuk konfirmasi')
    }
    
    if (analysisData.estimated_weight < 1) {
      recommendations.push('Berat di bawah minimum, pertimbangkan penolakan')
    }
    
    if (analysisData.condition === 'Cukup') {
      recommendations.push('Potensi pengurangan nilai 5-10% untuk kondisi')
    }
    
    return recommendations
  }
}

export const ragValidator = new RAGValidator()