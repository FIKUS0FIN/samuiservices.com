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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {reviews && reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', overflow: 'hidden' }}>
                {review.user?.image ? (
                  <img src={review.user.image} alt={review.user.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    {(review.user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{review.user?.name || 'Anonymous User'}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', color: 'var(--accent-color)' }}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{review.comment}</p>
          </div>
        ))
      ) : (
        <div style={{ color: 'var(--text-muted)' }}>
          No reviews yet. Be the first to review this business!
        </div>
      )}
    </div>
  );
}
