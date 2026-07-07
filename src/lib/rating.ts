export interface UnifiedReview {
  id: string;
  authorName: string;
  authorImage?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  source: 'Google' | 'Site';
  userId?: string | null;
}

export function getUnifiedReviews(business: {
  reviews?: any[];
  externalReviews?: string | null;
}): UnifiedReview[] {
  const localReviews = business.reviews || [];
  let googleReviews: any[] = [];
  if (business.externalReviews) {
    try {
      const parsed = JSON.parse(business.externalReviews);
      if (parsed && Array.isArray(parsed.reviews)) {
        googleReviews = parsed.reviews;
      }
    } catch (e) {}
  }
  
  return [
    ...localReviews.map((r: any) => ({
      id: r.id,
      authorName: r.user?.name || 'Anonymous User',
      authorImage: r.user?.image || null,
      rating: r.rating,
      comment: r.comment,
      createdAt: new Date(r.createdAt).toLocaleDateString(),
      source: 'Site' as const,
      userId: r.user?.id || null
    })),
    ...googleReviews.map((r: any, idx: number) => ({
      id: `google-${idx}`,
      authorName: r.author || 'Anonymous Google User',
      authorImage: r.avatar || null,
      rating: r.rating,
      comment: r.text,
      createdAt: r.time || 'Google Review',
      source: 'Google' as const,
      userId: null
    }))
  ];
}

export function getConsolidatedRating(business: {
  averageRating: number;
  reviewCount: number;
  reviews?: any[];
  externalReviews?: string | null;
}) {
  const localReviews = business.reviews || [];
  const localCount = localReviews.length;
  const localRatingSum = localReviews.reduce((sum, r) => sum + r.rating, 0);

  let googleRating = business.averageRating || 0;
  let googleCount = business.reviewCount || 0;

  // Try to parse from externalReviews if stored
  if (business.externalReviews) {
    try {
      const parsed = JSON.parse(business.externalReviews);
      if (parsed && typeof parsed === 'object') {
        googleRating = parseFloat(parsed.rating) || googleRating;
        googleCount = parseInt(parsed.reviewCount) || googleCount;
      }
    } catch (e) {}
  }

  const totalCount = googleCount + localCount;
  const average = totalCount > 0 
    ? (googleRating * googleCount + localRatingSum) / totalCount 
    : 0;

  return {
    rating: parseFloat(average.toFixed(1)),
    reviewCount: totalCount,
    googleRating,
    googleCount,
    localCount
  };
}
