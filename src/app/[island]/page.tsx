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
    <div className="split-layout">
      {/* Sidebar Filters */}
      <div className="split-layout-sidebar">
        <h2 className="text-xl font-bold mb-4">{islandName} Services</h2>
        <p className="text-muted text-sm mb-6">Browse local businesses and top-rated services.</p>
        <FilterSidebar categories={categories} />
      </div>

      {/* Results List */}
      <div className="split-layout-main">
        <div className="flex justify-between items-center mb-6">
          <p className="font-semibold">{islandBusinesses.length} businesses found</p>
          <select className="input-field" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
            <option>Recommended</option>
            <option>Highest Rated</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="flex flex-col gap-6">
          {islandBusinesses.length === 0 ? (
            <Card className="text-center p-8">
              <p className="text-muted text-lg">No businesses found yet. Be the first to add yours!</p>
            </Card>
          ) : (
            islandBusinesses.map(business => (
              <BusinessCard key={business.id} business={business} />
            ))
          )}
        </div>
      </div>

      {/* Sticky Interactive Map (Desktop only) */}
      <div className="split-layout-map">
        {islandBusinesses.length > 0 && islandBusinesses.some(b => b.lat && b.lng) ? (
           <div style={{ height: '100%', width: '100%' }}>
             <DynamicMap businesses={islandBusinesses as any} />
           </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-50 text-muted">
             Map unavailable
          </div>
        )}
      </div>
    </div>
  );
}
