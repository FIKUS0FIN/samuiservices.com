import { prisma } from './auth';

export async function getBusinessesByIsland(
  islandSlug: string, 
  categorySlugs?: string[], 
  query?: string, 
  currentUserId?: string,
  page: number = 1,
  limit: number = 50,
  subdistricts?: string[],
  sortBy?: string
) {
  const whereClause: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  
  if (islandSlug !== 'all') {
    if (islandSlug === 'samui') {
      whereClause.island = { slug: { notIn: ['phangan', 'tao'] } };
    } else {
      whereClause.island = { slug: islandSlug };
    }
  }

  if (subdistricts && subdistricts.length > 0) {
    whereClause.subdistrict = { in: subdistricts };
  }
  
  if (categorySlugs && categorySlugs.length > 0) {
    const categoriesToFilter = await prisma.category.findMany({
      where: { slug: { in: categorySlugs } },
      include: { children: true }
    });
    
    const allSlugs = new Set<string>();
    for (const cat of categoriesToFilter) {
      allSlugs.add(cat.slug);
      for (const child of cat.children) {
        allSlugs.add(child.slug);
      }
    }
    
    whereClause.category = { slug: { in: Array.from(allSlugs) } };
  }

  if (query) {
    whereClause.OR = [
      { name: { contains: query } },
      { slug: { contains: query } }
    ];
  }

  const skip = (page - 1) * limit;

  let orderByClause: any[] = [];
  if (sortBy === 'newest') {
    orderByClause = [
      { updatedAt: 'desc' },
      { createdAt: 'desc' }
    ];
  } else if (sortBy === 'highest-rated') {
    orderByClause = [
      { averageRating: 'desc' },
      { reviewCount: 'desc' }
    ];
  } else {
    // Recommended: highest rating + Fresh updated + number of reviews (keep premium on top)
    orderByClause = [
      { isPremium: 'desc' },
      { averageRating: 'desc' },
      { updatedAt: 'desc' },
      { reviewCount: 'desc' }
    ];
  }

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where: whereClause,
      include: {
        category: true,
        island: true,
        favorites: currentUserId ? {
          where: { userId: currentUserId }
        } : false
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
    prisma.listing.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    listings: listings.map(listing => ({
      ...listing,
      isFavorited: listing.favorites && listing.favorites.length > 0
    })),
    totalPages,
    totalCount
  };
}

export async function getCategoryCounts(islandSlug: string): Promise<Record<string, number>> {
  const whereClause: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  
  if (islandSlug !== 'all') {
    if (islandSlug === 'samui') {
      whereClause.island = { slug: { notIn: ['phangan', 'tao'] } };
    } else {
      whereClause.island = { slug: islandSlug };
    }
  }

  const counts = await prisma.listing.groupBy({
    by: ['categoryId'],
    where: whereClause,
    _count: {
      id: true
    }
  });

  const countMap: Record<string, number> = {};
  for (const item of counts) {
    if (item.categoryId) {
      countMap[item.categoryId] = item._count.id;
    }
  }
  return countMap;
}

export async function getAllIslands() {
  return prisma.island.findMany();
}

export async function getAllCategories() {
  return prisma.category.findMany({
    include: {
      children: true
    }
  });
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
              id: true,
              name: true,
              image: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      questions: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          },
          answers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  role: true,
                }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export async function getSubdistrictsWithCounts(islandSlug: string): Promise<Record<string, number>> {
  const whereClause: any = {};
  if (islandSlug !== 'all') {
    if (islandSlug === 'samui') {
      whereClause.island = { slug: { notIn: ['phangan', 'tao'] } };
    } else {
      whereClause.island = { slug: islandSlug };
    }
  }
  whereClause.subdistrict = { not: null };

  const counts = await prisma.listing.groupBy({
    by: ['subdistrict'],
    where: whereClause,
    _count: {
      id: true
    }
  });

  const countMap: Record<string, number> = {};
  for (const item of counts) {
    if (item.subdistrict) {
      countMap[item.subdistrict] = item._count.id;
    }
  }
  return countMap;
}

export async function getTopListingsByCategory(
  parentCategoryId: string,
  childCategoryIds: string[],
  subdistricts?: string[],
  limit: number = 4
) {
  const whereClause: any = {
    categoryId: { in: [parentCategoryId, ...childCategoryIds] },
    island: { slug: { notIn: ['phangan', 'tao'] } } // Only Koh Samui
  };

  if (subdistricts && subdistricts.length > 0) {
    whereClause.subdistrict = { in: subdistricts };
  }

  return prisma.listing.findMany({
    where: whereClause,
    include: {
      category: true,
      island: true,
    },
    orderBy: [
      { averageRating: 'desc' },
      { reviewCount: 'desc' }
    ],
    take: limit,
  });
}
