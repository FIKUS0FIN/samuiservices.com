/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { LogoutButton } from '@/components/features/LogoutButton';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-surface/80 backdrop-blur-[12px] border-b border-outline-muted sticky top-0 z-[100]">
      <div className="container mx-auto px-6 py-4 flex flex-row justify-between items-center">
        {/* Brand logo and desktop navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading font-bold text-headline-sm text-primary no-underline">
            Samui Services
          </Link>

          <NavLinks />
        </div>

        {/* Desktop actions (Hidden on Mobile) */}
        <div className="hidden md:flex gap-4 items-center">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="secondary" className="!px-4 !py-2 !text-sm flex items-center gap-2">
                  {session.user?.image && <img src={session.user.image} alt="Avatar" className="w-5 h-5 rounded-full" />}
                  Dashboard
                </Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/dashboard">
              <Button variant="secondary" className="!px-4 !py-2 !text-sm">Login</Button>
            </Link>
          )}
          <Link href="/add-listing">
            <Button variant="primary" className="!px-4 !py-2 !text-sm">Add Business</Button>
          </Link>
        </div>

        {/* Mobile menu drawer (Hidden on Desktop) */}
        <MobileMenu session={session} />
      </div>
    </nav>
  );
}

