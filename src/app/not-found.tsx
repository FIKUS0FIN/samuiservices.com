import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Page Not Found</h2>
      <p className="mb-8 text-gray-600">Sorry, we couldn&apos;t find the page you were looking for.</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
