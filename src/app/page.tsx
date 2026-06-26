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
      <section style={{ 
        position: 'relative', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        overflow: 'hidden',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 1.5rem 3rem 1.5rem'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%)', zIndex: 1 }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%', maxWidth: '800px' }}>
          <h1 className="fade-in-up" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1rem', textShadow: '0 4px 15px rgba(0,0,0,0.4)', fontWeight: 800 }}>
            Discover Local Services in Samui
          </h1>
          <p className="fade-in-up" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', marginBottom: '2rem', opacity: 0.9, textShadow: '0 2px 10px rgba(0,0,0,0.3)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Find trusted professionals for everything you need on the island.
          </p>
          
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Left Sidebar */}
          <aside style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '2rem' }}>
            <ServiceFilter categories={categories} />
          </aside>
          
          {/* Right Content */}
          <main style={{ flex: 1 }}>
            <div style={{ marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 FEATURED SERVICES IN SAMUI
               </h2>
            </div>

            {/* Listings Content */}
            {allListings.length > 0 ? (
              <div className="grid-cards" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
                {listings.map((listing) => (
                  <ListingCard key={listing.id} business={listing} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>🏝️</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>No services found</h3>
                <p style={{ fontSize: '1.125rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>We couldn&apos;t find any services matching this category yet.</p>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
