/*
  Warnings:

  - You are about to drop the column `reminders` on the `Event` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editToken" TEXT NOT NULL,
    "previewToken" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("confirmed", "createdAt", "description", "editToken", "end", "id", "ownerEmail", "previewToken", "slug", "start", "title", "updatedAt", "visible") SELECT "confirmed", "createdAt", "description", "editToken", "end", "id", "ownerEmail", "previewToken", "slug", "start", "title", "updatedAt", "visible" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_editToken_key" ON "Event"("editToken");
CREATE UNIQUE INDEX "Event_previewToken_key" ON "Event"("previewToken");
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
