/*
  Warnings:

  - You are about to drop the `Session_tokens` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `number` to the `Instrument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session_tokens" DROP CONSTRAINT "Session_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "Instrument" ADD COLUMN     "mainId" INTEGER,
ADD COLUMN     "number" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Session_tokens";

-- CreateTable
CREATE TABLE "Sessions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_mainId_fkey" FOREIGN KEY ("mainId") REFERENCES "Instrument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
