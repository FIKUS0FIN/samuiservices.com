/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toggleFavorite } from './favorites';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
  prisma: {
    favorite: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('toggleFavorite action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error if user is not logged in', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await toggleFavorite('listing-123');

    expect(result).toEqual({ error: 'You must be logged in to favorite a listing.' });
    expect(prisma.favorite.findUnique).not.toHaveBeenCalled();
  });

  it('creates a new favorite if it does not exist', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-123', name: 'Test User' },
    } as any);

    vi.mocked(prisma.favorite.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.favorite.create).mockResolvedValue({ id: 'fav-123', userId: 'user-123', listingId: 'listing-123' } as any);

    const result = await toggleFavorite('listing-123');

    expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
      where: {
        userId_listingId: {
          userId: 'user-123',
          listingId: 'listing-123',
        },
      },
    });
    expect(prisma.favorite.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-123',
        listingId: 'listing-123',
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    expect(result).toEqual({ isFavorited: true });
  });

  it('deletes an existing favorite if it exists', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-123', name: 'Test User' },
    } as any);

    vi.mocked(prisma.favorite.findUnique).mockResolvedValue({
      id: 'fav-123',
      userId: 'user-123',
      listingId: 'listing-123',
    } as any);

    vi.mocked(prisma.favorite.delete).mockResolvedValue({
      id: 'fav-123',
      userId: 'user-123',
      listingId: 'listing-123',
    } as any);

    const result = await toggleFavorite('listing-123');

    expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
      where: {
        userId_listingId: {
          userId: 'user-123',
          listingId: 'listing-123',
        },
      },
    });
    expect(prisma.favorite.delete).toHaveBeenCalledWith({
      where: { id: 'fav-123' },
    });
    expect(prisma.favorite.create).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    expect(result).toEqual({ isFavorited: false });
  });

  it('returns error if a database operation fails', async () => {
    // Suppress console.error for this test to avoid polluting test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-123', name: 'Test User' },
    } as any);

    vi.mocked(prisma.favorite.findUnique).mockRejectedValue(new Error('DB Error'));

    const result = await toggleFavorite('listing-123');

    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toEqual({ error: 'Failed to toggle favorite.' });

    consoleSpy.mockRestore();
  });
});
