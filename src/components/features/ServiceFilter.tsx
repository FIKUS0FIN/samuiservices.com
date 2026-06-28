'use client';

import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ServiceFilterProps {
  categories: Category[];
}

export function ServiceFilter({ categories }: ServiceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  // Accordion state
  const [openSections, setOpenSections] = useState({
    categories: true,
    location: true,
    rating: true,
    price: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSelect = (slug: string) => {
    const isCurrentlyActive = activeCategory === slug;
    router.push(`/?${createQueryString('category', isCurrentlyActive ? '' : slug)}`, { scroll: false });
  };

  return (
    <div className="w-full pr-4 bg-surface-card rounded-card p-6 shadow-level-1">
      
      {/* Categories Accordion */}
      <div className="mb-6 border-b border-outline-muted/50 pb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex justify-between items-center w-full bg-transparent border-none p-0 cursor-pointer text-left"
        >
          <h3 className="text-label-sm font-bold uppercase tracking-wider text-text-main m-0">Categories</h3>
          {openSections.categories ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>

        {openSections.categories && (
          <div className="flex flex-col gap-3 mt-4">
            {categories.map(cat => {
              const isActive = activeCategory === cat.slug;
              return (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer text-body-sm text-text-muted hover:text-text-main transition-colors">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => handleSelect(cat.slug)}
                    className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary/30 cursor-pointer"
                  />
                  {cat.name}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Location Accordion */}
      <div className="mb-6 border-b border-outline-muted/50 pb-6">
         <button
          onClick={() => toggleSection('location')}
          className="flex justify-between items-center w-full bg-transparent border-none p-0 cursor-pointer text-left"
        >
          <h3 className="text-label-sm font-bold uppercase tracking-wider text-text-main m-0">Island Area</h3>
          {openSections.location ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>

         {openSections.location && (
           <div className="flex flex-col gap-3 mt-4 text-body-sm text-text-muted">
              {['Chaweng', 'Lamai', 'Bophut', 'Maenam', 'Nathon'].map(loc => (
                <label key={loc} className="flex items-center gap-3 cursor-pointer hover:text-text-main transition-colors">
                   <input type="checkbox" className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary/30 cursor-pointer" /> {loc}
                </label>
              ))}
           </div>
         )}
      </div>
      
      {/* Rating Accordion */}
      <div className="mb-6 border-b border-outline-muted/50 pb-6">
         <button
          onClick={() => toggleSection('rating')}
          className="flex justify-between items-center w-full bg-transparent border-none p-0 cursor-pointer text-left"
        >
          <h3 className="text-label-sm font-bold uppercase tracking-wider text-text-main m-0">Rating</h3>
          {openSections.rating ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>

         {openSections.rating && (
           <div className="flex flex-col gap-3 mt-4 text-body-sm text-text-muted">
              <label className="flex items-center gap-3 cursor-pointer hover:text-text-main transition-colors">
                 <input type="checkbox" defaultChecked className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary/30 cursor-pointer" />
                 <span className="text-accent">★★★★★</span> & Up <span className="ml-auto text-outline text-xs">(120)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-text-main transition-colors">
                 <input type="checkbox" className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary/30 cursor-pointer" />
                 <span className="text-accent">★★★★</span><span className="text-outline-muted">★</span> <span className="ml-auto text-outline text-xs">(98)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-text-main transition-colors">
                 <input type="checkbox" className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary/30 cursor-pointer" />
                 <span className="text-accent">★★★</span><span className="text-outline-muted">★★</span> <span className="ml-auto text-outline text-xs">(45)</span>
              </label>
           </div>
         )}
      </div>

      {/* Price Accordion */}
      <div className="mb-2">
         <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full bg-transparent border-none p-0 cursor-pointer text-left"
        >
          <h3 className="text-label-sm font-bold uppercase tracking-wider text-text-main m-0">Price Range</h3>
          {openSections.price ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
        </button>

         {openSections.price && (
           <div className="flex items-center h-6 mt-4">
              <div className="w-3 h-3 rounded-full border-2 border-outline bg-surface-card z-10 cursor-pointer hover:border-primary transition-colors"></div>
              <div className="flex-1 h-1.5 bg-primary -mx-1 z-0"></div>
              <div className="w-3 h-3 rounded-full border-2 border-outline bg-surface-card z-10 cursor-pointer hover:border-primary transition-colors"></div>
           </div>
         )}
      </div>
      
    </div>
  );
}
