'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <form onSubmit={handleSearch} className="fade-in-up" style={{ 
      animationDelay: '0.2s',
      maxWidth: '800px', 
      margin: '0 auto', 
      background: 'white',
      padding: '0.35rem', 
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for services (e.g., Plumbers, Deliveries, Construction)..." 
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            color: '#334155',
            backgroundColor: 'transparent'
          }}
          className="hero-search-input"
        />
        <span style={{ color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}>⌕</span>
      </div>
      
      <div style={{ width: '1px', height: '30px', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>
      
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', color: '#334155', fontWeight: 600 }}>
        <span style={{ color: '#64748b', marginRight: '0.5rem', fontSize: '1.1rem' }}>📍</span>
        <select style={{ 
          border: 'none', 
          outline: 'none', 
          background: 'transparent', 
          fontWeight: 600, 
          color: '#334155',
          fontSize: '0.95rem',
          cursor: 'pointer',
          WebkitAppearance: 'none',
          paddingRight: '1rem',
          backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23334155%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: '10px auto'
        }}>
          <option>Samui</option>
          <option>Phangan</option>
          <option>Tao</option>
        </select>
      </div>
      
      <button type="submit" style={{ 
        padding: '0.75rem 1.5rem', 
        fontSize: '0.95rem', 
        borderRadius: '6px',
        background: '#06b6d4',
        color: 'white',
        border: 'none',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.2s ease-in-out',
        marginLeft: '0.5rem'
      }}>
        Find Services
      </button>
      <style>{`
        .hero-search-input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </form>
  );
}
