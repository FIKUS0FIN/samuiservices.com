'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get('sort') || 'recommended';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'recommended') {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (value: string) => {
    router.push(pathname + '?' + createQueryString('sort', value), { scroll: false });
  };

  return (
    <select 
      value={currentSort} 
      onChange={(e) => handleSortChange(e.target.value)}
      className="input-field w-auto py-2 bg-surface-container-low border border-outline-variant rounded-lg p-2 text-on-surface font-body-md cursor-pointer transition-all focus:border-primary"
    >
      <option value="recommended">Recommended</option>
      <option value="highest-rated">Highest Rated</option>
      <option value="newest">Newest</option>
    </select>
  );
}
