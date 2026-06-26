'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

export default function ListingsMap({ businesses, center = [9.5120, 100.0136], zoom = 11 }: ListingsMapProps) {
  // Center defaults to Koh Samui
  
  // Filter out businesses without coordinates
  const markers = businesses.filter(b => b.lat && b.lng);

  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
                <Link href={`/listing/${business.id}`} style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.4rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>
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
