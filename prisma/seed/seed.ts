import prisma from "../client.js"
import topics from "./data/topic.js"
import users from "./data/users.js"
import instruments from "./data/instrument.js"
import areas from "./data/areas.js"
import citiesData from "./data/citiesData.js"
import submitterAccessData from "./data/submitterAccess.js"

async function main() {

  await prisma.users.createMany({
    data: users
  })

  // await prisma.topics.createMany({
  //   data: topics
  // })

  // for (const instrument of instruments) {
  //   await prisma.instrument.create({
  //     data: instrument,
  //   })
  // }

  await prisma.cities.createMany({
    data: citiesData
  })

  await prisma.submitterAccess.createMany({
    data: submitterAccessData
  })

  // await prisma.provinces.createMany({
  //   data: areas
  // })

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