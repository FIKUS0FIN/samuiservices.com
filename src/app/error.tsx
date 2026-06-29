'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-surface flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-3xl font-bold text-text-main">Something went wrong!</h2>
        <p className="text-text-muted text-lg">An unexpected error occurred.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button
            onClick={() => reset()}
            variant="primary"
            className="w-full sm:w-auto px-8 py-3 font-medium"
          >
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
  );
}
