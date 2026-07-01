/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import { getBusinessesByIsland, getAllIslands, getAllCategories } from '@/lib/db';
import { FilterSidebar } from '@/components/features/FilterSidebar';
import { BusinessCard } from '@/components/features/BusinessCard';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
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
  
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string, 10) : 1;
  const limit = 10;
  
  const session = await getServerSession(authOptions);
  
  const { listings: islandBusinesses, totalPages } = await getBusinessesByIsland(island, categorySlugs, query, session?.user?.id, page, limit);
  const categories = await getAllCategories();

  let mapCenter: [number, number] = [9.5120, 100.0136];
  let mapZoom = 11;

  if (island === 'phangan') {
    mapCenter = [9.7340, 100.0244];
    mapZoom = 12;
  } else if (island === 'tao') {
    mapCenter = [10.0950, 99.8400];
    mapZoom = 13;
  } else if (island === 'all') {
    mapCenter = [9.75, 99.95];
    mapZoom = 10;
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-81px)] overflow-hidden">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-80 flex-shrink-0 overflow-y-auto border-b lg:border-b-0 lg:border-r border-outline-variant p-6 bg-surface-container-lowest z-10">
        <h2 className="text-display-sm font-bold mb-2 text-on-surface">{islandName} Services</h2>
        <p className="text-on-surface-variant text-body-md mb-8">Browse local businesses and top-rated services.</p>
        <FilterSidebar categories={categories} />
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <p className="font-medium text-title-md text-on-surface">{islandBusinesses.length} businesses found</p>
            <select className="input-field w-auto py-2">
              <option>Recommended</option>
              <option>Highest Rated</option>
              <option>Newest</option>
            </select>
          </div>

          <div className="flex flex-col gap-6">
            {islandBusinesses.length === 0 ? (
              <Card className="text-center p-12 shadow-level-1 bg-surface-container-lowest border border-outline-variant rounded-card">
                <p className="text-on-surface-variant text-body-lg">No businesses found yet. Be the first to add yours!</p>
              </Card>
            ) : (
              islandBusinesses.map(business => (
                <BusinessCard key={business.id} business={business} />
              ))
            )}
          </div>
          
          <Pagination totalPages={totalPages} currentPage={page} />
        </div>
      </div>

      {/* Sticky Interactive Map (Desktop only) */}
      <div className="hidden lg:block flex-1 relative border-l border-outline-variant z-0 bg-surface-container-lowest">
        {islandBusinesses.length > 0 && islandBusinesses.some(b => b.lat && b.lng) ? (
           <div className="h-full w-full">
             <DynamicMap businesses={islandBusinesses as unknown as any} center={mapCenter} zoom={mapZoom} />
           </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-surface-container-lowest text-on-surface-variant font-medium">
             Map unavailable
          </div>
        )}
      </div>
    </div>
  );
}
