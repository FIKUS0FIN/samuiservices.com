/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitReview } from './reviews';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
  prisma: {
    review: {
      findFirst: vi.fn(),
      create: vi.fn(),
      aggregate: vi.fn(),
    },
    listing: {
      update: vi.fn(),
    }
  },
}));

describe('reviews actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitReview', () => {
    it('returns error if user is not logged in', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append('listingId', 'listing-123');
      formData.append('rating', '4');
      formData.append('comment', 'Great!');

      const result = await submitReview(formData);
      expect(result).toEqual({ error: 'You must be logged in to submit a review.' });
    });

    it('returns error for invalid form data (missing rating/comment)', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);

      const formData = new FormData();
      formData.append('listingId', 'listing-123');
      // missing rating and comment

      const result = await submitReview(formData);
      expect(result).toEqual({ error: 'Invalid form data. Please provide a rating and a comment.' });
    });

    it('returns error if rating is out of bounds', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);

      const formData = new FormData();
      formData.append('listingId', 'listing-123');
      formData.append('rating', '6'); // invalid
      formData.append('comment', 'Great!');

      const result = await submitReview(formData);
      expect(result).toEqual({ error: 'Invalid form data. Please provide a rating and a comment.' });
    });

    it('returns error if user already reviewed the listing', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);
      vi.mocked(prisma.review.findFirst).mockResolvedValue({ id: 'existing-review' } as unknown as any);

      const formData = new FormData();
      formData.append('listingId', 'listing-123');
      formData.append('rating', '4');
      formData.append('comment', 'Great!');

      const result = await submitReview(formData);

      expect(result).toEqual({ error: 'You have already reviewed this listing.' });
      expect(prisma.review.create).not.toHaveBeenCalled();
    });

    it('creates review and updates listing stats successfully', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);
      vi.mocked(prisma.review.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.review.create).mockResolvedValue({ id: 'new-review' } as unknown as any);
      vi.mocked(prisma.review.aggregate).mockResolvedValue({
        _avg: { rating: 4.5 },
        _count: { rating: 2 }
      } as unknown as any);

      const formData = new FormData();
      formData.append('listingId', 'listing-123');
      formData.append('rating', '5');
      formData.append('comment', 'Excellent service!');

      const result = await submitReview(formData);

      expect(prisma.review.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          listingId: 'listing-123',
          rating: 5,
          comment: 'Excellent service!',
        }
      });

      expect(prisma.review.aggregate).toHaveBeenCalledWith({
        where: { listingId: 'listing-123' },
        _avg: { rating: true },
        _count: { rating: true }
      });

      expect(prisma.listing.update).toHaveBeenCalledWith({
        where: { id: 'listing-123' },
        data: {
          averageRating: 4.5,
          reviewCount: 2,
        }
      });

      expect(revalidatePath).toHaveBeenCalledWith('/listing/listing-123');
      expect(result).toEqual({ success: true });
    });

    it('returns error if db operation fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);
      vi.mocked(prisma.review.findFirst).mockRejectedValue(new Error('DB Error'));

      const formData = new FormData();
      formData.append('listingId', 'listing-123');
      formData.append('rating', '4');
      formData.append('comment', 'Great!');

      const result = await submitReview(formData);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({ error: 'Failed to submit review.' });
      consoleSpy.mockRestore();
    });
  });
});
