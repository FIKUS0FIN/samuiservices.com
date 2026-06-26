'use client';

import { useState } from 'react';
import { toggleFavorite } from '@/app/actions/favorites';

interface FavoriteToggleProps {
  listingId: string;
  initialIsFavorited: boolean;
}

export function FavoriteToggle({ listingId, initialIsFavorited }: FavoriteToggleProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if this is inside a link
    
    if (loading) return;
    
    setLoading(true);
    
    // Optimistic update
    setIsFavorited(!isFavorited);
    
    const result = await toggleFavorite(listingId);
    
    if (result.error) {
      alert(result.error);
      setIsFavorited(isFavorited); // Revert on error
    } else if (result.isFavorited !== undefined) {
      setIsFavorited(result.isFavorited);
    }
    
    setLoading(false);
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10,
        transition: 'transform 0.2s ease',
        transform: loading ? 'scale(0.9)' : 'scale(1)',
      }}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill={isFavorited ? "var(--accent-color)" : "none"} 
        stroke={isFavorited ? "var(--accent-color)" : "currentColor"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
