import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@masai.id' },
    update: {},
    create: {
      email: 'admin@masai.id',
      name: 'Admin MasAI',
      password_hash: 'admin123', // Plain text for demo only
      role: 'ADMIN',
      phone: '+6281234567890'
    }
  })

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@masai.id' },
    update: {},
    create: {
      email: 'user@masai.id',
      name: 'Ahmad Wijaya',
      password_hash: 'user123', // Plain text for demo only
      role: 'USER',
      phone: '+6289876543210'
    }
  })

  console.log('✅ Users created:', { admin: admin.email, user: user.email })

  // Create gold prices
  const goldPrices = [
    {
      buy_price: 1250000,
      sell_price: 1270000,
      effective_date: new Date('2024-01-12'),
      source: 'Pegadaian Official'
    },
    {
      buy_price: 1245000,
      sell_price: 1265000,
      effective_date: new Date('2024-01-11'),
      source: 'Pegadaian Official'
    },
    {
      buy_price: 1240000,
      sell_price: 1260000,
      effective_date: new Date('2024-01-10'),
      source: 'Pegadaian Official'
    },
    {
      buy_price: 1235000,
      sell_price: 1255000,
      effective_date: new Date('2024-01-09'),
      source: 'Pegadaian Official'
    },
    {
      buy_price: 1230000,
      sell_price: 1250000,
      effective_date: new Date('2024-01-08'),
      source: 'Pegadaian Official'
    }
  ]

  for (const priceData of goldPrices) {
    await prisma.goldPrice.upsert({
      where: { effective_date: priceData.effective_date },
      update: priceData,
      create: priceData
    })
  }

  console.log('✅ Gold prices created')

  // Create knowledge base entries
  const knowledgeBase = [
    {
      category: 'regulation',
      title: 'Syarat Gadai Emas di Pegadaian',
      content: `# Syarat Gadai Emas di Pegadaian

## Persyaratan Umum
1. Usia minimal 21 tahun atau sudah menikah
2. Memiliki KTP/SIM yang masih berlaku
3. Emas asli (bukan replika atau imitasi)
4. Berat minimum 1 gram

## Karat yang Diterima
- Emas 24K (emas murni)
- Emas 22K 
- Emas 18K
- Emas 16K

## Dokumen yang Diperlukan
- Identitas diri (KTP/SIM/Paspor)
- NPWP (untuk pinjaman di atas 50 juta)
- Surat kuasa (jika diwakilkan)

## Nilai LTV Maksimal
- Emas 24K: 85%
- Emas 22K: 80%
- Emas 18K: 75%
- Emas 16K: 70%`,
      keywords: 'gadai emas, syarat, persyaratan, KTP, SIM, karat, LTV',
      priority: 10
    },
    {
      category: 'policy',
      title: 'Perhitungan Biaya Administrasi',
      content: `# Perhitungan Biaya Administrasi Gadai Emas

## Struktur Biaya
### Biaya Administrasi
- Pinjaman ≤ Rp 1.000.000: Rp 5.500
- Pinjaman > Rp 1.000.000 - Rp 5.000.000: Rp 11.000
- Pinjaman > Rp 5.000.000 - Rp 10.000.000: Rp 16.500
- Pinjaman > Rp 10.000.000 - Rp 50.000.000: Rp 22.000
- Pinjaman > Rp 50.000.000: Rp 33.000

### Sewa Modal
- Dihitung per bulan
- Tarif: 0.8% - 1.2% per bulan tergantung jumlah pinjaman

## Contoh Perhitungan
Pinjaman Rp 10.000.000:
- Biaya administrasi: Rp 16.500
- Sewa modal bulan pertama: Rp 100.000 (1%)
- Total yang diterima: Rp 9.883.500`,
      keywords: 'biaya, administrasi, sewa modal, perhitungan, tarif',
      priority: 8
    },
    {
      category: 'procedure',
      title: 'Proses Pengajuan Gadai Emas',
      content: `# Proses Pengajuan Gadai Emas

## Langkah 1: Pengajuan Awal
1. Upload foto emas melalui aplikasi MasAI
2. AI menganalisis jenis, berat, dan kondisi emas
3. Sistem memberikan estimasi nilai awal

## Langkah 2: Verifikasi Dokumen
1. Siapkan dokumen identitas
2. Upload dokumen melalui aplikasi
3. Verifikasi oleh tim Pegadaian

## Langkah 3: Penilaian Fisik
1. Datang ke cabang Pegadaian terdekat
2. Emas ditimbang dan dinilai langsung
3. Penentuan nilai final

## Langkah 4: Persetujuan dan Cair
1. Persetujuan final
2. Penandatanganan perjanjian
3. Pencairan dana

## Estimasi Waktu
- Analisis AI: 2-5 menit
- Verifikasi dokumen: 1-2 jam
- Penilaian fisik: 30 menit - 1 jam
- Pencairan: 15-30 menit`,
      keywords: 'proses, pengajuan, verifikasi, penilaian, cair, waktu',
      priority: 9
    },
    {
      category: 'faq',
      title: 'FAQ - Pertanyaan yang Sering Diajukan',
      content: `# FAQ Gadai Emas

## Q: Apakah emas bisa ditolak?
A: Ya, emas bisa ditolak jika:
- Ternyata imitasi/replika
- Kondisi rusak parah
- Tidak memenuhi syarat karat minimum
- Berat di bawah minimum

## Q: Berapa lama pinjaman bisa dicairkan?
A: Jika semua dokumen lengkap, pinjaman bisa cair dalam 1x24 jam

## Q: Apakah emas aman di Pegadaian?
A: Ya, emas diasuransikan dan disimpan di brankas yang aman

## Q: Bagaimana cara mengambil kembali emas?
A: Lunasi pinjaman + sewa modal, lalu serahkan bukti gadai

## Q: Apakah ada denda jika terlambat bayar?
A: Ya, ada denda keterlambatan 0.05% per hari dari jumlah pinjaman`,
      keywords: 'faq, pertanyaan, ditolak, aman, pengambilan, denda',
      priority: 5
    }
  ]

  for (const kb of knowledgeBase) {
    await prisma.knowledgeBase.upsert({
      where: { 
        category_title: {
          category: kb.category,
          title: kb.title
        }
      },
      update: kb,
      create: kb
    })
  }

  console.log('✅ Knowledge base created')

  // Create system configuration
  const systemConfigs = [
    {
      key: 'MAX_ESTIMATION_AGE_HOURS',
      value: '24',
      description: 'Maximum age of estimation before expiration (in hours)'
    },
    {
      key: 'MIN_GOLD_WEIGHT_GRAMS',
      value: '1',
      description: 'Minimum gold weight for gadaian (in grams)'
    },
    {
      key: 'DEFAULT_LTV_RATES',
      value: JSON.stringify({
        '24': 85,
        '22': 80,
        '18': 75,
        '16': 70,
        '14': 65
      }),
      description: 'Default LTV rates by karat'
    },
    {
      key: 'AI_CONFIDENCE_THRESHOLD',
      value: '0.7',
      description: 'Minimum confidence threshold for AI analysis'
    },
    {
      key: 'RAG_VALIDATION_ENABLED',
      value: 'true',
      description: 'Enable RAG validation for estimations'
    }
  ]

  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config
    })
  }

  console.log('✅ System configuration created')

  // Create sample estimation
  const sampleEstimation = await prisma.estimation.create({
    data: {
      user_id: user.id,
      estimation_id: 'EST-1705123456789-SAMPLE',
      object_type: 'Kalung',
      estimated_weight: 12.5,
      karat: 22,
      condition: 'Baik',
      confidence_object_detection: 0.94,
      confidence_weight_estimation: 0.87,
      confidence_karat_analysis: 0.91,
      confidence_condition_analysis: 0.88,
      gold_price_per_gram: 1250000,
      estimated_gold_value: 15625000,
      max_ltv_percentage: 80,
      max_loan_amount: 12500000,
      admin_fee: 16500,
      net_loan_amount: 12483500,
      rag_is_valid: true,
      rag_confidence_score: 0.87,
      rag_recommendations: JSON.stringify([
        'Proses dapat dilanjutkan ke tahap berikutnya',
        'Siapkan dokumen identitas pemohon',
        'Jadwalkan pemeriksaan fisik di cabang terdekat'
      ]),
      status: 'DRAFT',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    }
  })

  console.log('✅ Sample estimation created:', sampleEstimation.estimation_id)

  // Create sample application
  const sampleApplication = await prisma.application.create({
    data: {
      estimation_id: sampleEstimation.id,
      user_id: user.id,
      application_number: 'APP-2024-001234',
      full_name: 'Ahmad Wijaya',
      email: 'user@masai.id',
      phone: '+6289876543210',
      id_card_number: '3275031212950001',
      requested_amount: 12500000,
      status: 'PROCESSING',
      current_step: 'document_verification',
      progress_percentage: 60,
      branch_name: 'Pegadaian Cabang Jakarta Pusat',
      branch_address: 'Jl. MH Thamrin No. 1, Jakarta Pusat',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  })

  console.log('✅ Sample application created:', sampleApplication.application_number)

  // Create application status logs
  const statusLogs = [
    {
      application_id: sampleApplication.id,
      step: 'Pengajuan Dibuat',
      status: 'completed',
      description: 'Pengajuan gadai telah berhasil dibuat',
      timestamp: new Date('2024-01-12T10:30:00Z')
    },
    {
      application_id: sampleApplication.id,
      step: 'Analisis AI Selesai',
      status: 'completed',
      description: 'Analisis AI dan estimasi nilai selesai',
      timestamp: new Date('2024-01-12T10:35:00Z')
    },
    {
      application_id: sampleApplication.id,
      step: 'Menunggu Verifikasi',
      status: 'completed',
      description: 'Menunggu verifikasi fisik di cabang',
      timestamp: new Date('2024-01-12T11:00:00Z')
    },
    {
      application_id: sampleApplication.id,
      step: 'Verifikasi Dokumen',
      status: 'in_progress',
      description: 'Memverifikasi dokumen identitas dan kelengkapan berkas',
      timestamp: new Date('2024-01-12T14:00:00Z')
    }
  ]

  for (const log of statusLogs) {
    await prisma.applicationStatusLog.create({ data: log })
  }

  console.log('✅ Application status logs created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })