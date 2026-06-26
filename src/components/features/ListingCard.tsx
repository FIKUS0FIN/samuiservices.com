import Link from 'next/link';
import { Listing, Category, Island } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { FavoriteToggle } from '@/components/features/FavoriteToggle';

type BusinessWithRelations = Listing & { category?: Category, island?: Island, isFavorited?: boolean };

interface ListingCardProps {
  business: BusinessWithRelations;
}

export function ListingCard({ business }: ListingCardProps) {
  return (
    <div style={{ position: 'relative', height: '100%' }} className="listing-card-container">
      <FavoriteToggle listingId={business.id} initialIsFavorited={!!business.isFavorited} />
      <Link href={`/listing/${business.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
        <Card 
          style={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            padding: 0,
            borderRadius: '16px',
            backgroundColor: '#ffffff'
          }} 
        >
          <div style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%',
                width: '100%',
                backgroundImage: `url(${business.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
              }}
            ></div>
            
            {/* Category Badge */}
            <span style={{ 
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              color: 'white', 
              fontSize: '0.75rem', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '9999px', 
              zIndex: 2,
            }}>
              {business.category?.name || 'Uncategorized'}
            </span>
          </div>

          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Title and Rating Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#0f172a', fontWeight: 800 }}>
                {business.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', fontWeight: 700 }}>
                {business.averageRating.toFixed(1)} <span style={{ color: '#facc15' }}>★</span>
              </div>
            </div>
            
            {/* Provider Name */}
            <div style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
              Provider Name
            </div>

            {/* Location and Reviews */}
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ color: '#94a3b8' }}>📍</span> Samui - {business.reviewCount} reviews
            </div>
            
            {/* Price */}
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              from 800 THB/hr
            </div>

            {/* Button */}
            <div style={{ marginTop: 'auto' }}>
              <button 
                style={{ 
                  width: '100%', 
                  fontSize: '0.8rem', 
                  padding: '0.6rem 1rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                VIEW PROFILE
              </button>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
