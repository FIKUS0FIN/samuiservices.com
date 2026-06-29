import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-8xl font-extrabold text-primary drop-shadow-sm">404</h1>
        <h2 className="text-3xl font-bold text-text-main">Page Not Found</h2>
        <p className="text-text-muted text-lg">
          Sorry, we couldn&apos;t find the page you were looking for. It might have been moved or deleted.
        </p>
        <div className="pt-6">
          <Link href="/">
            <Button variant="primary" className="px-8 py-3 text-lg font-medium">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
