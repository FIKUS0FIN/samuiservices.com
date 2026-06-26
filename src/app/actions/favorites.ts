'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(listingId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: 'You must be logged in to favorite a listing.' };
  }
  
  const userId = session.user.id;
  
  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      revalidatePath('/', 'layout');
      return { isFavorited: false };
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          listingId,
        }
      });
      revalidatePath('/', 'layout');
      return { isFavorited: true };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { error: 'Failed to toggle favorite.' };
  }
}
