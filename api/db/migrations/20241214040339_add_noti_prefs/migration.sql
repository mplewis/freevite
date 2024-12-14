-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "notiResponseCreated" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notiResponseDeleted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notiResponseUpdated" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "notiEventDeleted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notiEventUpdated" BOOLEAN NOT NULL DEFAULT true;
