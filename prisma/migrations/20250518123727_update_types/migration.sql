-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TravelPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destination" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "peopleType" TEXT NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);
INSERT INTO "new_TravelPlan" ("adults", "budget", "children", "createdAt", "destination", "endDate", "expiresAt", "id", "peopleType", "startDate") SELECT "adults", "budget", "children", "createdAt", "destination", "endDate", "expiresAt", "id", "peopleType", "startDate" FROM "TravelPlan";
DROP TABLE "TravelPlan";
ALTER TABLE "new_TravelPlan" RENAME TO "TravelPlan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
