import prisma from "../client.js"

// Data kota (lengkap dengan ID)
const cities = [
    // Provinsi Aceh
    { name: "Banda Aceh", provinceId: 1 },
    { name: "Sabang", provinceId: 1 },
    { name: "Aceh Besar", provinceId: 1 },
    { name: "Aceh Jaya", provinceId: 1 },
    { name: "Aceh Tengah", provinceId: 1 },
    { name: "Aceh Tamiang", provinceId: 1 },
    { name: "Bener Meriah", provinceId: 1 },
    { name: "Gayo Lues", provinceId: 1 },
    { name: "Langsa", provinceId: 1 },
    { name: "Lhokseumawe", provinceId: 1 },
    { name: "Nagan Raya", provinceId: 1 },
    { name: "Pidie", provinceId: 1 },
    { name: "Pidi", provinceId: 1 },
    { name: "Simeulue", provinceId: 1 },
    { name: "Subulussalam", provinceId: 1 },
    { name: "Aceh Selatan", provinceId: 1 },
    { name: "Aceh Singkil", provinceId: 1 },
    { name: "Bireuen", provinceId: 1 },
    { name: "Gayo Lues", provinceId: 1 },
  
    // Provinsi Jawa Tengah
    { name: "Semarang", provinceId: 21 },
    { name: "Surakarta (Solo)", provinceId: 21 },
    { name: "Sragen", provinceId: 21 },
    { name: "Karanganyar", provinceId: 21 },
    { name: "Sukoharjo", provinceId: 21 },
    { name: "Klaten", provinceId: 21 },
    { name: "Salatiga", provinceId: 21 },
    { name: "Magelang", provinceId: 21 },
    { name: "Temanggung", provinceId: 21 },
    { name: "Pekalongan", provinceId: 21 },
    { name: "Batang", provinceId: 21 },
    { name: "Cilacap", provinceId: 21 },
    { name: "Purbalingga", provinceId: 21 },
    { name: "Banyumas", provinceId: 21 },
    { name: "Kebumen", provinceId: 21 },
    { name: "Purworejo", provinceId: 21 },
    { name: "Wonosobo", provinceId: 21 },
    { name: "Brebes", provinceId: 21 },
    { name: "Tegal", provinceId: 21 },
    { name: "Slawi", provinceId: 21 },
    { name: "Demak", provinceId: 21 },
    { name: "Jepara", provinceId: 21 },
    { name: "Rembang", provinceId: 21 },
    { name: "Blora", provinceId: 21 },
    { name: "Grobogan", provinceId: 21 },
    { name: "Boyolali", provinceId: 21 }
  ];
  
  // Contoh penambahan provinceId disesuaikan dengan id yang sesuai
  
async function seed() {
  await prisma.cities.createMany({
    data: cities,
  });
}

seed()
  .then(() => console.log('Seed data selesai'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });