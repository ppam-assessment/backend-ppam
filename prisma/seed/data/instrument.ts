import { Instrument, InstrumentType } from "@prisma/client";

function createChoice(...values: string[]) {
    const data = values.map(value => ({ value }));
    return {
        createMany: {
          data,
        },
    };
  }
  
export default [
    { number: 1, topicId: 1, question: "Apakah negara Anda mempunyai Kebijakan dan/atau Program Kesiapsiagaan dan/atau Tanggap Darurat Nasional? Jika ya, silakan tentukan dan sebutkan di kotak komentar jenis keadaan darurat yang dicakupnya (misalnya bencana alam, konflik, keadaan darurat kesehatan masyarakat, dll.)", type: InstrumentType.select,  choice: createChoice('Ya', 'Tidak', 'Tidak Tahu')},
    { number: 2, topicId: 1, question: "Apakah negara Anda mempunyai Program Kesiapsiagaan Kesehatan Nasional dan/atau Tanggap Darurat? Jika ya, harap sebutkan", type: InstrumentType.select,  choice: createChoice('Ya', 'Tidak', 'Tidak Tahu')},
    { number: 3, topicId: 1, question: "Apakah program ini dilaksanakan di tingkat daerah? Jika ya, harap sebutkan", type: InstrumentType.select, choice: createChoice('Ya', 'Tidak', 'Tidak Tahu')},
    { number: 4, topicId: 1, question: "Apakah kespro dan/atau PPAM diintegrasikan ke dalam kebijakan dan/atau program tanggap darurat kesehatan nasional atau sub-nasional? Jika ya, sebutkan seluruh komponen PPAM yang terintegrasi, wilayah dan tahunnya, serta kebijakan/programnya.", type: InstrumentType.select,  choice: createChoice('Ya', 'Tidak', 'Tidak Tahu')},
    { number: 5, topicId: 1, question: "Apakah ada kebijakan atau program terkait kespro yang mencakup ketentuan manajemen bencana dan/atau tanggap darurat? Jika ya, harap sebutkan", type: InstrumentType.select,  choice: createChoice('Ya', 'Tidak', 'Tidak Tahu')},
    { number: 6, topicId: 1, question: "Sepengetahuan Anda, apakah ada undang-undang dan/atau kebijakan nasional yang membatasi akses layanan kesehatan reproduksi bagi kelompok tertentu (misalnya migran, migran tidak berdokumen, pengungsi, remaj, orang dengan orientasi seksual, identitas gender, ekspresi gender, dan karakteristik seksual yang beragam (SOGIESC), Orang dengan HIV, pekerja seks, dll)? Jika ya, sebutkan populasinya", type: InstrumentType.select,  choice: createChoice('Ya', 'Tidak', 'Tidak Tahu')},
    { number: 7, topicId: 1, question: "Sepengetahuan Anda, apakah kespro disertakan dalam rencana pemulihan ketika respons beralih dari layanan darurat ke layanan yang lebih komprehensif?", type: InstrumentType.select,  choice: createChoice('Ya', 'Tidak', 'Tidak Tahu')},
]
