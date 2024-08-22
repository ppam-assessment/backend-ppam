import prisma from "../../config/prisma.js"
import topics from "./data/topic.js"
import instruments from "./data/instrument.js"

async function main() {

  // await prisma.topics.createMany({
  //   data: topics
  // })

  for (const instrument of instruments) {
    await prisma.instrument.create({
      include: {
        choice: true
      },
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