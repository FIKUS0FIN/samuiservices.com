import { Card } from '@/components/ui/Card';

export default function Loading() {
  return (
    <div>
      {/* Hero Banner Skeleton */}
      <div className="skeleton" style={{ width: '100%', height: '350px' }}></div>

      <div className="container section">
        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Main Content Area Skeleton */}
            <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <Card>
                <div className="skeleton skeleton-title" style={{ width: '40%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
              </Card>

              {/* Reviews Section Skeleton */}
              <Card>
                <div className="skeleton skeleton-title" style={{ width: '30%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '50%', height: '80px', marginBottom: '2rem' }}></div>

                <div className="flex flex-col gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="skeleton rounded-full" style={{ width: '40px', height: '40px' }}></div>
                        <div>
                          <div className="skeleton skeleton-text" style={{ width: '120px', marginBottom: '0.25rem' }}></div>
                          <div className="skeleton skeleton-text" style={{ width: '80px', margin: 0 }}></div>
                        </div>
                      </div>
                      <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                      <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar Skeleton */}
            <div style={{ width: '350px', flexShrink: 0 }}>
              <Card className="shadow-lg border-2 border-blue-50">
                <div className="skeleton skeleton-title mx-auto" style={{ width: '60%', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}></div>

                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex items-center gap-4">
                    <div className="skeleton rounded-full" style={{ width: '40px', height: '40px' }}></div>
                    <div>
                      <div className="skeleton skeleton-text" style={{ width: '80px', marginBottom: '0.25rem' }}></div>
                      <div className="skeleton skeleton-text" style={{ width: '120px', margin: 0 }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="skeleton rounded-full" style={{ width: '40px', height: '40px' }}></div>
                    <div>
                      <div className="skeleton skeleton-text" style={{ width: '60px', marginBottom: '0.25rem' }}></div>
                      <div className="skeleton skeleton-text" style={{ width: '150px', margin: 0 }}></div>
                    </div>
                  </div>
                  <div className="mt-4">
                     <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: '8px' }}></div>
                  </div>
                </div>
              </Card>
            </div>

        </div>
      </div>
    </div>
  );
}
