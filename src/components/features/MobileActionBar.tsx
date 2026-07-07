import { Listing } from '@prisma/client';

interface MobileActionBarProps {
  business: Pick<Listing, 'phone' | 'mapLink' | 'website'>;
}

export function MobileActionBar({ business }: MobileActionBarProps) {
  // If no contact links are available, do not render the bar
  if (!business.phone && !business.mapLink && !business.website) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-[12px] border-t border-outline-variant p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 flex items-center gap-3">
      {business.phone && (
        <a 
          href={`tel:${business.phone}`} 
          className="flex-1 bg-primary text-on-primary text-center py-3.5 rounded-xl font-bold shadow-md flex justify-center items-center gap-2 no-underline hover:opacity-90 active:scale-95 transition-all text-sm"
        >
          <span>📞</span> Call
        </a>
      )}
      {business.mapLink && (
        <a 
          href={business.mapLink} 
          target="_blank" 
          rel="noreferrer" 
          className="flex-1 bg-secondary-container text-on-secondary-container text-center py-3.5 rounded-xl font-bold shadow-md flex justify-center items-center gap-2 no-underline hover:opacity-90 active:scale-95 transition-all text-sm"
        >
          <span>📍</span> Map
        </a>
      )}
      {business.website && (
        <a 
          href={business.website} 
          target="_blank" 
          rel="noreferrer" 
          className="w-14 h-14 bg-surface-container flex items-center justify-center rounded-xl border border-outline-variant hover:bg-surface-container-high transition-colors text-lg"
          aria-label="Visit business website"
        >
          🌐
        </a>
      )}
    </div>
  );
}
