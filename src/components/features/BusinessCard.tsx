import Link from 'next/link';
import { Listing, Category, Island } from '@prisma/client';
import { Card } from '@/components/ui/Card';

import { FavoriteToggle } from '@/components/features/FavoriteToggle';

type BusinessWithRelations = Listing & { category?: Category, island?: Island, isFavorited?: boolean };

interface BusinessCardProps {
  business: BusinessWithRelations;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div style={{ position: 'relative' }}>
      <FavoriteToggle listingId={business.id} initialIsFavorited={!!business.isFavorited} />
      <Link href={`/listing/${business.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card 
        style={{ 
          border: business.isPremium ? '2px solid #fbbf24' : undefined,
          boxShadow: business.isPremium ? '0 4px 15px rgba(251, 191, 36, 0.2)' : undefined,
        }} 
        className="card business-card-layout"
      >
        <div 
          className="business-card-image"
          style={{ 
          backgroundImage: `url(${business.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          flexShrink: 0,
          borderRadius: 'var(--radius-md)'
        }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <div style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {business.category?.name || 'Uncategorized'} • {business.island?.name || 'Unknown Location'}
            </div>
            {business.isPremium && (
              <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                Premium
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: 0 }}>{business.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-color)' }}>★ {business.averageRating}</span>
            <span>({business.reviewCount} reviews)</span>
          </div>
        </div>
      </Card>
    </Link>
    </div>
  );
}
