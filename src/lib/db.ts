import { prisma } from './auth';

export async function getBusinessesByIsland(islandSlug: string, categorySlugs?: string[], query?: string, currentUserId?: string) {
  const whereClause: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  
  if (islandSlug !== 'all') {
    whereClause.island = { slug: islandSlug };
  }
  
  if (categorySlugs && categorySlugs.length > 0) {
    whereClause.category = { slug: { in: categorySlugs } };
  }

  if (query) {
    whereClause.name = { contains: query };
  }

  const listings = await prisma.listing.findMany({
    where: whereClause,
    include: {
      category: true,
      island: true,
      favorites: currentUserId ? {
        where: { userId: currentUserId }
      } : false
    },
    orderBy: [
      { isPremium: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  return listings.map(listing => ({
    ...listing,
    isFavorited: listing.favorites && listing.favorites.length > 0
  }));
}

export async function getAllIslands() {
  return prisma.island.findMany();
}

export async function getAllCategories() {
  return prisma.category.findMany();
}

export async function getBusinessById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      category: true,
      island: true,
      user: {
        select: {
          name: true,
          image: true,
          createdAt: true
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export async function getBusinessBySlug(slug: string) {
  return prisma.listing.findUnique({
    where: { slug },
    include: {
      category: true,
      island: true,
      products: true,
      user: {
        select: {
          name: true,
          image: true,
          createdAt: true
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}
