type ReviewWithUser = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: {
    name?: string | null;
    image?: string | null;
  } | null;
};

export function ReviewsList({ reviews }: { reviews: ReviewWithUser[] }) {
  return (
    <div className="flex flex-col gap-6">
      {reviews && reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                {review.user?.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                    {(review.user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold">{review.user?.name || 'Anonymous User'}</div>
                <div className="text-sm text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="ml-auto text-yellow-500 font-bold text-lg">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p className="m-0 leading-relaxed">{review.comment}</p>
          </div>
        ))
      ) : (
        <div className="text-muted italic">
          No reviews yet. Be the first to review this business!
        </div>
      )}
    </div>
  );
}
