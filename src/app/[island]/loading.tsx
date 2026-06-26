import { Card } from '@/components/ui/Card';

export default function Loading() {
  return (
    <div className="split-layout">
      {/* Sidebar Filters Skeleton */}
      <div className="split-layout-sidebar">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: '2rem' }}></div>

        <div className="skeleton skeleton-text" style={{ width: '80%', height: '40px', marginBottom: '1.5rem' }}></div>

        <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: '1rem' }}></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <div className="skeleton" style={{ width: '16px', height: '16px', borderRadius: '4px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '60%', margin: 0 }}></div>
          </div>
        ))}
      </div>

      {/* Results List Skeleton */}
      <div className="split-layout-main">
        <div className="flex justify-between items-center mb-6">
          <div className="skeleton skeleton-text" style={{ width: '150px', margin: 0 }}></div>
          <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '8px' }}></div>
        </div>

        <div className="flex flex-col gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="business-card-layout border-0 shadow-sm" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="skeleton business-card-image" style={{ borderRadius: 0 }}></div>
              <div className="flex-1 flex flex-col justify-center p-4">
                <div className="flex justify-between mb-2">
                  <div className="skeleton skeleton-text" style={{ width: '40%', margin: 0 }}></div>
                </div>
                <div className="skeleton skeleton-title" style={{ width: '60%', margin: '0.5rem 0' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '30%', margin: 0 }}></div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Skeleton */}
      <div className="split-layout-map">
        <div className="skeleton h-full w-full"></div>
      </div>
    </div>
  );
}
