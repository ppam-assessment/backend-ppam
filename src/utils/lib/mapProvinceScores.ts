import { choiceYa, choiceIdeal } from "../ChoiceOpt.js";

// Definisi tipe data
interface Response {
  instrument: {
    topic: {
      topic: string;
      part: number;
    };
  };
  responder: {
    metadata: {
      province: {
        id: number;
        name: string;
      } | null; // Province bisa null
    } | null; // Metadata juga bisa null
  };
  value: string;
  instrumentId: number;
}

type InstrumentCount = {
  topicId: number; // ID dari topik
  _count: {
    _all: number; // Jumlah total instrumen
  };
};

type ProvinceScore = {
  id: number; // ID provinsi
  province: string; // Nama provinsi
  score: number; // Skor dalam persentase
};

type AssessmentResult = {
  assessment: string; // Nama topik dan bagian
  province: ProvinceScore[]; // Data skor provinsi
};

// Fungsi utama
export const mapProvinceScores = (
  responses: Response[],
  instrumentsCount: InstrumentCount[]
): AssessmentResult[] => {
  const getScore = (value: string): number => {
    const ya = choiceYa.find((choice) => choice.value === value);
    const ideal = choiceIdeal.find((choice) => choice.value === value);
    return ya?.code || ideal?.code || 0;
  };

  // Mengelompokkan respons berdasarkan topic-part dan provinsi
  const grouped = responses.reduce<{
    [topicPart: string]: {
      instruments: Set<number>;
      provinces: { [provinceName: string]: { id: number; totalScore: number } };
    };
  }>((acc, response) => {
    const { instrument, responder, value } = response;
    const topicPart = `${instrument.topic.topic} ${instrument.topic.part}`;
    
    // Pastikan `responder` dan `metadata` tidak null sebelum mengakses `province`
    const province = responder?.metadata?.province;
    if (!province) return acc; // Jika province atau metadata null, lanjutkan iterasi
  
    const provinceName = province.name;
  
    if (!acc[topicPart]) {
      acc[topicPart] = { instruments: new Set(), provinces: {} };
    }
  
    acc[topicPart].instruments.add(response.instrumentId);
  
    if (!acc[topicPart].provinces[provinceName]) {
      acc[topicPart].provinces[provinceName] = {
        id: province.id,
        totalScore: 0,
      };
    }
  
    acc[topicPart].provinces[provinceName].totalScore += getScore(value);
  
    return acc;
  }, {});
  
  // Membuat hasil akhir dengan persentase skor
  const result: AssessmentResult[] = Object.entries(grouped).map(
    ([topicPart, { instruments, provinces }]) => {
      const topicId = parseInt(topicPart.split(" ")[1]); // Ambil ID topik dari nama
      const instrument = instrumentsCount.find((item) => item.topicId === topicId);
      const maxScore = instrument ? instrument._count._all * 3 : 0;
      
      const provinceData: ProvinceScore[] = Object.entries(provinces).map(
        ([provinceName, province]) => ({
          id: province.id,
          province: provinceName,
          score: maxScore > 0 ? (province.totalScore / maxScore) * 100 : 0,
        })
      );

      return {
        assessment: topicPart,
        province: provinceData,
      };
    }
  );

  return result;
};
