-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompanyValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'VALUE',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_CompanyValue" ("description", "id", "order", "title") SELECT "description", "id", "order", "title" FROM "CompanyValue";
DROP TABLE "CompanyValue";
ALTER TABLE "new_CompanyValue" RENAME TO "CompanyValue";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
