'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function askQuestion(listingId: string, userId: string, text: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error('Unauthorized');
  }

  // Prevent IDOR: Ensure the user is asking the question as themselves
  if (session.user.id !== userId) {
    throw new Error('Unauthorized');
  }

  if (!text || text.trim() === '') {
    throw new Error('Question text is required');
  }

  const question = await prisma.question.create({
    data: {
      text,
      listingId,
      userId: session.user.id,
    }
  });

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (listing) {
    revalidatePath(`/listing/${listing.slug}`);
  }

  return question;
}

export async function answerQuestion(questionId: string, userId: string, text: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error('Unauthorized');
  }

  // Prevent IDOR: Ensure the user is answering as themselves
  if (session.user.id !== userId) {
    throw new Error('Unauthorized');
  }

  if (!text || text.trim() === '') {
    throw new Error('Answer text is required');
  }

  const answer = await prisma.answer.create({
    data: {
      text,
      questionId,
      userId: session.user.id,
    }
  });

  const question = await prisma.question.findUnique({ 
    where: { id: questionId },
    include: { listing: true }
  });
  
  if (question?.listing) {
    revalidatePath(`/listing/${question.listing.slug}`);
  }

  return answer;
}
