-- CreateEnum
CREATE TYPE "ResponseConfig" AS ENUM ('SHOW_ALL', 'SHOW_COUNTS_ONLY', 'SHOW_NONE', 'DISABLED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "responseConfig" "ResponseConfig" NOT NULL DEFAULT 'DISABLED';

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "editToken" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "headCount" INTEGER NOT NULL DEFAULT 1,
    "comment" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseId" INTEGER NOT NULL,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Response_editToken_key" ON "Response"("editToken");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
