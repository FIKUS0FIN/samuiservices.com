/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMessage, markAsRead } from './messages';
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
    message: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('messages actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('returns error if user is not logged in', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append('receiverId', 'receiver-123');
      formData.append('content', 'Hello!');

      const result = await sendMessage(formData);

      expect(result).toEqual({ error: 'You must be logged in to send a message.' });
    });

    it('returns error if receiverId or content is missing', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);

      const formData = new FormData();
      // missing receiverId
      formData.append('content', 'Hello!');

      const result = await sendMessage(formData);
      expect(result).toEqual({ error: 'Message content is required.' });
    });

    it('returns error if user sends message to themselves', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);

      const formData = new FormData();
      formData.append('receiverId', 'user-123');
      formData.append('content', 'Hello!');

      const result = await sendMessage(formData);
      expect(result).toEqual({ error: 'You cannot send a message to yourself.' });
    });

    it('creates message and revalidates paths successfully', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);
      vi.mocked(prisma.message.create).mockResolvedValue({ id: 'msg-1' } as unknown as any);

      const formData = new FormData();
      formData.append('receiverId', 'receiver-123');
      formData.append('content', 'Hello!');
      formData.append('listingId', 'listing-123');

      const result = await sendMessage(formData);

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: {
          senderId: 'user-123',
          receiverId: 'receiver-123',
          content: 'Hello!',
          listingId: 'listing-123',
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/listing/listing-123');
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/inbox');
      expect(result).toEqual({ success: true });
    });

    it('returns error if db operation fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);
      vi.mocked(prisma.message.create).mockRejectedValue(new Error('DB Error'));

      const formData = new FormData();
      formData.append('receiverId', 'receiver-123');
      formData.append('content', 'Hello!');

      const result = await sendMessage(formData);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({ error: 'Failed to send message.' });
      consoleSpy.mockRestore();
    });
  });

  describe('markAsRead', () => {
    it('returns error if user is not logged in', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const result = await markAsRead('msg-123');
      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('returns error if message not found or unauthorized (user is not receiver)', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);
      vi.mocked(prisma.message.findUnique).mockResolvedValue({ id: 'msg-123', receiverId: 'other-user' } as unknown as any);

      const result = await markAsRead('msg-123');

      expect(result).toEqual({ error: 'Message not found or unauthorized' });
      expect(prisma.message.update).not.toHaveBeenCalled();
    });

    it('updates message and revalidates if authorized and unread', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);
      vi.mocked(prisma.message.findUnique).mockResolvedValue({ id: 'msg-123', receiverId: 'user-123', isRead: false } as unknown as any);
      vi.mocked(prisma.message.update).mockResolvedValue({} as unknown as any);

      const result = await markAsRead('msg-123');

      expect(prisma.message.update).toHaveBeenCalledWith({
        where: { id: 'msg-123' },
        data: { isRead: true }
      });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/inbox');
      expect(result).toEqual({ success: true });
    });

    it('does not update if message is already read', async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-123' } } as unknown as any);
      vi.mocked(prisma.message.findUnique).mockResolvedValue({ id: 'msg-123', receiverId: 'user-123', isRead: true } as unknown as any);

      const result = await markAsRead('msg-123');

      expect(prisma.message.update).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled(); // Based on action code, revalidate is only if it was unread
      expect(result).toEqual({ success: true });
    });
  });
});
