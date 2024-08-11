import { Instrument, InstrumentType } from "@prisma/client";

function createSubYa(topicId: number, ...questions: Array<string>) {
  const subQuestions = questions.map( question => {
    return {
      topicId,
      question,
      type: InstrumentType.dropdownya
    }
  })

  return {
    createMany: {
      data: subQuestions
    }
  }
}

function createSubIdeal(topicId: number, ...questions: Array<string>) {
  const subQuestions = questions.map( question => {
    return {
      topicId,
      question,
      type: InstrumentType.dropdownideal
    }
  })

  return {
    createMany: {
      data: subQuestions
    }
  }
}

function createSubCheck(topicId: number, ...questions: Array<string>) {
  const subQuestions = questions.map( question => {
    return {
      topicId,
      question,
      type: InstrumentType.checkbox
    }
  })

  return {
    createMany: {
      data: subQuestions
    }
  }
}

export default [
  { number: 1, topicId: 1, question: "Apakah negara Anda mempunyai Kebijakan dan/atau Program Kesiapsiagaan dan/atau Tanggap Darurat Nasional? Jika ya, silakan tentukan dan sebutkan di kotak komentar jenis keadaan darurat yang dicakupnya (misalnya bencana alam, konflik, keadaan darurat kesehatan masyarakat, dll.)", type: InstrumentType.dropdownya },
  { number: 2, topicId: 1, question: "Apakah negara Anda mempunyai Program Kesiapsiagaan Kesehatan Nasional dan/atau Tanggap Darurat? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 3, topicId: 1, question: "Apakah program ini dilaksanakan di tingkat daerah? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 4, topicId: 1, question: "Apakah kespro dan/atau PPAM diintegrasikan ke dalam kebijakan dan/atau program tanggap darurat kesehatan nasional atau sub-nasional? Jika ya, sebutkan seluruh komponen PPAM yang terintegrasi, wilayah dan tahunnya, serta kebijakan/programnya.", type: InstrumentType.dropdownya },
  { number: 5, topicId: 1, question: "Apakah ada kebijakan atau program terkait kespro yang mencakup ketentuan manajemen bencana dan/atau tanggap darurat? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 6, topicId: 1, question: "Sepengetahuan Anda, apakah ada undang-undang dan/atau kebijakan nasional yang membatasi akses layanan kesehatan reproduksi bagi kelompok tertentu (misalnya migran, migran tidak berdokumen, pengungsi, remaj, orang dengan orientasi seksual, identitas gender, ekspresi gender, dan karakteristik seksual yang beragam (SOGIESC), Orang dengan HIV, pekerja seks, dll)? Jika ya, sebutkan populasinya", type: InstrumentType.dropdownya },
  { number: 7, topicId: 1, question: "Sepengetahuan Anda, apakah kespro disertakan dalam rencana pemulihan ketika respons beralih dari layanan darurat ke layanan yang lebih komprehensif?", type: InstrumentType.dropdownya },
  { number: 8, topicId: 2, question: "Apakah ada mekanisme koordinasi yang bertanggung jawab dalam penanggulangan bencana pada saat krisis? Jika ya, yang mana dan sebutkan di kotak komentar jenis keadaan darurat yang dicakupnya (misalnya bencana alam, konflik, pandemi, dll.)", type: InstrumentType.dropdownya },
  { number: 9, topicId: 2, question: "Dalam mekanisme penanggulangan bencana ini, apakah ada entitas yang bertanggung jawab terhadap kesehatan, termasuk kespro dan kekerasan berbasis gender (KBG), selama tanggap darurat? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 10, topicId: 2, question: "Apakah terdapat mekanisme koordinasi (misalnya kelompok kerja kespro) untuk membahas kespro dalam Keadaan Darurat di tingkat nasional dalam hal: Jika ya, sebutkan di kotak komentar, sebutkan frekuensi pertemuan, dan jenis keadaan darurat yang dicakup oleh kelompok kerja tersebut", type: InstrumentType.sub, sub: createSubYa(2, 'Kesiapsiagaan', 'Tanggapan', 'Pemulihan') },
  { number: 11, topicId: 2, question: "Apakah terdapat struktur/mekanisme koordinasi (misalnya kelompok kerja kespro/komite bencana) untuk membahas kespro dalam Keadaan Darurat di tingkat sub-nasional dalam hal: Jika ya, sebutkan di kotak komentar, sebutkan frekuensi pertemuan, dan jenis keadaan darurat yang dicakup oleh kelompok", type: InstrumentType.sub, sub: { createMany: {data: [ { topicId: 2, question: 'Kesiapsiagaan', type: InstrumentType.dropdownya}, { topicId: 2, question: 'Tanggapan', type: InstrumentType.dropdownya}, { topicId: 2, question: 'Pemulihan', type: InstrumentType.dropdownya} ]}} },
  { number: 12, topicId: 2, question: "Jika tidak ada mekanisme koordinasi, apakah Focal Point kespro ditunjuk di tingkat nasional dan/atau sub-nasional untuk membantu kesiapsiagaan dan tanggap darurat? Jika ya, silakan sebutkan di kotak komentar", type: InstrumentType.dropdownya },
  { number: 13, topicId: 2, question: "Apakah lembaga swadaya masyarakat (LSM) dan organisasi berbasis komunitas bekerja/mewakili kelompok yang terpinggirkan dan kurang terlayani (misalnya, perempuan dan laki-laki penyandang disabilitas, pengidap HIV, kelompok SOGIESC yang beragam, kelompok remaja, pemimpin agama, pekerja seks, etnis minoritas, dll.)? termasuk dalam mekanisme koordinasi? Jika ya, harap tentukan dan daftar peserta", type: InstrumentType.dropdownya },
  { number: 14, topicId: 3, question: "Apakah penilaian risiko yang ada saat ini memberikan dampak terhadap populasi yang berbeda (misalnya perempuan, penyandang disabilitas, pengidap HIV, orang-orang dari berbagai SOGIESC, remaja, pekerja seks, etnis minoritas, dll.)? Jika ya, silakan tentukan di bagian komentar.", type: InstrumentType.dropdownya },
  { number: 15, topicId: 3, question: "Apakah Indikator terkait PPAM (lihat Daftar Periksa PPAM) terintegrasi dalam sistem informasi kesehatan (SIK) yang ada?", type: InstrumentType.dropdownya },
  { number: 16, topicId: 3, question: "Apakah formulir penilaian kebutuhan cepat untuk tanggap darurat (rapid assessments dan rapid health assessments) mencakup data terpilah jenis kelamin, usia, dan disabilitas (SADD) dan pertanyaan-pertanyaan kunci terkait kespro? Jika ya, silakan tentukan jenis pertanyaan di bagian komentar", type: InstrumentType.dropdownya },
  { number: 17, topicId: 3, question: "Apakah instrumen pengumpulan data (misalnya formulir Kesehatan) untuk tanggap darurat mencakup indikator terkait PPAM (lihat Daftar Periksa PPAM)?", type: InstrumentType.dropdownya },
  { number: 18, topicId: 4, question: "Apakah ada mekanisme mobilisasi dana yang cepat untuk mendukung respons kespro? (misalnya, dana darurat, dana gabungan berbasis negara, dll.) Jika ya, silakan sebutkan di kotak komentar", type: InstrumentType.dropdownya },
  { number: 19, topicId: 4, question: "Apakah Anda memiliki mekanisme untuk pengadaan cepat—di tingkat nasional atau internasional—untuk pasokan dan peralatan kespro dan/atau perangkat IARH (misalnya, penentuan posisi sebelumnya, stok penyangga, perjanjian tetap, pemasok yang telah diidentifikasi sebelumnya, dll.)? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 20, topicId: 4, question: "Apakah Anda mempunyai gudang atau fasilitas penyimpanan dimana persediaan medis untuk kespro ditempatkan atau dapat disimpan? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 21, topicId: 4, question: "Apakah ada dana untuk mendukung kesiapsiagaan darurat kesehatan dan/atau kespro di tingkat nasional atau sub-nasional? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 22, topicId: 5, question: "Apakah seluruh komoditas kespro yang diperlukan untuk pelaksanaan PPAM (lihat buku kit IARH) termasuk dalam daftar obat esensial nasional? Jika tidak, silakan sebutkan program-program yang tidak ada padanannya dan dapat mempengaruhi implementasi PPAM", type: InstrumentType.dropdownya },
  { number: 23, topicId: 5, question: "Apakah Anda memiliki sistem untuk mendukung pemberian layanan jarak jauh (misalnya kesehatan digital, telemedis, konsultasi online, dll.)? Jika ya, silakan tentukan yang mana di kotak komentar", type: InstrumentType.dropdownya },
  { number: 24, topicId: 5, question: "Jika terjadi epidemi/pandemi, apakah ada peluang dan rencana untuk meningkatkan penggunaan alat pelindung diri (APD) dan bahan Pencegahan dan Pengendalian Infeksi (Infection Preeveention Control) untuk fasilitas kespro? Jika ya, silakan sebutkan di kotak komentar", type: InstrumentType.dropdownya },
  { number: 25, topicId: 5, question: "Apakah kurikulum pelatihan layanan kesehatan atau pelatihan lain yang relevan, termasuk pada platform online, untuk staf kesehatan mengintegrasikan manajemen kedaruratan kesehatan dan/atau PPAM? Jika ya, sebutkan yang mana: perawat, dokter, bidan, dll.", type: InstrumentType.dropdownya },
  { number: 26, topicId: 5, question: "Apakah terdapat mekanisme bagi staf kesehatan untuk dipindahkan atau mengambil peran baru pada saat darurat agar dapat memberikan dukungan yang lebih baik kepada daerah yang terkena dampak? (misalnya, lonjakan atau pengalihan tugas) Jika ya, silakan sebutkan di kotak komentar", type: InstrumentType.dropdownya },
  { number: 27, topicId: 5, question: "Apakah tim respon kesehatan terdiri dari penyedia layanan spesialis kespro?", type: InstrumentType.dropdownya },
  { number: 28, topicId: 5, question: "Apakah tersedia beragam saluran komunikasi (misalnya radio, pesan teks, WhatsApp, dll.) yang dapat dimanfaatkan untuk memberikan informasi kepada masyarakat mengenai ketersediaan layanan terkait PPAM jika terjadi keadaan darurat? Jika ya, sebutkan apa saja hal-hal tersebut dan bagaimana populasi yang sulit dijangkau dipertimbangkan.", type: InstrumentType.dropdownya },
  { number: 29, topicId: 5, question: "Apakah ada hambatan bagi kelompok marjinal dan kurang terlayani (misalnya perempuan penyandang disabilitas, remaja, pekerja seks, kelompok SOGIESC, ODHIV, pengungsi, migran, migran tidak berdokumen, etnis minoritas, dll.) untuk mengakses layanan kespro? Mohon diperjelas yang mana di kotak komentar", type: InstrumentType.dropdownya },
  { number: 30, topicId: 5, question: "Apakah ada ketentuan mengenai akses gratis terhadap layanan kesehatan (misalnya PPAM) bagi masyarakat yang terkena dampak krisis? Silakan tentukan di kotak komentar", type: InstrumentType.dropdownya },
  { number: 31, topicId: 6, question: "Aktor mana yang bertanggung jawab untuk memastikan penyediaan layanan kekerasan berbasis gender (KGB) (misalnya, manajemen klinis pemerkosaan, perlindungan, layanan hukum, dll.) di wilayah yang dipilih? Harap cantumkan semua lembaga (misalnya, nama unit pemerintah, LSM internasional, masyarakat sipil, organisasi berbasis masyarakat, sektor swasta, dll.)", type: InstrumentType.dropdownya },
  { number: 32, topicId: 6, question: "Apakah ada ruang yang aman, pribadi, dan rahasia10 yang teridentifikasi dan tersedia serta dapat diakses oleh para penyintas KGB? Jika ya, harap sebutkan", type: InstrumentType.text },
  { number: 33, topicId: 6, question: "Apakah ada sistem rujukan yang jelas dan terkini, yang menghubungkan berbagai penyedia layanan KGB (misalnya kesehatan, manajemen kasus KGB, pengobatan hukum, dll) yang dapat dimanfaatkan dalam keadaan darurat? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 34, topicId: 6, question: "Fasilitas kesehatan tingkat manakah yang dapat menyediakan layanan kesehatan berikut (lihat manajemen klinis perkosaan) untuk menanggapi kebutuhan para penyintas di wilayah yang dipilih? (Pertimbangkan penyedia tingkat terendah)", type: InstrumentType.sub, sub: {createMany: {data: [{ topicId: 6, question: 'Kontrasepsi Darurat (EC)', type: InstrumentType.checkbox}, { topicId: 6, question: 'Tes Kehamilan, informasi pilihan kehamilan', type: InstrumentType.checkbox}, { topicId: 6, question: 'Antibiotik untuk mencegah dan mengobati IMS', type: InstrumentType.checkbox}, { topicId: 5, question: 'Profilaksis pasca pajanan (PEP)', type: InstrumentType.checkbox}, { topicId: 6, question: 'Vaksin HepB', type: InstrumentType.checkbox}, { topicId: 6, question: 'Perawatan luka dan pencegahan penyakit tetanus (Tetanus toxoid/Tetanus immunoglobulin)', type: InstrumentType.checkbox}, { topicId: 6, question: 'Dukungan psikososial', type: InstrumentType.checkbox}, { topicId: 6, question: 'Layanan aborsi yang aman/rujukan ke layanan aborsi yang aman (sesuai dengan hukum yang berlaku)', type: InstrumentType.checkbox}, { topicId: 6, question: 'Pengumpulan bukti forensik', type: InstrumentType.checkbox},]} }},
  { number: 35, topicId: 6, question: "Mengingat kondisi layanan saat ini di wilayah Anda, menurut Anda apakah elemen PPAM berikut ini memadai dan tersedia dalam keadaan darurat?", type: InstrumentType.sub, sub: {createMany: {data: [{topicId: 6, question: "Kolaborasi/kemitraan dengan klaster perlindungan atau subklaster/aktor kekerasan berbasis gender untuk menerapkan langkah-langkah pencegahan di tingkat komunitas, lokal dan kabupaten", type:InstrumentType.dropdownya}, {topicId: 6, question: "Perawatan klinis dan rujukan ke layanan pendukung lain yang tersedia bagi para penyintas kekerasan seksual (misalnya hukum, perlindungan, psikososial, shelter, dll.)", type:InstrumentType.dropdownya}, {topicId: 6, question: "Ruang rahasia dan aman di dalam fasilitas kesehatan untuk menerima dan memberikan perawatan klinis dan rujukan yang tepat kepada para penyintas kekerasan seksual", type:InstrumentType.dropdownya}, {topicId: 6, question: "Adanya materi Informasi, Edukasi dan Komunikasi (KIE) tentang layanan bagi penyintas kekerasan seksual yang disiapkan untuk setiap kelompok wilayah paling berisiko jika terjadi keadaan darurat.", type:InstrumentType.dropdownya}]}} },
  { number: 36, topicId: 6, question: "Berdasarkan layanan di atas, bagaimana Anda menilai kemampuan struktur medis dan non-medis yang ada (misalnya, rumah aman, asosiasi perempuan, dll.) dalam menyediakan layanan untuk mencegah dan merespons kekerasan berbasis seksual dan gender di lokasi Anda? berkaitan dengan unsur-unsur berikut:", type: InstrumentType.sub, sub: { createMany: { data: [ {topicId: 6, question: "Staf yang Berkualifikasi (misalnya, perawatan klinis untuk pemerkosaan, manajemen kasus KGB, dll.)", type: InstrumentType.dropdownideal }, {topicId: 6, question: "Fasilitas (misalnya, Klinik, ruang aman, hotline, dll.)", type: InstrumentType.dropdownideal }, {topicId: 6, question: "Persediaan/peralatan (misalnya, untuk perawatan klinis)", type: InstrumentType.dropdownideal } ]}} },
  { number: 37, topicId: 7, question: "Aktor manakah yang bertanggung jawab untuk memastikan penyediaan layanan HIV di wilayah yang dipilih? Harap cantumkan semua lembaga (misalnya, nama unit pemerintah, LSM internasional, masyarakat sipil, organisasi berbasis masyarakat, sektor swasta, dll.)", type: InstrumentType.text },
  { number: 38, topicId: 7, question: "Aktor manakah yang bertanggung jawab untuk memastikan penyediaan layanan IMS di wilayah yang dipilih? Harap cantumkan semua lembaga (misalnya, nama unit pemerintah, LSM internasional, masyarakat sipil, organisasi berbasis masyarakat, sektor swasta, dll.)", type: InstrumentType.text },
  { number: 39, topicId: 7, question: "Apakah ada sistem rujukan yang jelas dan terkini untuk layanan HIV/ARV yang dapat dimanfaatkan dalam keadaan darurat? Jika ya, harap sebutkan.", type: InstrumentType.dropdownya },
  { number: 40, topicId: 7, question: "Fasilitas kesehatan manakah yang dapat menyediakan layanan berikut untuk mencegah penularan dan mengurangi angka kesakitan dan kematian akibat HIV dan IMS lainnya di wilayah yang dipilih? (Pertimbangkan level terendah)", type: InstrumentType.sub, sub: {createMany: {data: [ {topicId: 7, question: "ARV", type: InstrumentType.checkbox}, {topicId: 7, question: "Penatalaksanaan sindrom IMS", type: InstrumentType.checkbox}, {topicId: 7, question: "Pencegahan penularan dari ibu ke anak (PMTCT)", type: InstrumentType.checkbox}, {topicId: 7, question: "Distribusi Kondom", type: InstrumentType.checkbox}, ]}} },
  { number: 41, topicId: 7, question: "Mengingat kondisi layanan kesehatan di lokasi Anda saat ini, apakah menurut Anda elemen PPAM berikut ini memadai dan tersedia jika terjadi keadaan darurat?", type: InstrumentType.sub, sub: {createMany: {data: [ {topicId: 7, question: "Transfusi darah yang aman dan rasional tersedia", type: InstrumentType.dropdownya}, {topicId: 7, question: "Kewaspadaan standar (Standard precautions) dipraktikkan secara konsisten", type: InstrumentType.dropdownya}, {topicId: 7, question: "Ketersediaan kondom pria berpelumas gratis dan/atau kondom wanita", type: InstrumentType.dropdownya}, {topicId: 7, question: "ARV untuk pengguna tetap", type: InstrumentType.dropdownya}, {topicId: 7, question: "ARV untuk perempuan yang terdaftar dalam program PMTCT", type: InstrumentType.dropdownya}, {topicId: 7, question: "PEP kepada penyintas kekerasan seksual sebagaimana mestinya dan untuk paparan di tempat kerja", type: InstrumentType.dropdownya}, {topicId: 7, question: "Pemberian profilaksis kotrimoksazol terhadap infeksi oportunistik bagi pasien yang diketahui mengidap HIV atau sudah terdiagnosis HIV", type: InstrumentType.dropdownya}, {topicId: 7, question: "Ketersediaan pengobatan sindrom IMS di fasilitas kesehatan", type: InstrumentType.dropdownya}, {topicId: 7, question: "Adanya materi KIE dan layanan konseling IMS/HIV (yang menekankan pada pilihan informasi, efektivitas, dan mendukung privasi dan kerahasiaan klien) dalam keadaan darurat", type: InstrumentType.dropdownya}, ]}} },
  { number: 42, topicId: 7, question: "Berdasarkan layanan di atas, bagaimana Anda menilai kemampuan sistem kesehatan yang ada dalam menyediakan Manajemen HIV dan IMS sebagaimana diuraikan dalam PPAM untuk kespro di lokasi Anda dengan memperhatikan unsur-unsur berikut:", type: InstrumentType.sub, sub: { createMany: { data: [ {topicId: 7, question: "Tenaga Medis yang Berkualitas", type: InstrumentType.dropdownideal}, {topicId: 7, question: "Fasilitas (misalnya, Klinik, hotline, dll.)", type: InstrumentType.dropdownideal}, {topicId: 7, question: "Persediaan/peralatan", type: InstrumentType.dropdownideal}, ]}} },
  { number: 43, topicId: 8, question: "Aktor manakah yang bertanggung jawab untuk memastikan penyediaan layanan Ibu dan Bayi Baru Lahir di wilayah yang dipilih? Harap cantumkan semua lembaga (misalnya, nama unit pemerintah, LSM internasional, masyarakat sipil, organisasi berbasis masyarakat, sektor swasta, dll.)", type: InstrumentType.text },
  { number: 44, topicId: 8, question: "Apakah ada sistem rujukan Pelayanan Obstetri dan Neonatal Darurat (Emergency Obstetric and Newborn Care - EmONC) terkini yang dapat dimanfaatkan selama keadaan darurat? Jika ya, harap jelaskan (misalnya, MoU dengan rumah sakit, ambulans yang tersedia, nomor telepon yang dibagikan, struktur rujukan kembali, dll.)", type: InstrumentType.text },
  { number: 45, topicId: 8, question: "Fasilitas kesehatan tingkat manakah yang dapat memberikan layanan berikut untuk mencegah kelebihan angka kesakitan dan kematian ibu dan bayi baru lahir di wilayah yang dipilih? (pertimbangkan level terendah)", type: InstrumentType.sub, sub: createSubCheck(8, 'Penolong persalinan yang terampil', 'Pelayanan Obsterti Neonatal Dasar (PONED) Darurat - BEmONC', 'Pelayanan Obstetri Neonatal Komprehensif (PONEK) Darurat - CEmONC', 'Perawatan pasca aborsi', 'Layanan ambulans/transportasi 24/7') },
  { number: 46, topicId: 8, question: "Mengingat kondisi layanan kesehatan di lokasi Anda saat ini, apakah menurut Anda elemen PPAM berikut ini memadai dan tersedia jika terjadi keadaan darurat?", type: InstrumentType.sub, sub: createSubYa(8, 'Di tingkat rumah sakit rujukan: Staf medis yang terampil dan perlengkapan untuk penyediaan pelayanan obstetri dan bayi baru lahir darurat yang komprehensif (CEmONC)', 'Di tingkat fasilitas kesehatan: Penolong persalinan yang terampil dan perlengkapan untuk kelahiran normal serta penyediaan pelayanan obstetri dan bayi baru lahir dasar (BEmONC)', 'Di tingkat komunitas: Pemberian informasi kepada masyarakat tentang ketersediaan persalinan yang aman dan layanan EmONC serta pentingnya mencari perawatan di fasilitas kesehatan.', 'Sistem rujukan 24 jam per hari, 7 hari per minggu untuk komplikasi obstetrik', 'Tersedianya pelayanan pasca aborsi di puskesmas dan rumah sakit', 'Ketersediaan pasokan dan komoditas untuk persalinan bersih (misalnya, perlengkapan persalinan bersih) dan perawatan bayi baru lahir di mana akses terhadap fasilitas kesehatan tidak memungkinkan atau tidak dapat diandalkan', 'Adanya materi KIE tentang prioritas layanan ibu dan bayi baru lahir bagi ibu hamil dan anak perempuan untuk setiap kelompok bahasa di wilayah yang paling berisiko') },
  { number: 47, topicId: 8, question: "Berdasarkan layanan di atas, bagaimana Anda menilai kemampuan sistem kesehatan yang ada dalam menyediakan layanan perawatan ibu dan bayi baru lahir sebagaimana diuraikan dalam PPAM kespro di lokasi Anda sehubungan dengan elemen-elemen berikut:", type: InstrumentType.sub, sub: createSubIdeal(8, 'Tenaga Medis yang Berkualifikasi (misal, Petugas Persalinan Terampil, BEmONC, CEmONC)', 'Fasilitas (misal, Klinik, Rumah Sakit, dll.)', 'Persediaan/peralatan') },
  { number: 48, topicId: 9, question: "Aktor manakah yang bertanggung jawab untuk memastikan layanan penyediaan dan melepas metode kontrasepsi jangka panjang dan jangka pendek di wilayah yang dipilih? Harap cantumkan semua lembaga (misalnya, nama unit pemerintah, LSM internasional, masyarakat sipil, organisasi berbasis masyarakat, sektor swasta, dll.)", type: InstrumentType.text },
  { number: 49, topicId: 9, question: "Apakah terdapat sistem rujukan terkini yang jelas mengenai akses terhadap metode kontrasepsi jangka pendek dan jangka panjang yang dapat dimanfaatkan dalam keadaan darurat? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 50, topicId: 9, question: "Fasilitas kesehatan tingkat manakah yang dapat menyediakan alat kontrasepsi berikut untuk mencegah kehamilan yang tidak diinginkan di wilayah yang dipilih? (pertimbangkan level terendah)", type: InstrumentType.sub, sub: createSubCheck(9, 'Kondom Pria dan/atau Kondom Wanita.', 'Pil Kontrasepsi Oral', 'Alat kontrasepsi dalam rahim (IUD)', 'Suntikan', 'Implan', 'Kontrasepsi Darurat (EC)') },
  { number: 51, topicId: 9, question: "Mengingat kondisi layanan kesehatan di lokasi Anda saat ini, apakah menurut Anda elemen PPAM berikut ini memadai dan tersedia jika terjadi keadaan darurat?", type: InstrumentType.sub, sub: createSubYa(9, 'Ketersediaan berbagai metode kontrasepsi jangka panjang dan jangka pendek (termasuk kondom pria dan wanita serta kontrasepsi darurat) di fasilitas layanan kesehatan primer untuk memenuhi permintaan', 'Adanya materi KIE mengenai pilihan kontrasepsi (yang menekankan pilihan berdasarkan informasi, efektivitas, dan mendukung privasi dan kerahasiaan klien, akses terhadap layanan)') },
  { number: 52, topicId: 9, question: "Berdasarkan layanan di atas, bagaimana Anda menilai kemampuan sistem kesehatan yang ada dalam menyediakan layanan kontrasepsi di lokasi Anda sehubungan dengan elemen-elemen berikut:", type: InstrumentType.sub, sub: createSubIdeal(9, 'Tenaga Medis yang Berkualitas', 'Fasilitas (misalnya, Klinik, apotek, hotline, dll.)', 'Persediaan/peralatan') },
  { number: 53, topicId: 10, question: "Aktor manakah yang bertanggung jawab untuk memastikan layanan kesehatan reproduksi remaja di wilayah yang dipilih? Harap cantumkan semua lembaga (misalnya, nama unit pemerintah, LSM internasional, masyarakat sipil, organisasi berbasis masyarakat, sektor swasta, dll.)", type: InstrumentType.text },
  { number: 54, topicId: 10, question: "Apakah terdapat sistem rujukan terkini yang jelas mengenai akses terhadap layanan kesehatan reproduksi remaja yang dapat dimanfaatkan dalam keadaan darurat? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 55, topicId: 10, question: "Fasilitas kesehatan tingkat manakah yang dapat menyediakan layanan kesehatan reproduksi remaja di wilayah yang dipilih? (pertimbangkan level terendah)", type: InstrumentType.sub, sub: createSubCheck(10, 'Konseling kesehatan reproduksi', 'Pemeriksaan kesehatan reproduksi', 'Alat kontrasepsi bagi remaja', 'Pemeriksaan dan pengobatan Infeksi Menular Seksual', 'Konseling psikologis') },
  { number: 56, topicId: 10, question: "Mengingat kondisi layanan kesehatan di lokasi Anda saat ini, apakah menurut Anda elemen PPAM berikut ini memadai dan tersedia jika terjadi keadaan darurat?", type: InstrumentType.sub, sub: createSubYa(10, 'Adanya materi KIE mengenai kesehatan reproduksi remaja', 'Adanya keterlibatan remaja dalam koordinasi sub klaster kesehatan reproduksi', 'Adanya pemetaan pelayanan bagi remaja ', 'Adanya Forum remaja atau kelompok remaja atau posyandu remaja', "Adanya Kader remaja (fasilitator remaja atau kader posyandu remaja atau pendidik sebaya)", 'Ketersediaan ruang ramah remaja', "Adanya keterlibatan remaja dalam dalam pemberian informasi dasar kesehatan reproduksi remaja", 'Adanya keterlibatan remaja dalam dalam distribusi logistik') },
  { number: 57, topicId: 10, question: "Berdasarkan layanan di atas, bagaimana Anda menilai kemampuan sistem kesehatan yang ada dalam menyediakan layanan kesehatan reperoduksi remaja di lokasi Anda sehubungan dengan elemen-elemen berikut:", type: InstrumentType.sub, sub: createSubIdeal(10, 'Tenaga Medis yang Berkualitas', 'Fasilitas (misalnya, Klinik, apotek, hotline, dll.)', 'Persediaan/peralatan') },
  { number: 58, topicId: 11, question: "Aktor manakah yang bertanggung jawab untuk memastikan layanan kesehatan balita di wilayah yang dipilih? Harap cantumkan semua lembaga (misalnya, nama unit pemerintah, LSM internasional, masyarakat sipil, organisasi berbasis masyarakat, sektor swasta, dll.)", type: InstrumentType.text },
  { number: 59, topicId: 11, question: "Apakah terdapat sistem rujukan terkini yang jelas mengenai akses terhadap layanan kesehatan balita yang dapat dimanfaatkan dalam keadaan darurat? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 60, topicId: 11, question: "Fasilitas kesehatan tingkat manakah yang dapat menyediakan layanan jesehatan balita di wilayah yang dipilih? (pertimbangkan level terendah)", type: InstrumentType.sub, sub: createSubCheck(11, 'Pelayanan Manajemen Terpadu Balita Sakit (MTBS) untuk Bayi/Balita sakit', 'Pemantauan tumbuh kembang', 'Kunjungan nifas/neonatus', 'Pelayanan imunisasi', 'Suplementasi tablet Zinc', 'Penanganan Gizi Bayi/Balita', 'Pengobatan ARV pada anak HIV', 'Dukungan psikososial anak', 'Fasilitas transportasi rujukan', 'Sarana sanitasi') },
  { number: 61, topicId: 11, question: "Mengingat kondisi layanan kesehatan di lokasi Anda saat ini, apakah menurut Anda elemen PPAM berikut ini memadai dan tersedia jika terjadi keadaan darurat?", type: InstrumentType.sub, sub: createSubYa(11, 'Ketersediaan program pencegahan dan penanganan kekerasan seksual khususnya bagi bayi/balita', 'Adanya materi KIE mengenai kesehatan balita', 'Ketersediaan pojok oralit', 'Ketersediaan ruang ramah anak di kamp pengungsi', 'Terselenggara PAUD di kamp pengungsi', 'Ketersediaan sekolah darurat untuk anak', 'Ketersediaan logistik keesehatan balita') },
  { number: 62, topicId: 11, question: "Berdasarkan layanan di atas, bagaimana Anda menilai kemampuan sistem kesehatan yang ada dalam menyediakan layanan kesehatan balita di lokasi Anda sehubungan dengan elemen-elemen berikut:", type: InstrumentType.sub, sub:  createSubIdeal(11, 'Tenaga Medis yang Berkualitas', 'Fasilitas (misalnya, Klinik, apotek, hotline, dll.)', 'Persediaan/peralatan')},
  { number: 63, topicId: 12, question: "Aktor manakah yang bertanggung jawab untuk memastikan layanan kesehatan lansia di wilayah yang dipilih? Harap cantumkan semua lembaga (misalnya, nama unit pemerintah, LSM internasional, masyarakat sipil, organisasi berbasis masyarakat, sektor swasta, dll.)", type: InstrumentType.text },
  { number: 64, topicId: 12, question: "Apakah terdapat sistem rujukan terkini yang jelas mengenai akses terhadap layanan kesehatan lansia yang dapat dimanfaatkan dalam keadaan darurat? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 65, topicId: 12, question: "Fasilitas kesehatan tingkat manakah yang dapat menyediakan layanan kesehatan bagi lansia di wilayah yang dipilih? (pertimbangkan level terendah)", type: InstrumentType.sub, sub: createSubCheck(12, 'Layanan kesehatan umum bagi lansia', 'Konseling kesehatan reproduksi', 'Pemeriksaan kesehatan reproduksi', 'Gizi lansia', 'Penanganan Penyakit Kronis', 'Konseling psikologis') },
  { number: 66, topicId: 12, question: "Mengingat kondisi layanan kesehatan di lokasi Anda saat ini, apakah menurut Anda elemen PPAM berikut ini memadai dan tersedia jika terjadi keadaan darurat?", type: InstrumentType.sub, sub: createSubYa(12, "Ketersediaan lembaga-lembaga/organisasi yang bergerak di bidang pemberdayaan perempuan dan lansia perempuan", "Adanya materi KIE mengenai kesehatan lansia", "Ketersediaan mekanisme rujukan, perlindungan bagi lansia, tindakan hukum ", "Ketersediaan kelanjutan pengobatan bagi lansia yang telah masuk program ARV, termasuk perempuan yang terdaftar dalam program PPIA (Pencegahan Penularan HIV dari Lansia laki-laki ke istri dan perempuan lainnya)", 'Ketersediaan logistik kesehatan lansia', 'Ketersediaan penanganan kesehatan lingkungan', 'Ketersediaan WASH (water, sanitation and hygiene atau air, sanitasi dan kebersihan)') },
  { number: 67, topicId: 12, question: "Berdasarkan layanan di atas, bagaimana Anda menilai kemampuan sistem kesehatan yang ada dalam menyediakan layanan kesehatan lansia di lokasi Anda sehubungan dengan elemen-elemen berikut:", type: InstrumentType.sub, sub: createSubIdeal(12, 'Tenaga Medis yang Berkualitas', 'Fasilitas (misalnya, Klinik, apotek, hotline, dll.)', 'Persediaan/peralatan') },
  { number: 68, topicId: 13, question: "Apakah ada situasi dalam konteks Anda di mana layanan aborsi yang aman dapat diberikan? Jika ya, sebutkan ketentuan yang tercantum dalam undang-undang dan kebijakan nasional. Jika tidak, harap sertakan bahasa hukum dalam kebijakan/dokumen hukum (Anda dapat melewati pertanyaan 54-58)", type: InstrumentType.dropdownya },
  { number: 69, topicId: 13, question: "Aktor manakah yang bertanggung jawab untuk memastikan penyediaan layanan aborsi yang aman di wilayah yang dipilih? Harap cantumkan semua lembaga (misalnya, nama unit pemerintah, LSM internasional, masyarakat sipil, organisasi berbasis masyarakat, sektor swasta, dll.)", type: InstrumentType.text },
  { number: 70, topicId: 13, question: "Apakah ada sistem rujukan yang jelas yang dapat dimanfaatkan dalam keadaan darurat? Jika ya, harap sebutkan", type: InstrumentType.dropdownya },
  { number: 71, topicId: 13, question: "Apakah ada materi KIE yang menguraikan jenis-jenis layanan yang tersedia yang dapat dimanfaatkan dalam keadaan darurat, dan di mana tersedianya?", type: InstrumentType.dropdownya },
  { number: 72, topicId: 13, question: "Fasilitas kesehatan tingkat manakah yang dapat menyediakan layanan aborsi berikut di wilayah yang dipilih? (Pertimbangkan level terendah)", type: InstrumentType.sub, sub: createSubCheck(13, 'Aborsi obat', 'Aspirasi vakum, dilatasi dan evakuasi', 'Prosedur induksi sesuai anjuran WHO') },
  { number: 73, topicId: 13, question: "Berdasarkan layanan di atas, bagaimana Anda menilai struktur dan layanan medis yang menyediakan layanan aborsi aman di lokasi Anda sehubungan dengan elemen berikut:",  type: InstrumentType.sub, sub: createSubIdeal(13, 'Tenaga Medis yang Berkualitas (misalnya, terlatih dalam prosedur medis, klarifikasi nilai-nilai aborsi dan transformasi sikap)', 'Fasilitas (misalnya, Klinik, hotline, dll.)', 'Persediaan/peralatan')},
]
