import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const claims = await prisma.claimRequest.findMany({
      orderBy: { createdAt: 'desc' },
      // We manually fetch user and listing since listing is not relation in prisma
    });

    // Enhance claims with user and listing data
    const enhancedClaims = await Promise.all(claims.map(async (claim) => {
      const claimUser = await prisma.user.findUnique({ where: { id: claim.userId } });
      const listing = await prisma.listing.findUnique({ where: { id: claim.listingId } });
      
      return {
        ...claim,
        user: claimUser,
        listing: listing,
      };
    }));

    return NextResponse.json(enhancedClaims);
  } catch (e) {
    console.error('Error fetching claims', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
