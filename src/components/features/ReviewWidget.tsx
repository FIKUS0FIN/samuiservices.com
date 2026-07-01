import Link from 'next/link';
import { ScrapedReview } from '@/lib/parseDescription';

export function ReviewWidget({ reviews }: { reviews: ScrapedReview[] }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="flex flex-col gap-6" aria-labelledby="top-reviews-heading">
      <h2 id="top-reviews-heading" className="text-2xl font-bold text-on-surface">Top Reviews</h2>
      
      {/* We use a grid that adapts from 1 column on mobile to 2 on lg screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review, idx) => (
          <div 
            key={idx} 
            className="p-6 border border-outline-variant rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 relative overflow-hidden"
            itemProp="review" 
            itemScope 
            itemType="https://schema.org/Review"
          >
            {/* Decorative quote mark background */}
            <div className="absolute -top-4 -right-4 text-9xl text-primary/5 select-none pointer-events-none font-serif leading-none">
              &quot;
            </div>
            
            {/* Author and Rating */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-display font-bold text-xl border border-primary/20">
                {review.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1" itemProp="author" itemScope itemType="https://schema.org/Person">
                <div className="font-bold text-on-surface text-lg leading-tight" itemProp="name">{review.author}</div>
                <div className="text-amber-500 font-bold tracking-widest text-sm mt-0.5" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  <meta itemProp="ratingValue" content={review.rating.toString()} />
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </div>
            </div>
            
            {/* Review Text */}
            <blockquote className="m-0 text-on-surface-variant leading-relaxed text-md relative z-10 italic">
              <span itemProp="reviewBody">{review.text}</span>
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
