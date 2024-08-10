import { PrismaClient, InstrumentType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed Topics
  const topics = [
    { topic: 'Kebijakan dan Rencana Penanggulangan Bencana Nasional dan Daerah', part: 1 },
    { topic: 'Mekanisme Koordinasi Penanggulangan Bencana berkaitan dengan kespro', part: 2 },
    { topic: 'Data kespro di tingkat nasional dan sub-nasional', part: 3 },
    { topic: 'Sumber daya untuk implementasi PPAM', part: 4 },
    { topic: 'Pelayanan PPAM: Umum', part: 5 },
    { topic: 'Komponen PPAM 2: Mencegah kekerasan seksual dan menanggapi kebutuhan para penyintas', part: 6 },
    { topic: 'Komponen PPAM 3: Mencegah penularan dan mengurangi kesakitan dan kematian akibat HIV dan IMS lainnya', part: 7 },
    { topic: 'Komponen PPAM 4: Mencegah meningkatnya kesakitan dan kematian maternal dan neonatal', part: 8 },
    { topic: 'Komponen PPAM 5: Mencegah kehamilan yang tidak diinginkan', part: 9 },
    { topic: 'Komponen PPAM 6: layanan minimun kesehatan reproduksi remaja', part: 10 },
    { topic: 'Komponen PPAM 7: Layananminum kesehatan Balita', part: 11 },
    { topic: 'Komponen PPAM 8: Layanan Minimum Kesehatan Lansia', part: 12 },
    { topic: 'Kegiatan prioritas lainnya: Perawatan aborsi yang aman sesuai dengan hukum yang berlaku', part: 13 },
  ]

  for (const topic of topics) {
    await prisma.topics.create({
      data: topic,
    })
  }

  // Seed Instruments
  const instruments = [
    { number: 1, topicId: 1, question: 'Apakah negara Anda mempunyai Kebijakan dan/atau Program Kesiapsiagaan', type: InstrumentType.select },
    { number: 2, topicId: 1, question: 'Apakah negara Anda mempunyai Program Kesiapsiagaan Kesehatan Nasional', type: InstrumentType.select },
    { number: 8, topicId: 2, question: 'Apakah ada mekanisme koordinasi yang bertanggung jawab dalam', type: InstrumentType.select },
    { number: 14, topicId: 3, question: 'Apakah penilaian risiko yang ada saat ini memberikan dampak terhadap', type: InstrumentType.text },
    { number: 18, topicId: 4, question: 'Apakah ada mekanisme mobilisasi dana yang cepat untuk mendukung respons', type: InstrumentType.select },
    { number: 22, topicId: 5, question: 'Apakah seluruh komoditas kespro yang diperlukan untuk pelaksanaan PPAM', type: InstrumentType.select },
    { number: 31, topicId: 6, question: 'Aktor mana yang bertanggung jawab untuk memastikan penyediaan layanan', type: InstrumentType.text },
    { number: 37, topicId: 7, question: 'Aktor manakah yang bertanggung jawab untuk memastikan penyediaan', type: InstrumentType.text },
    { number: 43, topicId: 8, question: 'Aktor manakah yang bertanggung jawab untuk memastikan penyediaan', type: InstrumentType.text },
    { number: 48, topicId: 9, question: 'Aktor manakah yang bertanggung jawab untuk memastikan layanan', type: InstrumentType.text },
    { number: 53, topicId: 10, question: 'Aktor manakah yang bertanggung jawab untuk memastikan layanan kesehatan', type: InstrumentType.text },
    { number: 58, topicId: 11, question: 'Aktor manakah yang bertanggung jawab untuk memastikan layanan kesehatan', type: InstrumentType.text },
    { number: 63, topicId: 12, question: 'Aktor manakah yang bertanggung jawab untuk memastikan layanan kesehatan', type: InstrumentType.text },
    { number: 68, topicId: 13, question: 'Apakah ada situasi dalam konteks Anda di mana layanan aborsi yang aman', type: InstrumentType.select },
  ]

  for (const instrument of instruments) {
    await prisma.instrument.create({
      data: instrument,
    })
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })