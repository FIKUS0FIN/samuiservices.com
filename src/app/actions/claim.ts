'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitClaimRequest(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return { error: 'You must be logged in to claim a business.' };
  }

  const listingId = formData.get('listingId') as string;
  if (!listingId) {
    return { error: 'Listing ID is missing.' };
  }

  try {
    // SECURITY: Prevent IDOR / unauthorized claims on already claimed listings
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return { error: 'Listing not found.' };
    }
    if (listing.isClaimed) {
      return { error: 'This business has already been claimed.' };
    }

    // Check if a pending claim already exists for this user and listing
    const existing = await prisma.claimRequest.findFirst({
      where: {
        userId: session.user.id,
        listingId: listingId,
        status: 'PENDING'
      }
    });

    if (existing) {
      return { error: 'You have already submitted a claim request for this business.' };
    }

    await prisma.claimRequest.create({
      data: {
        userId: session.user.id,
        listingId: listingId,
        status: 'PENDING'
      }
    });

    revalidatePath(`/listing/${listingId}`);;
    return { success: true };
  } catch (error) {
    console.error('Error submitting claim:', error);
    return { error: 'Failed to submit claim request.' };
  }
}
