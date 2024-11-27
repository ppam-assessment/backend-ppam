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
  // Pisahkan topik 1-4 dan topik lainnya
  const topics14 = instrumentCounts.filter(({ topicId }) => topicId >= 1 && topicId <= 4);
  const otherTopics = instrumentCounts.filter(({ topicId }) => topicId > 4);

  // Hitung total skor maksimum untuk topik 1-4
  const maxScore14 = topics14.reduce((total, { _count }) => total + _count._all * 3, 0);

  // Kelompokkan skor per provinsi untuk topik 1-4
  const provinceMap14: { [key: string]: number } = {};

  provinceScores
      .filter(score => topics14.some(topic => topic.topicId === score.instrument.topic.id))
      .forEach(({ responder, value }) => {
          if (responder?.metadata?.province) {
              const { name } = responder.metadata.province;
              const score = getScore(value);
              if (!provinceMap14[name]) {
                  provinceMap14[name] = 0;
              }
              provinceMap14[name] += score; // Akumulasi skor
          }
      });

  // Format data untuk topik 1-4
  const result14 = {
      asesmen: "Kesiapan Keseluruhan Tingkat Nasional: Kebijakan, Koordinasi dan Sumber Daya",
      provinsi: Object.entries(provinceMap14).map(([name, score]) => ({
          nama: name,
          skor: Math.round((score / maxScore14) * 100), // Persentase
      })),
  };

  // Proses topik lainnya secara individual
  const otherResults = otherTopics.map(({ topicId, _count }) => {
      // Data terkait topik tertentu
      const topicScores = provinceScores.filter(
          score => score.instrument.topic.id === topicId
      );

      // Skor maksimum untuk topik tertentu
      const maxScore = _count._all * 3;

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

      // Format data untuk topik tertentu
      return {
          asesmen: topicScores[0]?.instrument.topic.topic || "Unknown Topic",
          provinsi: Object.entries(provinceMap).map(([name, score]) => ({
              nama: name,
              skor: Math.round((score / maxScore) * 100), // Persentase
          })),
      };
  });

  // Gabungkan hasil untuk topik 1-4 dan topik lainnya
  return [result14, ...otherResults];
};

export default mapProvinceScores