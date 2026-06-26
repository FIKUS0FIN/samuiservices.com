import { Listing, Category, Island } from '@prisma/client';

type BusinessInfoProps = {
  business: Listing & { category: Category, island: Island };
};

export function BusinessInfo({ business }: BusinessInfoProps) {
  return (
    <div style={{ flex: 1, minWidth: '300px' }}>
      <div style={{ color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>
        {business.category.name} • {business.island.name}
      </div>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{business.name}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.25rem', marginBottom: '2rem' }}>
        <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>★ {business.averageRating}</span>
        <span style={{ color: 'var(--text-muted)' }}>({business.reviewCount} verified reviews)</span>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About this business</h3>
      <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
        {business.description}
      </p>
    </div>
  );
}
