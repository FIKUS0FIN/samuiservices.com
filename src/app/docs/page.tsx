import Link from 'next/link';

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-surface py-16 px-6 font-body">
      <div className="max-w-4xl mx-auto bg-surface-container-lowest border border-outline-variant shadow-level-2 rounded-card overflow-hidden">
        {/* Header Hero */}
        <div className="relative bg-primary p-12 text-on-primary hero-gradient overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-on-primary/10 text-label-md font-bold tracking-wider uppercase mb-4 border border-on-primary/10">
              API Reference
            </div>
            <h1 className="font-display text-4xl font-extrabold mb-4 tracking-tight">
              Samui Services API Documentation
            </h1>
            <p className="text-lg opacity-90 max-w-2xl font-light leading-relaxed">
              Integrate with the premier business and service directory of Koh Samui. Our API provides structured endpoints for querying islands, categories, and business listings.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12 flex flex-col gap-12">
          {/* Base URL & Auth */}
          <section className="flex flex-col gap-4">
            <h2 className="text-title-lg font-bold text-on-surface border-b border-outline-variant pb-2">
              Getting Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="p-5 bg-surface-container rounded-card border border-outline-variant">
                <h3 className="font-bold text-on-surface mb-2 text-label-lg">BASE URL</h3>
                <code className="text-primary font-mono text-sm bg-primary-container/20 px-2 py-1 rounded">
                  https://samuiservices.com/api
                </code>
              </div>
              <div className="p-5 bg-surface-container rounded-card border border-outline-variant">
                <h3 className="font-bold text-on-surface mb-2 text-label-lg">AUTHENTICATION</h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Public endpoints do not require authentication. Agent-based interactions require Bearer authentication. Refer to <Link href="/auth.md" className="text-primary hover:underline font-semibold">auth.md</Link> for details.
                </p>
              </div>
            </div>
          </section>

          {/* Endpoints List */}
          <section className="flex flex-col gap-6">
            <h2 className="text-title-lg font-bold text-on-surface border-b border-outline-variant pb-2">
              Endpoints
            </h2>

            {/* GET /businesses */}
            <div className="p-6 bg-surface-container rounded-card border border-outline-variant hover:shadow-level-1 transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary text-on-primary text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  GET
                </span>
                <span className="font-mono text-lg font-semibold text-on-surface">
                  /businesses
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant mb-4">
                Retrieve a list of businesses, optionally filtered by island or category.
              </p>
              <h4 className="font-semibold text-on-surface mb-2 text-label-md uppercase tracking-wider">Parameters</h4>
              <ul className="list-disc pl-5 text-body-sm text-on-surface-variant flex flex-col gap-2">
                <li><span className="font-mono text-on-surface font-semibold">island</span> (optional) - Filter by island slug (e.g. <code className="bg-surface px-1.5 py-0.5 rounded font-mono text-xs">koh-samui</code>)</li>
                <li><span className="font-mono text-on-surface font-semibold">category</span> (optional) - Filter by category slug (e.g. <code className="bg-surface px-1.5 py-0.5 rounded font-mono text-xs">construction</code>)</li>
              </ul>
            </div>

            {/* GET /businesses/{id} */}
            <div className="p-6 bg-surface-container rounded-card border border-outline-variant hover:shadow-level-1 transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary text-on-primary text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  GET
                </span>
                <span className="font-mono text-lg font-semibold text-on-surface">
                  /businesses/{"{id}"}
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant mb-4">
                Retrieve detailed information for a specific business by ID.
              </p>
            </div>

            {/* GET /search */}
            <div className="p-6 bg-surface-container rounded-card border border-outline-variant hover:shadow-level-1 transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary text-on-primary text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  GET
                </span>
                <span className="font-mono text-lg font-semibold text-on-surface">
                  /search
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant mb-4">
                Query listings based on search terms. Returns up to 5 best matched results.
              </p>
              <h4 className="font-semibold text-on-surface mb-2 text-label-md uppercase tracking-wider">Parameters</h4>
              <ul className="list-disc pl-5 text-body-sm text-on-surface-variant flex flex-col gap-2">
                <li><span className="font-mono text-on-surface font-semibold">q</span> (required) - Search term (minimum 3 characters)</li>
                <li><span className="font-mono text-on-surface font-semibold">island</span> (optional) - Filter by island slug</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
