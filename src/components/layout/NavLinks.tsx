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
        <Link href="/samui/beaches" className="text-text-main hover:text-primary transition-colors">Beaches</Link>
        <Link href="/samui/rentals" className="text-text-main hover:text-primary transition-colors">Rentals</Link>
        <Link href="/samui/weather" className="text-text-main hover:text-primary transition-colors">Weather</Link>
        <Link href="/samui/transportation" className="text-text-main hover:text-primary transition-colors">Transportation</Link>
        
        <div 
          className="relative ml-4"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
           <div className="cursor-pointer text-primary transition-colors font-bold flex items-center gap-1">
             Koh Samui
             <ChevronDown className="w-4 h-4" />
           </div>
           {dropdownOpen && (
               <div className="absolute top-full right-0 mt-4 w-48 bg-surface border border-outline-muted rounded-md shadow-lg py-2 z-50">
                <Link href="/phangan" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Koh Phangan</Link>
                <Link href="/tao" className="block px-4 py-2 hover:bg-surface-hover text-text-main hover:text-primary transition-colors">Koh Tao</Link>
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
