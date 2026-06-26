/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require('better-sqlite3');
const db = new Database('./dev.db');

const categories = [
  { id: 'c1', name: 'Construction & Builders', slug: 'construction-builders', icon: 'hammer' },
  { id: 'c2', name: 'Plumbers', slug: 'plumbers', icon: 'wrench' },
  { id: 'c3', name: 'Electricians', slug: 'electricians', icon: 'zap' },
  { id: 'c4', name: 'Cleaning & Housekeeping', slug: 'cleaning-housekeeping', icon: 'sparkles' },
  { id: 'c5', name: 'Deliveries & Moving', slug: 'deliveries-moving', icon: 'truck' },
  { id: 'c6', name: 'Handyman & Repairs', slug: 'handyman-repairs', icon: 'tool' },
  { id: 'c7', name: 'Transport & Rentals', slug: 'transport-rentals', icon: 'car' },
  { id: 'c8', name: 'Legal & Visa Services', slug: 'legal-visa-services', icon: 'briefcase' },
  { id: 'c9', name: 'Tech & IT Support', slug: 'tech-it-support', icon: 'monitor' },
  { id: 'c10', name: 'Gardening & Pool Care', slug: 'gardening-pool-care', icon: 'leaf' }
];

const insert = db.prepare('INSERT OR REPLACE INTO Category (id, name, slug, icon) VALUES (?, ?, ?, ?)');
const deleteOld = db.prepare('DELETE FROM Category WHERE slug IN (?, ?, ?, ?, ?)');

db.transaction(() => {
  deleteOld.run('stays', 'dining', 'activities', 'experiences', 'restaurants');
  for (const cat of categories) {
    insert.run(cat.id, cat.name, cat.slug, cat.icon);
  }
})();

console.log('Seeding complete.');
