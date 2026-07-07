/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
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
  Calendar,
  LogOut,
  LayoutDashboard,
  Plus
} from 'lucide-react';

interface MobileMenuProps {
  session: Session | null;
}

export function MobileMenu({ session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(true);
  const pathname = usePathname();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Toggle Button */}
      <button 
        onClick={toggleMenu} 
        aria-label="Toggle navigation menu"
        className="p-2 -mr-2 text-on-surface hover:text-primary transition-colors focus:outline-none bg-transparent border-none cursor-pointer"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-surface/98 backdrop-blur-[16px] flex flex-col p-6 animate-fade-in overflow-y-auto">
          {/* Header Row */}
          <div className="flex justify-between items-center mb-8">
            <Link 
              href="/" 
              onClick={closeMenu} 
              className="font-heading font-bold text-headline-sm text-primary no-underline"
            >
              Samui Services
            </Link>
            <button 
              onClick={closeMenu} 
              aria-label="Close navigation menu"
              className="p-2 -mr-2 text-on-surface hover:text-primary transition-colors focus:outline-none bg-transparent border-none cursor-pointer"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-1">
                Islands
              </span>
              <div className="flex flex-col gap-1">
                {/* Koh Samui Section */}
                <div className="flex flex-col border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low/40">
                  <div className="flex justify-between items-center px-4 py-3">
                    <Link 
                      href="/samui" 
                      onClick={closeMenu}
                      className={`font-heading font-semibold text-title-md transition-colors no-underline ${
                        pathname === '/samui' ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      Koh Samui
                    </Link>
                    <button 
                      onClick={() => setIsExploreOpen(!isExploreOpen)}
                      className="p-1 text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                      aria-label="Toggle Koh Samui categories"
                    >
                      {isExploreOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Sub-links for Koh Samui */}
                  {isExploreOpen && (
                    <div className="grid grid-cols-2 gap-2 p-3 bg-surface-container-lowest/50 border-t border-outline-variant/20 animate-fade-in">
                      <Link href="/samui/beaches" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Umbrella className="w-4 h-4 text-primary" />
                        <span>Beaches</span>
                      </Link>
                      <Link href="/samui/rentals" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Car className="w-4 h-4 text-primary" />
                        <span>Rentals</span>
                      </Link>
                      <Link href="/samui/weather" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Cloud className="w-4 h-4 text-primary" />
                        <span>Weather</span>
                      </Link>
                      <Link href="/samui/transportation" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Bus className="w-4 h-4 text-primary" />
                        <span>Transport</span>
                      </Link>
                      <Link href="/samui/markets" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Store className="w-4 h-4 text-primary" />
                        <span>Markets</span>
                      </Link>
                      <Link href="/samui/airport" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Plane className="w-4 h-4 text-primary" />
                        <span>Airport</span>
                      </Link>
                      <Link href="/samui/malls" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <span>Malls</span>
                      </Link>
                      <Link href="/samui/hospitals" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Hospital className="w-4 h-4 text-primary" />
                        <span>Hospitals</span>
                      </Link>
                      <Link href="/samui/piers" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Ship className="w-4 h-4 text-primary" />
                        <span>Piers</span>
                      </Link>
                      <Link href="/samui/post-offices" onClick={closeMenu} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>Post Offices</span>
                      </Link>
                      <Link href="/samui/calendar" onClick={closeMenu} className="col-span-2 flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low text-sm text-on-surface-variant no-underline">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Events Calendar</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Koh Phangan */}
                <Link 
                  href="/phangan" 
                  onClick={closeMenu}
                  className={`px-4 py-3 border border-outline-variant/30 rounded-xl bg-surface-container-low/40 font-heading font-semibold text-title-md transition-colors no-underline ${
                    pathname === '/phangan' ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  Koh Phangan
                </Link>

                {/* Koh Tao */}
                <Link 
                  href="/tao" 
                  onClick={closeMenu}
                  className={`px-4 py-3 border border-outline-variant/30 rounded-xl bg-surface-container-low/40 font-heading font-semibold text-title-md transition-colors no-underline ${
                    pathname === '/tao' ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  Koh Tao
                </Link>
              </div>
            </div>
          </div>

          {/* User Account / Action Panel */}
          <div className="mt-auto pt-6 border-t border-outline-variant/40 flex flex-col gap-4">
            {session ? (
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" onClick={closeMenu} className="w-full no-underline">
                  <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2 !py-3.5">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Avatar" className="w-6 h-6 rounded-full" />
                    ) : (
                      <LayoutDashboard className="w-5 h-5" />
                    )}
                    <span>Go to Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    closeMenu();
                  }} 
                  className="flex items-center justify-center gap-2 !py-3.5 text-on-surface hover:text-error border-error-variant/30"
                >
                  <LogOut className="w-5 h-5 text-error" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Link href="/dashboard" onClick={closeMenu} className="w-full no-underline">
                <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2 !py-3.5">
                  <span>Login</span>
                </Button>
              </Link>
            )}

            <Link href="/add-listing" onClick={closeMenu} className="w-full no-underline">
              <Button variant="primary" fullWidth className="flex items-center justify-center gap-2 !py-3.5 shadow-md">
                <Plus className="w-5 h-5" />
                <span>Add Business</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
