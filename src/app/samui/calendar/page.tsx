import { Metadata } from 'next';
import Image from 'next/image';
import { Calendar, ShieldCheck, CalendarRange, Compass } from 'lucide-react';
import { InteractiveCalendar } from '@/components/features/InteractiveCalendar';

export const metadata: Metadata = {
  title: 'Koh Samui Events Calendar & National Holidays (2026)',
  description: 'Plan your trip with our interactive 2026 Koh Samui events calendar. Track Thai national holidays, Songkran water festival, full moon parties, & local events! ✓',
};

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1528605248644-14dd04022da1.jpg?auto=format&fit=crop&q=80&w=2000"
            alt="Beautiful Loy Krathong lantern festival in Thailand" 
            fill
            className="object-cover"
            priority sizes="(max-width: 768px) 100vw, 1200px"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Island Events Calendar
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Plan your tropical getaway around traditional Thai festivals, cultural holidays, world-famous full moon parties, and local regattas.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Interactive Calendar Component */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <CalendarRange className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Interactive 2026 Calendar</h2>
          </div>
          
          <InteractiveCalendar />
        </section>

        {/* Detailed Events Guide for SEO & E-E-A-T */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <Compass className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Major Annual Celebrations on Koh Samui</h2>
          </div>
          
          <div className="space-y-8">
            
            {/* Songkran */}
            <div className="flex flex-col md:flex-row gap-6 border-b border-outline-variant/30 pb-6">
              <div className="md:w-1/4 shrink-0">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 text-center">
                  <span className="block font-bold text-primary text-lg">April 13 - 15</span>
                  <span className="text-xs text-text-muted">Annual Water Festival</span>
                </div>
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-text-main text-lg mb-2 flex items-center gap-2">
                  Songkran (Thai New Year) <span className="bg-amber-50 text-amber-800 text-[10px] px-2 py-0.5 rounded-md font-bold border border-amber-200">National Holiday</span>
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  The most famous festival in Thailand, celebrating the traditional New Year with nationwide water fights. On Koh Samui, Chaweng Beach Road and Fisherman&apos;s Village become massive street parties. Respectful water splashing represents washing away bad luck for the new year.
                </p>
              </div>
            </div>

            {/* Samui Regatta */}
            <div className="flex flex-col md:flex-row gap-6 border-b border-outline-variant/30 pb-6">
              <div className="md:w-1/4 shrink-0">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 text-center">
                  <span className="block font-bold text-primary text-lg">Mid-July</span>
                  <span className="text-xs text-text-muted">International Yachting</span>
                </div>
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-text-main text-lg mb-2 flex items-center gap-2">
                  The Samui Regatta <span className="bg-blue-50 text-blue-800 text-[10px] px-2 py-0.5 rounded-md font-bold border border-blue-200">Local Event</span>
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Asia&apos;s premier sailing event, attracting top international yachting crews and spectators from around the globe. Features daily competitive yacht races off the east coast of Samui and premium beachfront evening cocktail parties.
                </p>
              </div>
            </div>

            {/* Loy Krathong */}
            <div className="flex flex-col md:flex-row gap-6 border-b border-outline-variant/30 pb-6">
              <div className="md:w-1/4 shrink-0">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 text-center">
                  <span className="block font-bold text-primary text-lg">November</span>
                  <span className="text-xs text-text-muted">Festival of Lights</span>
                </div>
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-text-main text-lg mb-2 flex items-center gap-2">
                  Loy Krathong <span className="bg-amber-50 text-amber-800 text-[10px] px-2 py-0.5 rounded-md font-bold border border-amber-200">National Festival</span>
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  A beautiful and serene celebration held on the full moon of the 12th lunar month. Locals float decorated banana-leaf baskets (krathongs) with candles and incense on lakes and the ocean. Best experienced at Chaweng Lake or the Nathon waterfront.
                </p>
              </div>
            </div>

            {/* Full Moon Parties */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 shrink-0">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 text-center">
                  <span className="block font-bold text-primary text-lg">Monthly</span>
                  <span className="text-xs text-text-muted">Lunar Beach Party</span>
                </div>
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-text-main text-lg mb-2 flex items-center gap-2">
                  Full Moon Party (Koh Phangan) <span className="bg-blue-50 text-blue-800 text-[10px] px-2 py-0.5 rounded-md font-bold border border-blue-200">Nearby Event</span>
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  While held on neighboring Koh Phangan (Haad Rin Beach), this massive beach party shapes Samui&apos;s calendar monthly. Thousands of travelers stay on Samui and take night speedboats across the bay to join the neon-painted beach celebration.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Local Expert Verification (E-E-A-T) */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/50 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-text-main text-lg mb-1">Local Expert Verified</h4>
            <p className="text-text-muted text-sm leading-relaxed">
              This guide was researched, compiled, and is regularly updated by our Koh Samui editorial team. We visit every location first-hand and check local listings to ensure you receive accurate and trustworthy information.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
