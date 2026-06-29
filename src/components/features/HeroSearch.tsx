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
      className="fade-in-up glass-panel p-4 md:p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 items-stretch w-full max-w-4xl mx-auto transition-transform duration-300 focus-within:scale-[1.02]"
      style={{ animationDelay: '0.2s' }}
    >
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Plumbers, Deliveries, Construction..."
          className="w-full pl-10 pr-4 py-4 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary text-on-surface bg-surface-container-lowest"
        />
      </div>
      
      <div className="relative w-full md:w-64">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full pl-10 pr-4 py-4 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary text-on-surface appearance-none bg-surface-container-lowest"
          style={{
            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23424754%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '10px auto'
          }}
        >
          <option value="Samui">Koh Samui</option>
          <option value="Phangan">Koh Phangan</option>
          <option value="Tao">Koh Tao</option>
        </select>
      </div>
      
      <button 
        type="submit" 
        className="bg-primary text-on-primary px-10 py-4 rounded-lg font-label-md text-label-md font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95"
      >
        Search
      </button>
    </form>
  );
}
