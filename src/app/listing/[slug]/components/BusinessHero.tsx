import { Listing, Category, Island } from '@prisma/client';

type BusinessHeroProps = {
  business: Listing & { category: Category, island: Island };
};

export function BusinessHero({ business }: BusinessHeroProps) {
  return (
      <div style={{ width: '100%', height: '350px', backgroundImage: `url(${business.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 100%)' }}></div>
        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '2rem' }}>
           <div>
              <div style={{ color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {business.category.name} • {business.subdistrict ? `${business.subdistrict}, ` : ''}{business.island.name}
              </div>
              <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{business.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.25rem', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>★ {business.averageRating}</span>
                <span>({business.reviewCount} verified reviews)</span>
              </div>
           </div>
        </div>
      </div>
  );
}
