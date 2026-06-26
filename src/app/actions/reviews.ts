'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitReview(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: 'You must be logged in to submit a review.' };
  }
  
  const listingId = formData.get('listingId') as string;
  const rating = parseInt(formData.get('rating') as string, 10);
  const comment = formData.get('comment') as string;
  
  if (!listingId || !rating || rating < 1 || rating > 5 || !comment) {
    return { error: 'Invalid form data. Please provide a rating and a comment.' };
  }
  
  try {
    // 1. Check if user already reviewed this listing
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        listingId,
      }
    });

    if (existingReview) {
      return { error: 'You have already reviewed this listing.' };
    }

    // 2. Create the review
    await prisma.review.create({
      data: {
        userId: session.user.id,
        listingId,
        rating,
        comment,
      }
    });

    // 3. Update the listing's average rating and review count
    const aggregate = await prisma.review.aggregate({
      where: { listingId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        averageRating: aggregate._avg.rating || 0,
        reviewCount: aggregate._count.rating || 0,
      }
    });

    revalidatePath(`/listing/${listingId}`);;
    return { success: true };
    
  } catch (error) {
    console.error('Error submitting review:', error);
    return { error: 'Failed to submit review.' };
  }
}
