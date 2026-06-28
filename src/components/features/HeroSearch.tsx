'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Samui');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/all?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/all');
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="fade-in-up flex flex-col md:flex-row items-center bg-surface-card rounded-global md:rounded-pill p-2 md:p-1.5 shadow-level-2 max-w-4xl mx-auto w-full gap-2 md:gap-0 border border-outline-muted"
      style={{ animationDelay: '0.2s' }}
    >
      <div className="flex-1 flex items-center px-4 w-full h-[48px] focus-within:ring-2 focus-within:ring-primary focus-within:rounded-pill transition-shadow">
        <Search className="text-outline w-5 h-5 mr-3 flex-shrink-0" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for services (e.g., Plumbers, Construction)..."
          className="w-full bg-transparent border-none outline-none text-text-main placeholder:text-text-muted text-body-md"
        />
      </div>
      
      <div className="hidden md:block w-px h-8 bg-outline-muted mx-2"></div>
      
      <div className="flex items-center px-4 w-full md:w-auto h-[48px] focus-within:ring-2 focus-within:ring-primary focus-within:rounded-pill transition-shadow border-t border-outline-muted md:border-none">
        <MapPin className="text-outline w-5 h-5 mr-2 flex-shrink-0" />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-transparent border-none outline-none text-text-main font-semibold text-body-md cursor-pointer pr-8 appearance-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23424754%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            backgroundSize: '10px auto'
          }}
        >
          <option value="Samui">Koh Samui</option>
          <option value="Phangan">Koh Phangan</option>
          <option value="Tao">Koh Tao</option>
        </select>
      </div>
      
      <Button type="submit" variant="primary" className="w-full md:w-auto h-[48px] !px-8 ml-0 md:ml-2">
        Find Services
      </Button>
    </form>
  );
}
