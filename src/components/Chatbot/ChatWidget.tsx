'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import './Chatbot.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const KNOWLEDGE_BASE = `
Gadai Konvensional
Apa itu Pegadaian Gadai Emas?
Pegadaian Gadai Emas adalah kredit dengan sistem gadai untuk kebutuhan konsumtif maupun produktif dengan barang jaminan berupa emas, baik emas batangan maupun perhiasan (termasuk berlian).
Mengapa Pegadaian Gadai Emas?
Proses pengajuan mudah
Dapat dicicil dan dilunasi sewaktu-waktu, serta bisa diperpanjang berkali-kali
Uang pinjaman dapat diterima secara tunai maupun transfer
Tersedia beberapa macam fitur pembayaran sesuai kebutuhan
Barang jaminan aman dan diasuransikan


Persyaratan
Apa yang Harus Dilengkapi?
Melampirkan kartu identitas resmi yang masih berlaku (KTP/SIM/Passport)
Menyerahkan barang jaminan / titipan


Pengajuan
Bagaimana Cara Transaksi Gadai Emas?
Datang ke cabang Pegadaian terdekat
Mengisi form pengajuan Gadai Emas
Melampirkan kartu identitas (KTP)
Menyerahkan barang jaminan emas
Barang jaminan ditaksir oleh petugas penaksir
Konfirmasi uang pinjaman
Menandatangani Surat Bukti Gadai (SBG)
Uang pinjaman diterima secara tunai atau transfer






Jenis Layanan Pegadaian Konvensional
1. Reguler
Uang Pinjaman: Dari Rp50.000 hingga lebih dari Rp20.000.000.
Jangka Waktu Minimal: 120 hari.
Sewa Modal Minimum: 1% per 15 hari.
Jangka Waktu Maksimal: 36 bulan.
Sewa Modal Maksimal (1 Tahun): 28.80%.
Pembayaran: Dapat ditebus sewaktu-waktu.
Administrasi: Dari Rp2.000 hingga Rp125.000.
2. Harian
Uang Pinjaman: Dari Rp50.000 hingga lebih dari Rp20.000.000.
Jangka Waktu Minimal: 30 hari.
Sewa Modal Minimum: 0.07% per hari.
Jangka Waktu Maksimal: 180 Hari.
Sewa Modal Maksimal (1 Tahun): Tidak disebutkan (-).
Pembayaran: Dapat ditebus sewaktu-waktu.
Administrasi: Dari Rp2.000 hingga Rp125.000.
3. Bisnis
Uang Pinjaman: Dari Rp100.000.000 hingga lebih dari Rp1.000.000.000.
Jangka Waktu Minimal: 120 hari.
Sewa Modal Minimum: 0.65% per 15 hari.
Jangka Waktu Maksimal: Tidak disebutkan (-).
Sewa Modal Maksimal (1 Tahun): Tidak disebutkan (-).
Pembayaran: Dapat ditebus sewaktu-waktu.
Administrasi: Rp100.000.
4. Angsuran
Uang Pinjaman: Dari Rp1.000.000 hingga lebih dari Rp20.000.000.
Jangka Waktu Minimal: 6 Bulan.
Sewa Modal Minimum: Mulai dari 1.25% hingga 1.40%.
Jangka Waktu Maksimal: 36 Bulan.
Sewa Modal Maksimal (1 Tahun): 15%.
Pembayaran: Diangsur perbulan.
Administrasi: Dari Rp10.000 hingga Rp200.000.
5. Prima
Uang Pinjaman: Dari Rp50.000 hingga Rp500.000.
Jangka Waktu Minimal: 6 Bulan.
Sewa Modal Minimum: 0%.
Jangka Waktu Maksimal: 60 Hari.
Sewa Modal Maksimal (1 Tahun): 0%.
Pembayaran: Diangsur perbulan.
Administrasi: Dari Rp2.000 hingga Rp5.000.

Simulasi Pinjaman
Barang Jaminan 		: Emas
Uang Pinjaman   		: Rp4.600.000
Jangka Waktu Maksimal 	: 120 Hari (4 Bulan dan bisa diperpanjang)
Sewa Modal 		        	: 1,2 % / 15 Hari (9,6 % / 120 Hari)


Simulasi Detail Pinjaman
Anda menggadaikan perhiasan dengan nilai uang pinjaman Rp 4.600.000, rinciannya seperti ini:
Uang Pinjaman yang Anda Terima: Rp 4.600.000
Jangka Waktu: 120 hari (atau 4 bulan, dengan perhitungan sewa modal per 15 hari dan dapat diperpanjang sewaktu-waktu)
Biaya Sewa Modal: Hanya 1,2% per 15 hari.
Total Biaya Sewa Modal selama 120 hari: 9,6% dari uang pinjaman (ini setara dengan Rp 441.600).
Sewa modal jika diperpanjang hingga 360 hari / 1 tahun : Rp 1.324.800 (Rp441.600 x 3 periode sewa modal)
Jadi, total pelunasan selama masa pinjaman dengan perhitungan uang pinjaman ditambah total biaya sewa modal adalah
120 hari : Rp 4.600.000 + Rp 441.600 = Rp 5.040.000.
360 hari : Rp 4.600.000 + Rp 1.324.800 = Rp 5.924.800.
Pertanyaan yang Sering Diajukan
Apa saja jenis barang yang diterima sebagai jaminan?
Barang yang diterima dapat berupa emas perhiasan, emas batangan, dan berlian.
Apakah untuk melakukan perpanjangan atau gadai ulang dapat dilakukan di seluruh cabang atau secara online?
Untuk menghindari denda, nasabah dapat memperpanjang di seluruh outlet Pegadaian konvensional dan memanfaatkan aplikasi Tring! by Pegadaian untuk melakukan pembayaran perpanjangan.
Sebagai catatan, jika telah memasuki masa lelang, nasabah diwajibkan datang ke outlet asal menggadai barang.
Apakah bisa menerima gadai Dinar?
Bisa.
Jika barang kita terlelang, apa ada pemberitahuan?
Ada.
Pastikan nomor handphone yang terdaftar di Pegadaian, merupakan nomor handphone terkini dan aktif.
Berapa persentase besaran sewa modal yang berlaku di Pegadaian untuk produk Gadai Emas ini?
Besaran sewa modal bervariatif.
Mulai dari 0,65% (Gadai Bisnis) hingga 1,2% (Gadai Reguler).
Berapa lama jangka waktu pinjaman?
Jangka waktu maksimal adalah 120 hari.
Dapat diperpanjang dengan membayar sewa modal + biaya Admin.
Kapan tanggal jatuh tempo dan lelang dilakukan?
Tanggal jatuh tempo dan lelang sudah tertera pada SBG (Surat Bukti Gadai).



Gadai Syariah
Apa itu Pegadaian Gadai Emas Syariah?
Produk unggulan Pegadaian untuk memenuhi kebutuhan dana cepat dan aman dengan jaminan emas batangan, perhiasan emas, koin emas, perhiasan emas dengan batu permata dengan prinsip syariah


Mengapa Pegadaian Gadai Emas Syariah?
Sesuai Fatwa Dewan Syariah Nasional Majelis Ulama Indonesia (DSN-MUI)
Tersedia berbagai fitur pembayaran sesuai kebutuhan
Barang jaminan aman dan diasuransikan
Dapat dicicil dan dilunasi sewaktu-waktu, serta bisa diperpanjang berkali-kali
Proses pengajuan mudah


Persyaratan
Apa yang Harus Dilengkapi?
Melampirkan kartu identitas resmi yang masih berlaku (KTP/SIM/Passport)
Menyerahkan barang jaminan / titipan


Pengajuan
Bagaimana Cara Transaksi Gadai Emas Syariah?
Datang ke cabang Pegadaian terdekat
Mengisi form pengajuan Gadai Emas
Melampirkan kartu identitas (KTP)
Menyerahkan barang jaminan emas
Barang jaminan ditaksir oleh petugas penaksir
Konfirmasi uang pinjaman
Menandatangani Surat Bukti Gadai (SBG)
Uang pinjaman diterima secara tunai atau transfer




Jenis Layanan Pegadaian Syariah
1. Reguler
Uang Pinjaman: Dari Rp50.000 hingga Rp20.000.000.
Jangka Waktu Minimal: 120 hari.
Mu'nah Minimum (Biaya Pemeliharaan): 0.49% per 10 hari.
Jangka Waktu Maksimal: 36 bulan.
Mu'nah Maksimal: 0.79% per 10 hari.
Mu'nah Maksimal (1 Tahun): 17.64%.
Pembayaran: Dapat dilunasi atau dicicil sewaktu-waktu.
Mu'nah Maksimal (1 Tahun) (Administrasi): Dari Rp2.500 hingga Rp125.000 (Tampaknya kolom terakhir ini merujuk pada biaya administrasi).
2. Harian
Uang Pinjaman: Dari Rp50.000 hingga Rp20.000.000.
Jangka Waktu Minimal: 10 hari.
Mu'nah Minimum (Biaya Pemeliharaan): 0.086% per hari.
Jangka Waktu Maksimal: 60 hari.
Mu'nah Maksimal: Tidak disebutkan (-).
Mu'nah Maksimal (1 Tahun): Tidak disebutkan (Kosong).
Pembayaran: Dapat dilunasi atau dicicil sewaktu-waktu.
Mu'nah Maksimal (1 Tahun) (Administrasi): Dari Rp2.000 hingga Rp125.000 (Tampaknya kolom terakhir ini merujuk pada biaya administrasi).
3. Hasan
Uang Pinjaman: Dari Rp50.000 hingga Rp500.000.
Jangka Waktu Minimal: 10 hari.
Mu'nah Minimum (Biaya Pemeliharaan): 0% (Nol persen).
Jangka Waktu Maksimal: 60 hari.
Mu'nah Maksimal: Tidak disebutkan (-).
Mu'nah Maksimal (1 Tahun): Tidak disebutkan (Kosong).
Pembayaran: Dapat dilunasi atau dicicil sewaktu-waktu.
Mu'nah Maksimal (1 Tahun) (Administrasi): Dari Rp2.000 hingga Rp5.000 


Simulasi Pinjaman
Taksiran 		: Rp5.100.000
Uang Pinjaman 	: Rp5.000.000
Jangka Waktu 	:120 hari
Pertanyaan yang sering diajukan
Apa saja jenis barang yang diterima sebagai jaminan?
Emas perhiasan, emas batangan, dan berlian.
Apakah untuk melakukan perpanjangan atau gadai ulang dapat dilakukan di seluruh cabang atau secara online?
Ya, dapat dilakukan di seluruh cabang dan di aplikasi Tring! by Pegadaian.
Untuk menghindari denda, nasabah dapat memanfaatkan aplikasi Tring! by Pegadaian untuk melakukan pembayaran perpanjangan.
Jika sudah memasuki masa lelang, nasabah diwajibkan datang ke outlet asal menggadai barang.
Apakah cabang Pegadaian bisa menerima gadai Dinar?
Bisa.
Jika barang kita terlelang, apa ada pemberitahuan?
Ada.
Pastikan nomor handphone yang terdaftar di Pegadaian, merupakan nomor handphone terkini dan aktif.
Untuk kredit yang jatuh tempo ketika kantor Pegadaian libur, nasabah mendapat denda atau tidak jika melakukan pembayaran ketika kantor Pegadaian buka kembali?
Untuk menghindari denda, nasabah dapat memanfaatkan aplikasi Tring! by Pegadaian untuk melakukan pembayaran perpanjangan.
Berapa persen besar mu'nahnya (Gadai Emas Syariah)?
Besaran sewa modal Gadai Emas Syariah di PT Pegadaian bervariatif.
Mulai dari 0,47% (untuk pinjaman Rp50 ribu - Rp500 ribu) hingga 0,69% (untuk pinjaman 20 Juta ke atas) per 10 hari.
Berapa persen besaran sewa modal yang berlaku di Pegadaian untuk produk Gadai Emas (Konvensional)?
Besaran sewa modal bervariatif.
Mulai dari 0,65% (Gadai Bisnis) hingga 1,2% (Gadai Reguler).
Berapa lama jangka waktu pinjaman?
Jangka waktu maksimal adalah 120 hari.
Dapat diperpanjang dengan membayar sewa modal + biaya Admin.
Dapat diperpanjang berkali-kali.
Berapa besar total pelunasannya?
Total uang pinjaman + mu'nah pemeliharaan berjalan.
Kapan tanggal jatuh tempo dan lelang dilakukan?
Tanggal jatuh tempo dan lelang sudah tertera pada SBG (Surat Bukti Gadai).
Tanggal jatuh tempo dan lelang juga sudah tertera pada SBR (Surat Bukti Rahn).
Dimanakah tempat pelelangan dilakukan dan jadwal lelang?
Untuk perpanjangan atau gadai ulang sudah dapat dilakukan disemua outlet Pegadaian atau melalui aplikasi Tring! by Pegadaian.
Untuk minta tambah dan melakukan pengambilan barang jaminan harus di outlet tempat pertama kali melakukan transaksi.
`;

