-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editToken" TEXT NOT NULL,
    "previewToken" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "reminders" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_editToken_key" ON "Event"("editToken");

-- CreateIndex
CREATE UNIQUE INDEX "Event_previewToken_key" ON "Event"("previewToken");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
