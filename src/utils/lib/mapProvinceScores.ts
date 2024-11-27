// Definisi pilihan
import { Prisma } from "@prisma/client";
import { choiceYa, choiceIdeal } from "../ChoiceOpt.js";
// Helper untuk mendapatkan skor berdasarkan value
const getScore = (value: string): number => {
  const choice = [...choiceYa, ...choiceIdeal].find(choice => choice.value === value);
  return choice ? choice.code : 0;
};

const mapProvinceScores = (
  provinceScores: {
      value: string;
      responder: {
          metadata: {
              province: {
                  id: number;
                  name: string;
              } | null;
          } | null;
      };
      instrumentId: number;
      instrument: {
          topic: {
              id: number;
              topic: string;
          };
      };
  }[],
  instrumentCounts: (Prisma.PickEnumerable<Prisma.InstrumentGroupByOutputType, "topicId"[]> & {
      _count: {
          _all: number;
      };
  })[]
) => {
  return instrumentCounts.map(({ topicId, _count }) => {
      // Ambil data terkait topik dari provinceScores
      const topicScores = provinceScores.filter(
          score => score.instrument.topic.id === topicId
      );

      // Total skor maksimum untuk topik
      const maxScore = _count._all * 3; // Jumlah instrumen dikali skor maksimal (3)

      // Kelompokkan skor per provinsi
      const provinceMap: { [key: string]: number } = {};

      topicScores.forEach(({ responder, value }) => {
          if (responder?.metadata?.province) {
              const { name } = responder.metadata.province;
              const score = getScore(value);
              if (!provinceMap[name]) {
                  provinceMap[name] = 0;
              }
              provinceMap[name] += score; // Akumulasi skor
          }
      });

      // Hitung skor sebagai persentase dan format data provinsi
      const provinsi = Object.entries(provinceMap).map(([name, score]) => ({
          nama: name,
          skor: Math.round((score / maxScore) * 100), // Persentase
      }));

      return {
          asesmen: topicScores[0]?.instrument.topic.topic || 'Unknown Topic', // Nama topik
          provinsi,
      };
  });
};

export default mapProvinceScores