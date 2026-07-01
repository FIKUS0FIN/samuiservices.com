'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function NavLinks() {
  const pathname = usePathname();
  const isSamuiActive = pathname?.startsWith('/samui') ?? false;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (isSamuiActive) {
    return (
      <div className="hidden md:flex items-center gap-6 font-body text-body-md font-medium">
        <div 
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
           <Link href="/samui" className="text-primary transition-colors font-bold flex items-center gap-1">
             Koh Samui
             <ChevronDown className="w-4 h-4" />
           </Link>
           {dropdownOpen && (
             <div className="absolute top-full left-0 mt-4 w-48 bg-surface border border-outline-muted rounded-md shadow-lg py-2 z-50">
                <Link href="/samui/markets" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Markets</Link>
                <Link href="/samui/airport" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Airport</Link>
                <Link href="/samui/weather" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Weather</Link>
                <Link href="/samui/malls" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Malls</Link>
                <Link href="/samui/transportation" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Transportation</Link>
                <Link href="/samui/hospitals" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Hospitals</Link>
                <Link href="/samui/piers" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Piers</Link>
                <Link href="/samui/post-offices" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Post Offices</Link>
                <Link href="/samui/calendar" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Events Calendar</Link>
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-6 font-body text-body-md font-medium">
      <Link href="/samui" className="text-text-main hover:text-primary transition-colors">Koh Samui</Link>
      <Link href="/phangan" className="text-text-main hover:text-primary transition-colors">Koh Phangan</Link>
      <Link href="/tao" className="text-text-main hover:text-primary transition-colors">Koh Tao</Link>
    </div>
  );
}
