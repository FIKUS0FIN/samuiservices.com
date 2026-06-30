import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Approximate central coordinates for Koh Samui districts
const DISTRICTS = {
  'bo put': { lat: 9.535, lng: 100.035 }, // Chaweng/Bophut area
  'bophut': { lat: 9.535, lng: 100.035 }, // Chaweng/Bophut area
  'chaweng': { lat: 9.535, lng: 100.035 }, // Chaweng/Bophut area
  'maret': { lat: 9.470, lng: 100.045 },  // Lamai area
  'lamai': { lat: 9.470, lng: 100.045 },  // Lamai area
  'mae nam': { lat: 9.570, lng: 99.990 }, // Maenam area
  'maenam': { lat: 9.570, lng: 99.990 }, // Maenam area
  'lipa noi': { lat: 9.500, lng: 99.930 },// West coast
  'taling ngam': { lat: 9.440, lng: 99.950 }, // Southwest
  'na mueang': { lat: 9.460, lng: 99.990 }, // South center
  'ang thong': { lat: 9.530, lng: 99.930 }, // Nathon
  'nathon': { lat: 9.530, lng: 99.930 }, // Nathon
};

// Fallback center of Samui
const DEFAULT_CENTER = { lat: 9.5120, lng: 100.0136 };

function getRandomOffset() {
  // Return random offset between -0.015 and 0.015 degrees (roughly 1.5km)
  return (Math.random() - 0.5) * 0.03;
}

async function main() {
  const listings = await prisma.listing.findMany();
  console.log(`Found ${listings.length} listings to process.`);
  
  let updatedCount = 0;

  for (const listing of listings) {
    if (listing.lat && listing.lng) continue; // Skip if already has coordinates
    
    let baseLat = DEFAULT_CENTER.lat;
    let baseLng = DEFAULT_CENTER.lng;
    
    if (listing.address) {
      const addr = listing.address.toLowerCase();
      
      for (const [district, coords] of Object.entries(DISTRICTS)) {
        if (addr.includes(district)) {
          baseLat = coords.lat;
          baseLng = coords.lng;
          break;
        }
      }
    }
    
    // Add some random scatter so markers don't overlap completely
    const finalLat = baseLat + getRandomOffset();
    const finalLng = baseLng + getRandomOffset();
    
    await prisma.listing.update({
      where: { id: listing.id },
      data: {
        lat: finalLat,
        lng: finalLng
      }
    });
    
    updatedCount++;
  }
  
  console.log(`Successfully updated coordinates for ${updatedCount} listings.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
