import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface pt-16 pb-8 border-t border-outline-variant/10 mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-heading font-extrabold text-xl text-white tracking-tight">
              Samui <span className="text-secondary-fixed">Services</span>
            </Link>
            <p className="text-body-sm text-slate-300 leading-relaxed max-w-sm">
              The premier business directory for the Gulf of Thailand islands. Discover verified local services, premium restaurants, accommodations, wellness clinics, and construction experts in Koh Samui, Koh Phangan, and Koh Tao.
            </p>
            <div className="flex gap-4 mt-2">
              <span className="text-[12px] bg-white/10 text-slate-200 px-3 py-1 rounded-full font-medium">
                ★ Community Curated
              </span>
              <span className="text-[12px] bg-white/10 text-slate-200 px-3 py-1 rounded-full font-medium">
                ✓ Verified Listings
              </span>
            </div>
          </div>

          {/* Column 2: Explore Islands */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-white text-headline-sm mb-1 uppercase tracking-wider text-xs opacity-80">
              Explore Islands
            </h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              <li>
                <Link href="/samui" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Koh Samui Services
                </Link>
              </li>
              <li>
                <Link href="/phangan" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Koh Phangan Services
                </Link>
              </li>
              <li>
                <Link href="/tao" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Koh Tao Services
                </Link>
              </li>
              <li>
                <Link href="/add-listing" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200 font-semibold text-secondary-fixed">
                  Add Your Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Categories */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-white text-headline-sm mb-1 uppercase tracking-wider text-xs opacity-80">
              Popular Categories
            </h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              <li>
                <Link href="/?category=gastronomy" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Restaurants & Dining
                </Link>
              </li>
              <li>
                <Link href="/?category=lodging" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Hotels & Resorts
                </Link>
              </li>
              <li>
                <Link href="/?category=home-construction" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Contractors & Builders
                </Link>
              </li>
              <li>
                <Link href="/?category=health-wellness" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Spas & Massage
                </Link>
              </li>
              <li>
                <Link href="/?category=transportation" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Car & Bike Rental
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Local Island Guides */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-white text-headline-sm mb-1 uppercase tracking-wider text-xs opacity-80">
              Koh Samui Guides
            </h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              <li>
                <Link href="/samui/weather" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Samui Weather & Season Guide
                </Link>
              </li>
              <li>
                <Link href="/samui/transportation" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Getting Around Koh Samui
                </Link>
              </li>
              <li>
                <Link href="/samui/hospitals" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Clinics & Medical Facilities
                </Link>
              </li>
              <li>
                <Link href="/samui/markets" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Local Walking Street Markets
                </Link>
              </li>
              <li>
                <Link href="/samui/piers" className="text-body-sm text-slate-300 hover:text-white transition-colors duration-200">
                  Ferry Piers & Boat Schedules
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-body-sm text-slate-400 m-0">
            &copy; {new Date().getFullYear()} Samui Services. All rights reserved. Made for visitors and residents in Thailand.
          </p>
          <div className="flex gap-6">
            <Link href="/dashboard" className="text-body-sm text-slate-400 hover:text-white transition-colors duration-200">
              Dashboard
            </Link>
            <Link href="/docs" className="text-body-sm text-slate-400 hover:text-white transition-colors duration-200">
              API Docs
            </Link>
            <Link href="/auth/signin" className="text-body-sm text-slate-400 hover:text-white transition-colors duration-200">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
