-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "inputPrompt" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "messages" TEXT NOT NULL DEFAULT '[]',
    "type" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Content" ("createdAt", "id", "inputPrompt", "isFavorite", "language", "result", "type", "updatedAt", "userId") SELECT "createdAt", "id", "inputPrompt", "isFavorite", "language", "result", "type", "updatedAt", "userId" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE INDEX "Content_userId_idx" ON "Content"("userId");
CREATE INDEX "Content_type_idx" ON "Content"("type");
CREATE INDEX "Content_isFavorite_idx" ON "Content"("isFavorite");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
