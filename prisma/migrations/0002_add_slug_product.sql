PRAGMA foreign_keys=OFF;

CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "image" TEXT,
    "listingId" TEXT NOT NULL,
    CONSTRAINT "Product_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "new_Listing" (
    "slug" TEXT NOT NULL DEFAULT '',
    "layout" TEXT NOT NULL DEFAULT 'standard',
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "lat" REAL,
    "lng" REAL,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isClaimed" BOOLEAN NOT NULL DEFAULT true,
    "googlePlaceId" TEXT,
    "website" TEXT,
    "hours" TEXT,
    "categoryId" TEXT NOT NULL,
    "islandId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Listing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_islandId_fkey" FOREIGN KEY ("islandId") REFERENCES "Island" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Listing" ("id", "name", "description", "image", "phone", "address", "lat", "lng", "averageRating", "reviewCount", "isPremium", "isClaimed", "googlePlaceId", "website", "hours", "categoryId", "islandId", "userId", "createdAt", "updatedAt") 
SELECT "id", "name", "description", "image", "phone", "address", "lat", "lng", "averageRating", "reviewCount", "isPremium", "isClaimed", "googlePlaceId", "website", "hours", "categoryId", "islandId", "userId", "createdAt", "updatedAt" FROM "Listing";

UPDATE "new_Listing" SET "slug" = "id" WHERE "slug" = '';

DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";

CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");
CREATE UNIQUE INDEX "Listing_googlePlaceId_key" ON "Listing"("googlePlaceId");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
