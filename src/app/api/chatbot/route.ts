import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // TODO: Integrate dengan AI service Anda (OpenAI, Claude, dll)
    // Contoh response sederhana:
    const reply = await generateResponse(message)

    return NextResponse.json({ 
      success: true, 
      reply 
    })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process message' 
    }, { status: 500 })
  }
}

async function generateResponse(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase()

  // Simple rule-based responses (ganti dengan AI nanti)
  if (lowerMessage.includes('harga emas')) {
    return 'Harga emas hari ini adalah Rp 1.250.000 per gram. Anda bisa langsung melakukan estimasi melalui fitur Upload Foto Emas di halaman Demo.'
  }
  
  if (lowerMessage.includes('cara') || lowerMessage.includes('bagaimana')) {
    return 'Untuk mengestimasi emas:\n1. Klik menu "Demo"\n2. Upload foto emas\n3. AI akan menganalisis otomatis\n4. Dapatkan estimasi nilai & plafon pinjaman'
  }

  if (lowerMessage.includes('terima kasih')) {
    return 'Sama-sama! Ada yang bisa saya bantu lagi? 😊'
  }

  return 'Terima kasih atas pertanyaan Anda. Saya adalah asisten AI untuk membantu Anda dengan estimasi emas. Apakah ada yang bisa saya bantu?'
}