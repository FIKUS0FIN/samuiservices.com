import { notFound } from 'next/navigation';
import { getBusinessesByIsland, getAllIslands, getAllCategories } from '@/lib/db';
import { FilterSidebar } from '@/components/features/FilterSidebar';
import { BusinessCard } from '@/components/features/BusinessCard';
import { Card } from '@/components/ui/Card';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DynamicMap from '@/components/features/DynamicMap';

export async function generateMetadata({ params }: { params: Promise<{ island: string }> }) {
  const { island } = await params;
  const islandName = island.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `Services in ${islandName} | Samui Services`,
    description: `Find the best local services, construction, delivery, and more in ${islandName}.`,
  };
}

export default async function IslandDirectory({ 
  params,
  searchParams
}: { 
  params: Promise<{ island: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { island } = await params;
  const resolvedSearchParams = await searchParams;
  
  const categoriesParam = resolvedSearchParams.category;
  const categorySlugs = categoriesParam 
    ? (Array.isArray(categoriesParam) ? categoriesParam : [categoriesParam]) 
    : undefined;
    
  const query = resolvedSearchParams.q as string | undefined;

  const islands = await getAllIslands();
  
  if (island !== 'all' && !islands.find(i => i.slug === island)) {
    notFound();
  }

  const islandName = island === 'all' ? 'All' : island.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const session = await getServerSession(authOptions);
  
  // Now pass the filters to getBusinessesByIsland
  const islandBusinesses = await getBusinessesByIsland(island, categorySlugs, query, session?.user?.id);
  const categories = await getAllCategories();

  return (
    <div>
      <div className="section" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{islandName} Services</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Browse local businesses and top-rated services on the island.</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="island-page-grid">
            {/* Sidebar Filters */}
            <div style={{ alignSelf: 'start', position: 'sticky', top: '100px' }}>
              <FilterSidebar categories={categories} />
            </div>

            {/* Results */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <p style={{ fontWeight: 600 }}>{islandBusinesses.length} businesses found</p>
                <select className="input-field" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  <option>Recommended</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {islandBusinesses.length > 0 && islandBusinesses.some(b => b.lat && b.lng) && (
                  <div style={{ marginBottom: '1rem' }}>
                    <DynamicMap businesses={islandBusinesses as any} /> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                  </div>
                )}
                {islandBusinesses.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No businesses found yet. Be the first to add yours!</p>
                  </Card>
                ) : (
                  islandBusinesses.map(business => (
                    <BusinessCard key={business.id} business={business} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
