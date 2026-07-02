"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Listing, Category, Island } from '@prisma/client';

type ListingWithRelations = Listing & { category: Category | null; island: Island | null };

export function ActiveListings({ listings, totalCount }: { listings: ListingWithRelations[], totalCount?: number }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const displayCount = totalCount !== undefined ? totalCount : listings.length;
  const showSearch = displayCount > 10;

  const filteredListings = showSearch && searchQuery.trim() !== ''
    ? listings.filter(listing => 
        listing.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : listings;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-headline-sm font-bold text-on-surface m-0">Active Listings ({displayCount})</h2>
        {showSearch && (
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-surface-container rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
        )}
      </div>

      {listings.length === 0 ? (
        <Card className="p-12 text-center bg-surface-container-lowest border border-outline-variant shadow-level-1 rounded-card">
          <p className="text-on-surface-variant text-body-lg mb-4">You don&apos;t have any listings yet.</p>
          <Link href="/add-listing">
            <Button variant="primary">Create Your First Listing</Button>
          </Link>
        </Card>
      ) : filteredListings.length === 0 ? (
        <Card className="p-12 text-center bg-surface-container-lowest border border-outline-variant shadow-level-1 rounded-card">
          <p className="text-on-surface-variant text-body-lg">No listings found matching "{searchQuery}".</p>
        </Card>
      ) : (
        filteredListings.map(listing => (
          <Card key={listing.id} className="flex flex-col md:flex-row justify-between md:items-center p-6 mb-4 bg-surface-container-lowest border border-outline-variant shadow-level-1 rounded-card transition-shadow hover:shadow-level-2 gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-16 bg-surface-container-highest rounded-md overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {listing.image && <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-title-lg font-bold text-on-surface m-0">{listing.name}</h4>
                  {listing.isPremium && (
                    <span className="bg-primary-container text-on-primary-container text-[0.7rem] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      Premium
                    </span>
                  )}
                </div>
                <div className="text-on-surface-variant text-body-sm">
                  {listing.category?.name || 'Uncategorized'} • {listing.island?.name || 'Unknown Location'}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {!listing.isPremium && (
                <Button variant="secondary" className="px-4 py-2 text-sm bg-surface-container hover:bg-surface-container-highest border-none text-on-surface font-medium">
                  Upgrade
                </Button>
              )}
              <Link href={`/dashboard/edit/${listing.id}`}>
                <Button variant="secondary" className="px-4 py-2 text-sm bg-surface-container hover:bg-surface-container-highest border-none text-on-surface font-medium">Edit</Button>
              </Link>
              <Link href={`/listing/${listing.slug}`}>
                <Button variant="secondary" className="px-4 py-2 text-sm bg-surface-container hover:bg-surface-container-highest border-none text-on-surface font-medium">View Public</Button>
              </Link>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
