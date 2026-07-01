'use client';

import { Category } from '@prisma/client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryWithChildren extends Category {
  children: Category[];
}

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: { name: string, icon: string };
  island: { name: string };
}

interface FilterSidebarProps {
  categories: CategoryWithChildren[];
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Extract island from pathname (e.g., '/samui' -> 'samui')
  const island = pathname.split('/')[1] || 'all';

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
    const action = checked ? 'set' : 'remove';
    router.push('?' + createQueryString('category', slug, action), { scroll: false });
  };

  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    location: true,
    rating: true,
    price: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced fetch
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setIsDropdownVisible(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const url = `/api/search?q=${encodeURIComponent(searchQuery)}${island !== 'all' ? `&island=${island}` : ''}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json() as { results: SearchResult[] };
          setSuggestions(data.results);
          setIsDropdownVisible(true);
        }
      } catch (err) {
        console.error('Failed to fetch search suggestions', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, island]);

  const handleSearchSubmit = (query: string) => {
    setIsDropdownVisible(false);
    router.push('?' + createQueryString('q', query, 'set'), { scroll: false });
  };

  return (
    <aside className="w-full">
      <div className="mb-8 relative" ref={dropdownRef}>
        <Input 
          type="search" 
          placeholder="Search businesses..." 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value === '') handleSearchSubmit(''); // Clear instantly
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit(searchQuery);
            }
          }}
          fullWidth
        />
        
        {isDropdownVisible && (searchQuery.length >= 3) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant rounded-card shadow-level-2 z-50 overflow-hidden max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-on-surface-variant text-body-sm">Loading...</div>
            ) : suggestions.length > 0 ? (
              <ul className="flex flex-col m-0 p-0 list-none">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.id} className="border-b border-outline-variant last:border-0">
                    <Link 
                      href={`/listing/${suggestion.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-surface transition-colors no-underline text-inherit"
                    >
                      {suggestion.image ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-surface-container">
                          <img src={suggestion.image} alt={suggestion.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-on-primary font-bold">
                          {suggestion.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium text-body-md text-on-surface truncate">{suggestion.name}</span>
                        <span className="text-body-sm text-on-surface-variant truncate">
                          {suggestion.category?.name} • {suggestion.island?.name}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
                <li className="bg-surface-container-low">
                  <button 
                    onClick={() => handleSearchSubmit(searchQuery)}
                    className="w-full p-3 text-center text-primary font-medium text-body-sm hover:underline border-none bg-transparent cursor-pointer"
                  >
                    View all results for &quot;{searchQuery}&quot;
                  </button>
                </li>
              </ul>
            ) : (
              <div className="p-4 text-center text-on-surface-variant text-body-sm">No results found</div>
            )}
          </div>
        )}
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-title-lg font-bold text-on-surface m-0">Categories</h3>
        {currentCategories.length > 0 && (
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('category');
              router.push('?' + params.toString(), { scroll: false });
            }}
            className="text-body-sm text-primary hover:underline border-none bg-transparent cursor-pointer p-0"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {categories.filter(cat => cat.parentId === null).map(parent => (
          <div key={parent.id} className="w-full border-b border-outline-variant pb-4 last:border-0 last:pb-0">
            <button
              onClick={() => toggleSection(parent.slug)}
              className="flex justify-between items-center w-full bg-transparent border-none p-0 cursor-pointer text-left hover:opacity-80 transition-opacity"
            >
              <h4 className="text-label-lg font-bold uppercase tracking-wide text-on-surface m-0">{parent.name}</h4>
              {openSections[parent.slug] !== false ? <ChevronUp size={18} className="text-on-surface-variant" /> : <ChevronDown size={18} className="text-on-surface-variant" />}
            </button>

            {openSections[parent.slug] !== false && (
              <div className="flex flex-col gap-3 mt-4">
                {parent.children.map(child => {
                  const isChecked = currentCategories.includes(child.slug);
                  return (
                    <label key={child.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleCategoryChange(child.slug, e.target.checked)}
                          className="peer appearance-none w-5 h-5 border-2 border-outline rounded-sm checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                        />
                        <svg className="absolute w-3 h-3 text-on-primary left-1 top-1 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={`text-body-md transition-colors ${isChecked ? 'text-on-surface font-semibold' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        {child.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
