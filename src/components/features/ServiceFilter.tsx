'use client';

import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface ServiceFilterProps {
  categories: Category[];
}

export function ServiceFilter({ categories }: ServiceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

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
    <div style={{ width: '100%', paddingRight: '1rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Categories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat.slug;
            return (
              <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155' }}>
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={() => handleSelect(cat.slug)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} 
                /> 
                {cat.name}
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Location</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#334155' }}>
            {['Chaweng', 'Lamai', 'Bophut', 'Maenam', 'Nathon'].map(loc => (
              <label key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                 <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} /> {loc}
              </label>
            ))}
         </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Rating</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#334155' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
               <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} /> 
               <span style={{ color: '#facc15' }}>★★★★★</span> & Up <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.8rem' }}>(120)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
               <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} /> 
               <span style={{ color: '#facc15' }}>★★★★</span><span style={{ color: '#cbd5e1' }}>★</span> <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.8rem' }}>(98)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
               <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} /> 
               <span style={{ color: '#facc15' }}>★★★</span><span style={{ color: '#cbd5e1' }}>★★</span> <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.8rem' }}>(45)</span>
            </label>
         </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Price</h3>
         <div style={{ display: 'flex', alignItems: 'center', height: '24px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white', zIndex: 2 }}></div>
            <div style={{ flex: 1, height: '4px', background: '#06b6d4', margin: '0 -2px', zIndex: 1 }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white', zIndex: 2 }}></div>
         </div>
      </div>
      
    </div>
  );
}
