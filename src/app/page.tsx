import Link from 'next/link';
import { getAllCategories, getBusinessesByIsland } from '@/lib/db';
import { HeroSearch } from '@/components/features/HeroSearch';
import { FilterSidebar } from '@/components/features/FilterSidebar';
import { ListingCard } from '@/components/features/ListingCard';

export default async function Home(props: { searchParams?: Promise<{ category?: string, view?: string }> }) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams?.category;
  
  const categories = await getAllCategories();
  
  // Fetch listings based on filter. 
  const categoryFilter = categorySlug ? [categorySlug] : undefined;
  const allListings = await getBusinessesByIsland('all', categoryFilter);
  
  const listings = allListings.slice(0, 12);

  // Separate listings by parent category for the homepage sections if no filter is applied
  const parentCategories = categories.filter(c => c.parentId === null);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Tropical beach in Koh Samui with palm trees and clear blue water" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1537956965359-7573183d1f57?q=80&w=2000&auto=format&fit=crop" />
          <div className="absolute inset-0 bg-surface/20"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-xl text-center flex flex-col items-center">
          <h1 className="font-display text-headline-lg-mobile md:text-display text-on-primary font-bold mb-4 max-w-3xl drop-shadow-lg">
            Discover the Best Services in Koh Samui
          </h1>
          <p className="font-body-lg text-body-md md:text-body-lg text-on-primary mb-8 max-w-2xl drop-shadow-md">
            Find trusted professionals for your home, business, and lifestyle on the island.
          </p>
          
          <div className="w-full max-w-4xl">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section bg-surface">
        <div className="container flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-[250px] shrink-0 lg:sticky lg:top-8 z-10 bg-surface-container-lowest rounded-card shadow-level-1 p-4 lg:bg-transparent lg:shadow-none lg:p-0">
            <FilterSidebar categories={categories as any} />
          </aside>
          
          {/* Right Content */}
          <main className="flex-1 w-full">

            {categorySlug ? (
              // View when category is filtered
              <div>
                <div className="mb-6">
                   <h2 className="text-title-lg font-bold text-on-surface uppercase tracking-widest m-0">
                     RESULTS FOR &quot;{categories.find(c => c.slug === categorySlug)?.name?.toUpperCase()}&quot;
                   </h2>
                </div>
                {allListings.length > 0 ? (
                  <div className="grid-cards fade-in-up">
                    {listings.map((listing) => (
                      <ListingCard key={listing.id} business={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 px-8 text-on-surface-variant bg-surface-container-lowest rounded-card border border-outline-variant shadow-level-1">
                    <div className="text-6xl mb-6 opacity-50">🏝️</div>
                    <h3 className="text-2xl mb-3 text-on-surface font-bold">No services found</h3>
                    <p className="text-lg max-w-[400px] mx-auto mb-8">We couldn&apos;t find any services matching this category yet.</p>
                  </div>
                )}
              </div>
            ) : (
              // Redesigned View with Sections (No Filter)
              <div className="flex flex-col gap-12">

                {parentCategories.map(parentCat => {
                   const childIds = parentCat.children.map(c => c.id);
                   const parentListings = allListings.filter(l => childIds.includes(l.categoryId) || l.categoryId === parentCat.id).slice(0, 3);

                   if (parentListings.length === 0) return null;

                   return (
                     <div key={parentCat.id} className="w-full">
                        <div className="flex justify-between items-end mb-6">
                          <h2 className="text-title-lg font-bold text-on-surface uppercase tracking-widest m-0">
                            {parentCat.name}
                          </h2>
                          <Link href={`/?category=${parentCat.children[0]?.slug || parentCat.slug}`} className="text-label-md font-bold text-primary hover:text-primary-hover transition-colors">
                            View All →
                          </Link>
                        </div>
                        <div className="grid-cards">
                          {parentListings.map((listing) => (
                            <ListingCard key={listing.id} business={listing} />
                          ))}
                        </div>
                     </div>
                   );
                })}

              </div>
            )}

          </main>
        </div>
      </section>
    </div>
  );
}