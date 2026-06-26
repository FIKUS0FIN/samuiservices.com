'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function approveClaim(claimId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== 'ADMIN') {
    throw new Error('Not authorized');
  }

  // ClaimRequest doesn't have a direct Prisma relation to Listing in the schema
  // so we need to just find it
  const claim = await prisma.claimRequest.findUnique({
    where: { id: claimId }
  });

  if (!claim) {
    throw new Error('Claim not found');
  }

  // Update claim status to APPROVED
  await prisma.claimRequest.update({
    where: { id: claimId },
    data: { status: 'APPROVED' }
  });

  // Assign the listing to the user who requested the claim and mark it as claimed
  await prisma.listing.update({
    where: { id: claim.listingId },
    data: { 
      userId: claim.userId,
      isClaimed: true 
    }
  });

  revalidatePath('/admin/claims');
  revalidatePath('/admin/listings');
  revalidatePath('/dashboard');
}

export async function rejectClaim(claimId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== 'ADMIN') {
    throw new Error('Not authorized');
  }

  // Update claim status to REJECTED
  await prisma.claimRequest.update({
    where: { id: claimId },
    data: { status: 'REJECTED' }
  });

  revalidatePath('/admin/claims');
}