export default function ChatbotCore() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Saya MasAI Assistant 👋\n\n Saya siap membantu Anda dengan informasi tentang Gadai Emas Konvensional, Gadai Emas Syariah, jenis layanan, persyaratan, dan simulasi pinjaman. Silahkan tanyakan apa saja!',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const systemPrompt = `Anda adalah MasAI, asisten virtual Pegadaian yang ramah dan profesional. Anda membantu nasabah dengan informasi tentang produk Gadai Emas Konvensional dan Syariah.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}

INSTRUKSI PENTING:
1. Gunakan HANYA informasi dari knowledge base di atas untuk menjawab
2. Jika pertanyaan tidak ada di knowledge base, katakan dengan jelas bahwa informasi tersebut tidak tersedia
3. Jawab dengan ramah, jelas, dan terstruktur
4. Gunakan format **bold** untuk menekankan kata penting seperti angka, biaya, atau istilah penting
5. Jawab dalam Bahasa Indonesia yang baik, sopan, dan informatif
6. Jika pertanyaan tentang perbedaan konvensional dan syariah, jelaskan dengan ringkas dan jelas
7. Untuk pertanyaan spesifik tentang harga/angka, berikan contoh perhitungan jika tersedia
8. Jangan membuat informasi yang tidak ada dalam knowledge base`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLAUDE_API_KEY || 'your-api-key'}`
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          messages: [{ role: 'user', content: input }],
          system: systemPrompt,
        }),
      })

      const data = await response.json()

      if (data.content && data.content[0]) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.content[0].text,
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botResponse])
      } else {
        throw new Error('Response tidak valid')
      }
    } catch (error) {
      console.error('Error:', error)
      // Fallback to rule-based responses if API fails
      const fallbackResponse = generateFallbackResponse(input)
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    } finally {
      setIsTyping(false)
    }
  }

  // Fallback function for when API fails
  const generateFallbackResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()

    if (msg.includes('harga') || msg.includes('emas') || msg.includes('berapa')) {
      return 'Informasi harga emas dapat bervariasi tergantung kondisi pasar. Untuk estimasi yang akurat, Anda bisa langsung melakukan estimasi dengan mengupload foto emas di menu Demo Pegadaian! 📸'
    }

    if (msg.includes('cara') || msg.includes('estimasi') || msg.includes('bagaimana')) {
      return 'Cara melakukan estimasi emas di Pegadaian:\n\n1️⃣ Datang ke cabang Pegadaian terdekat\n2️⃣ Isi form pengajuan Gadai Emas\n3️⃣ Lampirkan KTP/SIM/Passport yang masih berlaku\n4️⃣ Serahkan barang jaminan emas untuk ditaksir\n5️⃣ Konfirmasi uang pinjaman dan tanda tangani SBG\n\nProsesnya mudah dan cepat! ⚡'
    }

    if (msg.includes('syarat') || msg.includes('dokumen')) {
      return 'Syarat gadai emas di Pegadaian:\n\n📄 **Dokumen:**\n• KTP/SIM/Passport asli yang masih berlaku\n\n💍 **Barang Jaminan:**\n• Emas perhiasan, emas batangan, atau berlian\n• Emas asli (bukan replika)\n\nSemua barang jaminan diasuransikan untuk keamanan Anda.'
    }

    if (msg.includes('konvensional') && msg.includes('syariah')) {
      return '**Perbedaan Gadai Konvensional vs Syariah:**\n\n💎 **Konvensional:** Menggunakan sistem sewa modal dengan persentase tertentu per periode waktu.\n\n🕌 **Syariah:** Menggunakan sistem mu\'nah (biaya pemeliharaan) dengan prinsip syariah sesuai fatwa DSN-MUI.\n\nKedua sistem memiliki kelebihan masing-masing sesuai kebutuhan nasabah.'
    }

    if (msg.includes('sewa modal') || msg.includes('biaya')) {
      return 'Biaya sewa modal gadai emas konvensional bervariasi:\n\n💰 **Reguler:** 1% per 15 hari\n💰 **Harian:** 0.07% per hari\n💰 **Bisnis:** 0.65% per 15 hari\n\nUntuk gadai syariah menggunakan mu\'nah (biaya pemeliharaan) mulai dari 0.47% hingga 0.79% per 10 hari.'
    }

    if (msg.includes('perpanjang') || msg.includes('perpanjangan')) {
      return 'Cara perpanjangan gadai emas:\n\n✅ Dapat dilakukan di seluruh outlet Pegadaian\n✅ Bisa melalui aplikasi Tring! by Pegadaian\n✅ Perpanjangan dapat dilakukan berkali-kali\n✅ Untuk menghindari denda, lakukan perpanjangan sebelum jatuh tempo\n\nNote: Jika sudah memasuki masa lelang, harus datang ke outlet asal menggadai.'
    }

    // Default response
    return 'Terima kasih atas pertanyaan Anda! 🙏\n\nSaya bisa membantu dengan informasi tentang:\n\n💰 Gadai Emas Konvensional\n🕌 Gadai Emas Syariah\n📄 Persyaratan dan dokumen\n💎 Jenis layanan dan biaya\n⏱️ Proses pengajuan dan waktu\n\nSilakan tanyakan hal spesifik yang ingin Anda ketahui!'
  }

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await response.json()
      return data.reply
    } catch (error) {
      return 'Maaf, terjadi kesalahan. Silakan coba lagi.'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    'Apa syarat gadai emas?',
    'Berapa biaya sewa modal?',
    'Beda konvensional dan syariah?',
    'Cara perpanjangan gadai?',
  ]

  return (
    <div className="flex flex-col h-[500px] w-full bg-white rounded-lg border border-amber-200">
      {/* Header - Hanya satu */}
      {/* <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">MasAI Assistant</h1>
            <p className="text-sm text-amber-100">Pegadaian Virtual Assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white/80">Online</span>
          </div>
        </div>
      </div> */}

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-3 border-b border-amber-100 bg-amber-50">
          <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
            <span className="text-amber-500">💡</span> Pertanyaan Cepat:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="text-xs px-3 py-1.5 bg-white text-amber-700 rounded-full hover:bg-amber-50 transition-colors border border-amber-200 hover:border-amber-300 shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-amber-100'
                }`}
            >
              {message.sender === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-amber-600" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.sender === 'user'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
            >
              <div
                className="text-sm leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: message.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />
              <span
                className={`text-xs mt-1 block ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}
              >
                {message.timestamp.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-amber-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tanyakan tentang gadai emas di sini..."
            className="flex-1 px-4 py-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
            rows={2}
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 self-end shadow-sm"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}