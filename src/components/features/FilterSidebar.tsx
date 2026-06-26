'use client';

import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/Input';

interface FilterSidebarProps {
  categories: Category[];
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current state from URL
  const currentCategories = searchParams.getAll('category');
  const currentQuery = searchParams.get('q') || '';

  const createQueryString = useCallback(
    (name: string, value: string, action: 'add' | 'remove' | 'set' = 'set') => {
      const params = new URLSearchParams(searchParams.toString());
      if (action === 'set') {
        if (value) params.set(name, value);
        else params.delete(name);
      } else if (action === 'add') {
        params.append(name, value);
      } else if (action === 'remove') {
        const values = params.getAll(name).filter(v => v !== value);
        params.delete(name);
        values.forEach(v => params.append(name, v));
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (slug: string, checked: boolean) => {
    const action = checked ? 'add' : 'remove';
    router.push('?' + createQueryString('category', slug, action), { scroll: false });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push('?' + createQueryString('q', e.target.value, 'set'), { scroll: false });
  };

  return (
    <aside>
      <div style={{ marginBottom: '2rem' }}>
        <Input 
          type="search" 
          placeholder="Search businesses..." 
          defaultValue={currentQuery}
          onChange={(e) => {
            // Debounce in a real app, but this is simple enough for now
            const val = e.target.value;
            setTimeout(() => {
              if (e.target.value === val) handleSearch(e);
            }, 300);
          }}
          fullWidth
        />
      </div>

      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', marginTop: 0 }}>Categories</h3>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, margin: 0 }}>
        <li>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: currentCategories.length === 0 ? 'var(--primary-color)' : 'var(--text-main)', fontWeight: 500 }}>
            <input 
              type="checkbox" 
              checked={currentCategories.length === 0} 
              onChange={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('category');
                router.push('?' + params.toString(), { scroll: false });
              }} 
            /> All Categories
          </label>
        </li>
        {categories.map((cat) => {
          const isChecked = currentCategories.includes(cat.slug);
          return (
            <li key={cat.slug}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: isChecked ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => handleCategoryChange(cat.slug, e.target.checked)}
                /> {cat.name}
              </label>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
