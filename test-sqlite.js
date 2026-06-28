const Database = require('better-sqlite3');
const db = new Database('dev.db');

const row = db.prepare('SELECT id, slug, length(description) as descLen, (SELECT count(*) FROM Review WHERE listingId = Listing.id) as reviewCount FROM Listing WHERE slug = ?').get('cmqtdcyps0000psp7czaphbsh');

console.log(row);
