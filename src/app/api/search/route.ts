import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const island = searchParams.get('island');
  
  if (!q || q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    const whereClause: any = {
      OR: [
        { name: { contains: q } },
        { slug: { contains: q } }
      ]
    };

    if (island) {
      if (island === 'samui') {
        whereClause.island = {
          slug: { notIn: ['phangan', 'tao'] }
        };
      } else {
        whereClause.island = {
          slug: island
        };
      }
    }

    const results = await prisma.listing.findMany({
      where: whereClause,
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        category: {
          select: {
            name: true,
            icon: true
          }
        },
        island: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        averageRating: 'desc'
      }
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
