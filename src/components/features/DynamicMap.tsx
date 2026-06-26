'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Leaflet map with SSR disabled
const ListingsMap = dynamic(() => import('./ListingsMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '500px', width: '100%', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading map...</p>
    </div>
  )
});

export default ListingsMap;
