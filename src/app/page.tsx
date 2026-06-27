import { getAllCategories, getBusinessesByIsland } from '@/lib/db';
import { HeroSearch } from '@/components/features/HeroSearch';
import { ServiceFilter } from '@/components/features/ServiceFilter';
import { ListingCard } from '@/components/features/ListingCard';

export default async function Home(props: { searchParams?: Promise<{ category?: string, view?: string }> }) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams?.category;
  
  const categories = await getAllCategories();
  
  // Fetch listings based on filter. 
  const categoryFilter = categorySlug ? [categorySlug] : undefined;
  const allListings = await getBusinessesByIsland('all', categoryFilter);
  
  const listings = allListings.slice(0, 12);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[500px] overflow-hidden bg-cover bg-center bg-fixed text-white py-24 px-6"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-text/60 to-primary-text/30 z-[1]"></div>
        
        <div className="relative z-[2] text-center w-full max-w-4xl mx-auto">
          <h1 className="fade-in-up text-display text-white mb-4 drop-shadow-md">
            Discover Local Services in Samui
          </h1>
          <p className="fade-in-up text-body-lg opacity-90 drop-shadow-sm max-w-2xl mx-auto mb-8">
            Find trusted professionals for everything you need on the island.
          </p>
          
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section bg-surface">
        <div className="container flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24">
            <ServiceFilter categories={categories} />
          </aside>
          
          {/* Right Content */}
          <main className="flex-1 w-full">
            <div className="mb-6">
               <h2 className="text-headline-sm m-0 text-text-main font-extrabold uppercase tracking-wide">
                 FEATURED SERVICES IN SAMUI
               </h2>
            </div>

            {/* Listings Content */}
            {allListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 fade-in-up" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
                {listings.map((listing) => (
                  <ListingCard key={listing.id} business={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 px-8 text-text-muted bg-surface-card rounded-card border border-outline-muted shadow-level-1">
                <div className="text-6xl mb-6 opacity-50">🏝️</div>
                <h3 className="text-headline-md mb-3 text-text-main font-bold">No services found</h3>
                <p className="text-body-lg max-w-md mx-auto mb-8">We couldn&apos;t find any services matching this category yet.</p>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
