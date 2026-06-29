'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-8xl font-extrabold text-primary drop-shadow-sm">500</h1>
            <h2 className="text-3xl font-bold text-text-main">Internal Server Error</h2>
            <p className="text-text-muted text-lg">
              Oops! Something went wrong on our end. We&apos;re looking into it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button onClick={() => reset()} variant="primary" className="w-full sm:w-auto px-8 py-3 font-medium">
                Try again
              </Button>
              <Link href="/">
                <Button variant="secondary" className="w-full sm:w-auto px-8 py-3 font-medium border-primary text-primary hover:bg-primary/5">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
