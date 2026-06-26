'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: 'You must be logged in to send a message.' };
  }
  
  const receiverId = formData.get('receiverId') as string;
  const content = formData.get('content') as string;
  const listingId = formData.get('listingId') as string | null;
  
  if (!receiverId || !content) {
    return { error: 'Message content is required.' };
  }
  
  if (receiverId === session.user.id) {
    return { error: 'You cannot send a message to yourself.' };
  }

  try {
    await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
        listingId,
      }
    });

    if (listingId) {
      revalidatePath(`/listing/${listingId}`);
    }
    revalidatePath('/dashboard/inbox');
    
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: 'Failed to send message.' };
  }
}

export async function markAsRead(messageId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: 'Unauthorized' };
  }
  
  try {
    // Only the receiver can mark a message as read
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });
    
    if (!message || message.receiverId !== session.user.id) {
      return { error: 'Message not found or unauthorized' };
    }
    
    if (!message.isRead) {
      await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true }
      });
      revalidatePath('/dashboard/inbox');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return { error: 'Failed to update message' };
  }
}
