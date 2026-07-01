'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  Umbrella, 
  Car, 
  Cloud, 
  Bus, 
  Store, 
  Plane, 
  ShoppingBag, 
  Hospital, 
  Ship, 
  Mail, 
  Calendar 
} from 'lucide-react';

export function NavLinks() {
  const pathname = usePathname();
  const isSamuiActive = pathname?.startsWith('/samui') ?? false;

  if (isSamuiActive) {
    return (
      <div className="hidden md:flex items-center gap-6 font-body text-body-md font-medium">
        
        {/* Explore Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors py-2">
            Explore Samui
            <ChevronDown className="w-5 h-5" />
          </button>
          
          {/* Mega Dropdown Desktop */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-surface-container-lowest shadow-lg rounded-xl border border-outline-variant/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6 grid grid-cols-2 gap-3">
            
            <Link href="/samui/beaches" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Umbrella className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Beaches</span>
            </Link>
            
            <Link href="/samui/rentals" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Car className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Rentals</span>
            </Link>
            
            <Link href="/samui/weather" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Cloud className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Weather</span>
            </Link>
            
            <Link href="/samui/transportation" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Bus className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Transportation</span>
            </Link>
            
            <Link href="/samui/markets" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Store className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Markets</span>
            </Link>
            
            <Link href="/samui/airport" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Plane className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Airport</span>
            </Link>
            
            <Link href="/samui/malls" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <ShoppingBag className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Malls</span>
            </Link>
            
            <Link href="/samui/hospitals" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Hospital className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Hospitals</span>
            </Link>
            
            <Link href="/samui/piers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Ship className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Piers</span>
            </Link>
            
            <Link href="/samui/post-offices" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Mail className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Post Offices</span>
            </Link>
            
            <Link href="/samui/calendar" className="col-span-2 flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low group/item transition-colors">
              <Calendar className="w-10 h-10 text-primary bg-primary-container/20 p-2 rounded-md" />
              <span className="font-label-md text-on-surface group-hover/item:text-primary transition-colors">Events Calendar</span>
            </Link>
            
          </div>
        </div>
        
        {/* Island Selector Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors py-2 border-l border-outline-variant/30 pl-6">
            Koh Samui
            <ChevronDown className="w-5 h-5" />
          </button>
          <div className="absolute top-full right-0 mt-2 w-48 bg-surface-container-lowest shadow-lg rounded-xl border border-outline-variant/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
            <Link href="/samui" className="block px-6 py-3 font-label-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors">Koh Samui</Link>
            <Link href="/phangan" className="block px-6 py-3 font-label-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors">Koh Phangan</Link>
            <Link href="/tao" className="block px-6 py-3 font-label-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors">Koh Tao</Link>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-6 font-body text-body-md font-medium">
      <Link href="/samui" className="text-on-surface-variant hover:text-primary transition-colors">Koh Samui</Link>
      <Link href="/phangan" className="text-on-surface-variant hover:text-primary transition-colors">Koh Phangan</Link>
      <Link href="/tao" className="text-on-surface-variant hover:text-primary transition-colors">Koh Tao</Link>
    </div>
  );
}

