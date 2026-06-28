'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitReview } from '@/app/actions/reviews';

interface ReviewFormProps {
  listingId: string;
}

export function ReviewForm({ listingId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    formData.append('rating', rating.toString());
    formData.append('listingId', listingId);
    
    const result = await submitReview(formData);
    
    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ padding: '1.5rem', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        Thank you for submitting your review!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Leave a Review</h3>
      
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      <div>
        <div style={{ marginBottom: '0.5rem' }}>Rating</div>
        <div role="group" aria-label="Select rating" style={{ display: 'flex', gap: '0.25rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              title={`Rate ${star} star${star > 1 ? 's' : ''}`}
              aria-pressed={star <= rating}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: star <= rating ? 'var(--accent-color)' : '#d1d5db'
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" style={{ display: 'block', marginBottom: '0.5rem' }}>Comment</label>
        <textarea 
          id="comment"
          name="comment" 
          required 
          rows={4}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            fontFamily: 'inherit'
          }}
          placeholder="Share your experience..."
        />
      </div>

      <Button type="submit" variant="primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
