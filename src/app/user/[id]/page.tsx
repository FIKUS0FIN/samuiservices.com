import { notFound } from 'next/navigation';
import { prisma } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export const revalidate = 60; // Cache for 60 seconds

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      listings: {
        include: {
          category: true,
          island: true,
        },
        orderBy: { createdAt: 'desc' }
      },
      reviews: {
        include: {
          listing: true
        },
        orderBy: { createdAt: 'desc' }
      },
      questions: {
        include: {
          listing: true
        },
        orderBy: { createdAt: 'desc' }
      },
      answers: {
        include: {
          question: {
            include: {
              listing: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    notFound();
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown';

  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-surface-container-low border-b border-outline-variant pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden shadow-md ring-4 ring-surface">
            {user.image ? (
              <img src={user.image} alt={user.name || 'User avatar'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">{(user.name || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-on-surface flex items-center justify-center gap-2">
              {user.name || 'Anonymous User'}
              {user.role === 'ADMIN' && (
                <span className="bg-primary text-on-primary text-[10px] uppercase px-2 py-0.5 rounded-full font-bold shadow-sm align-middle">Admin</span>
              )}
            </h1>
            <p className="text-on-surface-variant font-body-md mt-1">
              Member since {joinDate}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 font-body-md text-on-surface-variant">
            <div className="bg-surface-container px-4 py-1.5 rounded-full border border-outline-variant/50 shadow-sm">
              <strong className="text-on-surface">{user.listings.length}</strong> Listings
            </div>
            <div className="bg-surface-container px-4 py-1.5 rounded-full border border-outline-variant/50 shadow-sm">
              <strong className="text-on-surface">{user.reviews.length}</strong> Reviews
            </div>
            <div className="bg-surface-container px-4 py-1.5 rounded-full border border-outline-variant/50 shadow-sm">
              <strong className="text-on-surface">{user.questions.length + user.answers.length}</strong> Q&A
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-12">
        
        {/* Listings Section */}
        {user.listings.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-on-surface border-b border-outline-variant pb-3 mb-6">Listings by {user.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.listings.map(listing => (
                <Card key={listing.id} className="flex gap-4 p-4 hover:border-primary transition-colors hover:shadow-md">
                  <div className="w-20 h-20 bg-surface-container-highest rounded-lg shrink-0 overflow-hidden relative">
                    {listing.image ? (
                      <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🏢</div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 justify-center min-w-0">
                    <Link href={`/listing/${listing.slug}`} className="font-bold text-on-surface hover:text-primary transition-colors truncate">
                      {listing.name}
                    </Link>
                    <div className="text-xs text-on-surface-variant truncate mt-1">
                      {listing.category?.name} • {listing.island?.name}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        {user.reviews.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-on-surface border-b border-outline-variant pb-3 mb-6">Reviews</h2>
            <div className="flex flex-col gap-4">
              {user.reviews.map(review => (
                <div key={review.id} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <Link href={`/listing/${review.listing?.slug}`} className="font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2">
                      <span className="text-sm">Reviewed:</span> {review.listing?.name}
                    </Link>
                    <div className="text-amber-500 font-bold tracking-widest text-sm shrink-0">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed bg-surface p-4 rounded-lg border border-outline-variant/30">
                    {review.comment}
                  </p>
                  <div className="text-xs text-on-surface-variant text-right">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Q&A Section */}
        {(user.questions.length > 0 || user.answers.length > 0) && (
          <section>
            <h2 className="text-2xl font-bold text-on-surface border-b border-outline-variant pb-3 mb-6">Q&A Activity</h2>
            <div className="flex flex-col gap-6">
              {user.questions.map(q => (
                <div key={q.id} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
                  <Link href={`/listing/${q.listing?.slug}`} className="text-sm text-primary font-bold hover:underline">
                    Asked about {q.listing?.name}
                  </Link>
                  <p className="font-body-md text-on-surface mt-1 font-medium">{q.text}</p>
                  <div className="text-xs text-on-surface-variant">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}

              {user.answers.map(a => (
                <div key={a.id} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-secondary/80"></div>
                  <Link href={`/listing/${a.question?.listing?.slug}`} className="text-sm text-secondary font-bold hover:underline">
                    Answered a question on {a.question?.listing?.name}
                  </Link>
                  <div className="bg-surface p-3 rounded-lg border border-outline-variant/30 mt-1 mb-1">
                    <p className="text-sm text-on-surface-variant italic">&quot;{a.question?.text}&quot;</p>
                  </div>
                  <p className="font-body-md text-on-surface leading-relaxed">{a.text}</p>
                  <div className="text-xs text-on-surface-variant">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {user.listings.length === 0 && user.reviews.length === 0 && user.questions.length === 0 && user.answers.length === 0 && (
          <div className="text-center text-on-surface-variant italic bg-surface-container-low p-12 rounded-2xl">
            This user hasn't posted any activity yet.
          </div>
        )}
      </div>
    </div>
  );
}
