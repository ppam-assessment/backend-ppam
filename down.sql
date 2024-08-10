-- AlterTable
ALTER TABLE "Choices" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Instrument" ALTER COLUMN "number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Responses" ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL;

