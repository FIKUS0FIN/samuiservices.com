'use client';

import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryWithChildren extends Category {
  children: Category[];
}

interface ServiceFilterProps {
  categories: CategoryWithChildren[];
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
    <div style={{ width: "100%", paddingRight: "1rem" }}>
      
      {/* Dynamic Categories Accordion */}
      {categories.filter(cat => cat.parentId === null).map(parent => (
        <div key={parent.id} style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => toggleSection(parent.slug as keyof typeof openSections)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
          >
            <h3 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", margin: 0 }}>{parent.name}</h3>
            {openSections[parent.slug as keyof typeof openSections] !== false ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
          </button>

          {openSections[parent.slug as keyof typeof openSections] !== false && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1rem" }}>
              {parent.children.map(child => {
                const isActive = activeCategory === child.slug;
                return (
                  <label key={child.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.9rem", color: "#334155" }}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => handleSelect(child.slug)}
                      style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#06b6d4", borderRadius: "4px" }}
                    />
                    {child.name}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Location Accordion */}
      <div style={{ marginBottom: "2rem" }}>
         <button
          onClick={() => toggleSection('location')}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
        >
          <h3 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", margin: 0 }}>Island Area</h3>
          {openSections.location ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
        </button>

         {openSections.location && (
           <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1rem", fontSize: "0.9rem", color: "#334155" }}>
              {['Chaweng', 'Lamai', 'Bophut', 'Maenam', 'Nathon'].map(loc => (
                <label key={loc} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                   <input type="checkbox" style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#06b6d4", borderRadius: "4px" }} /> {loc}
                </label>
              ))}
           </div>
         )}
      </div>
      
      {/* Rating Accordion */}
      <div style={{ marginBottom: "2rem" }}>
         <button
          onClick={() => toggleSection('rating')}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
        >
          <h3 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", margin: 0 }}>Rating</h3>
          {openSections.rating ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
        </button>

         {openSections.rating && (
           <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1rem", fontSize: "0.9rem", color: "#334155" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                 <input type="checkbox" defaultChecked style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#06b6d4", borderRadius: "4px" }} />
                 <span style={{ color: "#facc15" }}>★★★★★</span> & Up <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.8rem" }}>(120)</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                 <input type="checkbox" style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#06b6d4", borderRadius: "4px" }} />
                 <span style={{ color: "#facc15" }}>★★★★</span><span style={{ color: "#cbd5e1" }}>★</span> <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.8rem" }}>(98)</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                 <input type="checkbox" style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#06b6d4", borderRadius: "4px" }} />
                 <span style={{ color: "#facc15" }}>★★★</span><span style={{ color: "#cbd5e1" }}>★★</span> <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.8rem" }}>(45)</span>
              </label>
           </div>
         )}
      </div>

      {/* Price Accordion */}
      <div style={{ marginBottom: "2rem" }}>
         <button
          onClick={() => toggleSection('price')}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
        >
          <h3 style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", margin: 0 }}>Price Range</h3>
          {openSections.price ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
        </button>

         {openSections.price && (
           <div style={{ display: "flex", alignItems: "center", height: "24px", marginTop: "1rem" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #cbd5e1", background: "white", zIndex: 2 }}></div>
              <div style={{ flex: 1, height: "4px", background: "#06b6d4", margin: "0 -2px", zIndex: 1 }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #cbd5e1", background: "white", zIndex: 2 }}></div>
           </div>
         )}
      </div>
      
    </div>
  );
}
