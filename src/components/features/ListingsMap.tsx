/* eslint-disable @next/next/no-img-element */
'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Listing, Category } from '@prisma/client';
import Link from 'next/link';

// Fix for default marker icons in Leaflet with Webpack/Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type BusinessWithRelations = Listing & { category?: Category };

interface ListingsMapProps {
  businesses: BusinessWithRelations[];
  center?: [number, number]; // [lat, lng]
  zoom?: number;
}

const DISTRICT_ZONES = [
  { name: 'Chaweng / Bo Put', center: [9.535, 100.035], radius: 3500, gradientId: 'grad-boput', colors: ['#00c6ff', '#0072ff'] },
  { name: 'Lamai / Maret', center: [9.470, 100.045], radius: 3000, gradientId: 'grad-maret', colors: ['#f857a6', '#ff5858'] },
  { name: 'Mae Nam', center: [9.570, 99.990], radius: 3000, gradientId: 'grad-maenam', colors: ['#11998e', '#38ef7d'] },
  { name: 'Nathon / Ang Thong', center: [9.530, 99.930], radius: 2500, gradientId: 'grad-nathon', colors: ['#F2994A', '#F2C94C'] },
  { name: 'Taling Ngam / South', center: [9.440, 99.950], radius: 3500, gradientId: 'grad-taling', colors: ['#8E2DE2', '#4A00E0'] },
];

export default function ListingsMap({ businesses, center = [9.5120, 100.0136], zoom = 11 }: ListingsMapProps) {
  // Center defaults to Koh Samui
  
  // Filter out businesses without coordinates
  const markers = businesses.filter(b => b.lat && b.lng);

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}>
      
      {/* SVG Defs for beautiful UI/UX gradients */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          {DISTRICT_ZONES.map(d => (
            <radialGradient id={d.gradientId} key={d.gradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={d.colors[0]} stopOpacity={0.5} />
              <stop offset="100%" stopColor={d.colors[1]} stopOpacity={0.0} />
            </radialGradient>
          ))}
        </defs>
      </svg>

      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-custom"
        />

        {/* District Highlight Circles */}
        {center[0] > 9.3 && center[0] < 9.65 && DISTRICT_ZONES.map(d => (
          <Circle 
            key={d.name}
            center={d.center as [number, number]}
            radius={d.radius}
            pathOptions={{
              fillColor: `url(#${d.gradientId})`,
              fillOpacity: 1,
              color: d.colors[0],
              weight: 2,
              opacity: 0.4,
              dashArray: '5, 5'
            }}
          >
            <Tooltip direction="center" permanent={false} opacity={0.8} className="font-bold border-0 shadow-lg text-sm rounded-xl px-3 py-1 bg-white/90 backdrop-blur-md text-on-surface">
              {d.name} District
            </Tooltip>
          </Circle>
        ))}
        {markers.map((business) => (
          <Marker 
            key={business.id} 
            position={[business.lat!, business.lng!]} 
            icon={icon}
          >
            <Popup>
              <div style={{ padding: '0.5rem', minWidth: '200px' }}>
                {business.image && (
                  <img src={business.image} alt={business.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} />
                )}
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{business.name}</h4>
                <div style={{ color: 'var(--primary-color)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {business.category?.name || 'Uncategorized'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--accent-color)' }}>★ {business.averageRating.toFixed(1)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({business.reviewCount})</span>
                </div>
                <Link href={`/listing/${business.slug}`} style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.4rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
