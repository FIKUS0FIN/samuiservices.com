/* eslint-disable @next/next/no-img-element */
import { ReviewForm } from '@/components/features/ReviewForm';
import { ReviewWidget } from '@/components/features/ReviewWidget';
import { parseDescriptionAndReviews } from '@/lib/parseDescription';
import { getUnifiedReviews, getConsolidatedRating } from '@/lib/rating';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export const safeParse = (str: string | null | undefined, fallback: any = []) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

export function ServicesTags({ servicesRaw, theme = 'standard' }: { servicesRaw: string | null | undefined, theme?: string }) {
  const services = safeParse(servicesRaw, []);
  if (services.length === 0) return null;

  const bgClass = theme === 'sports' 
    ? 'bg-gray-900 text-gray-300 border-gray-800' 
    : theme === 'beauty'
    ? 'bg-white text-[#a08585] border-[#e4d5d5]'
    : 'bg-surface-container text-on-surface-variant border-outline-variant';

  return (
    <section className="flex flex-wrap gap-2" aria-label="Services Offered">
      {services.map((service: string, idx: number) => (
        <span key={idx} className={`px-4 py-2 rounded-xl text-sm font-medium border ${bgClass}`}>
          {service}
        </span>
      ))}
    </section>
  );
}

export function DescriptionSection({ 
  businessName, 
  categoryName, 
  islandName, 
  descriptionRaw,
  theme = 'standard'
}: { 
  businessName: string, 
  categoryName?: string, 
  islandName?: string, 
  descriptionRaw: string,
  theme?: string 
}) {
  const { description: parsedDescription, reviews: scrapedReviews } = parseDescriptionAndReviews(
    descriptionRaw, 
    businessName, 
    categoryName || '', 
    islandName || ''
  );

  const textClass = theme === 'sports'
    ? 'text-gray-300'
    : theme === 'beauty'
    ? 'text-[#7a6b6b]'
    : 'text-on-surface-variant';

  const borderClass = theme === 'sports'
    ? 'border-l-4 border-[#e5ff00]'
    : theme === 'beauty'
    ? 'border-l-4 border-[#e8b4b8]'
    : 'border-l-4 border-primary';

  return (
    <div className="flex flex-col gap-6">
      <div className={`prose prose-lg max-w-none ${textClass} leading-relaxed pl-4 ${borderClass}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {parsedDescription}
        </ReactMarkdown>
      </div>
      {scrapedReviews.length > 0 && (
        <ReviewWidget reviews={scrapedReviews} />
      )}
    </div>
  );
}

export function OpeningHoursWidget({ hoursRaw, theme = 'standard' }: { hoursRaw: string | null | undefined, theme?: string }) {
  const hours = safeParse(hoursRaw, []);
  if (hours.length === 0) return null;

  const bgClass = theme === 'sports'
    ? 'bg-gray-900 border-gray-800'
    : theme === 'beauty'
    ? 'bg-white border-[#f4ecec]'
    : 'bg-surface border-outline-variant';

  const textClass = theme === 'sports'
    ? 'text-gray-300'
    : theme === 'beauty'
    ? 'text-[#7a6b6b]'
    : 'text-on-surface-variant';

  const borderClass = theme === 'sports'
    ? 'border-gray-800'
    : theme === 'beauty'
    ? 'border-[#f4ecec]'
    : 'border-outline-variant/50';

  const headerClass = theme === 'sports'
    ? 'text-white font-black uppercase italic'
    : theme === 'beauty'
    ? 'font-serif text-[#4a3f3f]'
    : 'font-bold text-on-surface';

  return (
    <section className="flex flex-col gap-4" aria-labelledby="hours-heading">
      <h2 id="hours-heading" className={`text-2xl ${headerClass}`}>Opening Hours</h2>
      <div className={`p-6 rounded-2xl border ${bgClass} grid gap-2`}>
        {hours.map((hour: string, idx: number) => (
          <div key={idx} className={`flex justify-between ${textClass} py-1 border-b ${borderClass} last:border-0`}>
            <span className="font-medium">{hour.split(': ')[0] || hour}</span>
            <span>{hour.split(': ')[1] || ''}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function getMapEmbedUrl(
  mapLink: string | null | undefined, 
  businessName: string, 
  address: string | null | undefined, 
  lat: number | null | undefined, 
  lng: number | null | undefined
): string {
  if (mapLink) {
    const trimmed = mapLink.trim();
    
    // 1. Check for CID in query params
    const cidMatch = trimmed.match(/[?&]cid=(\d+)/);
    if (cidMatch) {
      return `https://maps.google.com/maps?cid=${cidMatch[1]}&output=embed`;
    }
    
    // 2. Check for hex CID in data block (e.g. 0x3054f1454157a911:0x116bb7ef0ae7339d)
    const hexCidMatch = trimmed.match(/0x[0-9a-fA-F]+:0x([0-9a-fA-F]+)/);
    if (hexCidMatch) {
      try {
        const cid = BigInt("0x" + hexCidMatch[1]).toString();
        return `https://maps.google.com/maps?cid=${cid}&output=embed`;
      } catch (e) {}
    }
    
    // 3. Check for place name in /maps/place/
    const placeMatch = trimmed.match(/\/maps\/place\/([^/]+)/);
    if (placeMatch) {
      const query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // 4. Fallback for other standard maps URLs
    if ((trimmed.includes('google.com/maps') || trimmed.includes('maps.google.com')) && 
        !trimmed.includes('maps.app.goo.gl') && !trimmed.includes('goo.gl/maps')) {
      let url = trimmed;
      if (url.includes('google.com/?')) {
        url = url.replace('google.com/?', 'google.com/maps?');
      }
      if (!url.includes('output=embed')) {
        url += (url.includes('?') ? '&' : '?') + 'output=embed';
      }
      return url;
    }
  }
  
  // Fallback: If we have an address, searching by "businessName, address" is much more accurate 
  // than using the randomized lat/lng coordinates (which are district centers + 1.5km scatter).
  // However, if we don't have an address, we can use the coordinates.
  const query = address 
    ? `${businessName}, ${address}` 
    : (lat && lng ? `${lat},${lng}` : businessName);
    
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

export function InteractiveMap({ 
  businessName, 
  address, 
  lat, 
  lng, 
  mapLink, 
  theme = 'standard' 
}: { 
  businessName: string, 
  address: string | null | undefined, 
  lat: number | null | undefined, 
  lng: number | null | undefined, 
  mapLink: string | null | undefined, 
  theme?: string 
}) {
  if (!address && !lat && !lng) return null;

  const bgClass = theme === 'sports'
    ? 'bg-gray-900 border-gray-800'
    : theme === 'beauty'
    ? 'bg-white border-[#f4ecec]'
    : 'bg-surface border-outline-variant';

  const textClass = theme === 'sports'
    ? 'text-gray-300'
    : theme === 'beauty'
    ? 'text-[#7a6b6b]'
    : 'text-on-surface-variant';

  const headerClass = theme === 'sports'
    ? 'text-white font-black uppercase italic'
    : theme === 'beauty'
    ? 'font-serif text-[#4a3f3f]'
    : 'font-bold text-on-surface';

  const btnClass = theme === 'sports'
    ? 'bg-[#e5ff00] text-black font-black uppercase tracking-wider hover:bg-white transition-colors'
    : theme === 'beauty'
    ? 'bg-[#f9dbdd] text-[#4a3f3f] font-serif hover:bg-[#e8b4b8] transition-colors'
    : 'bg-primary-container text-on-primary-container hover:brightness-95 transition-all';

  return (
    <section className="flex flex-col gap-4" aria-labelledby="location-heading">
      <h2 id="location-heading" className={`text-2xl ${headerClass}`}>Location</h2>
      <div className={`rounded-2xl border overflow-hidden flex flex-col shadow-sm ${bgClass}`}>
        <div className={`p-4 md:p-6 border-b ${theme === 'sports' ? 'border-gray-800 bg-black' : theme === 'beauty' ? 'border-[#f4ecec] bg-[#faf5f5]' : 'border-outline-variant/30 bg-surface-container-lowest'} flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center`}>
          <div className="flex flex-col gap-1">
            <div className={`font-bold flex items-center gap-2 ${theme === 'sports' ? 'text-white' : theme === 'beauty' ? 'text-[#4a3f3f]' : 'text-on-surface'}`}>
              <span className="text-xl">📍</span> {businessName}
            </div>
            {address && (
              <div className={`text-sm pl-7 leading-relaxed ${textClass}`}>
                {address}
              </div>
            )}
          </div>
          {mapLink && (
            <a 
              href={mapLink} 
              target="_blank" 
              rel="noreferrer" 
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm ${btnClass}`}
            >
              Open in Google Maps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
        </div>
        <div className="w-full h-[300px] md:h-[400px] bg-surface-container-highest relative">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={getMapEmbedUrl(mapLink, businessName, address, lat, lng)}
            allowFullScreen
            aria-hidden="false"
            tabIndex={0}
            title={`Map showing location of ${businessName}`}
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export function GalleryGrid({ 
  businessName, 
  galleryRaw, 
  theme = 'standard' 
}: { 
  businessName: string, 
  galleryRaw: string | null | undefined, 
  theme?: string 
}) {
  const gallery = safeParse(galleryRaw, []);
  if (gallery.length === 0) return null;

  const headerClass = theme === 'sports'
    ? 'text-white font-black uppercase italic'
    : theme === 'beauty'
    ? 'font-serif text-[#4a3f3f]'
    : 'font-bold text-on-surface';

  const borderClass = theme === 'sports'
    ? 'border-gray-800 bg-gray-900'
    : theme === 'beauty'
    ? 'border-[#f4ecec] bg-white'
    : 'border-outline-variant bg-surface-container-highest';

  return (
    <section className="flex flex-col gap-4" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className={`text-2xl ${headerClass}`}>Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((img: string, idx: number) => (
          <div key={idx} className={`aspect-square rounded-xl overflow-hidden border ${borderClass}`}>
            <img src={img} alt={`${businessName} - Gallery image ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function UnifiedReviewsSection({ 
  business, 
  theme = 'standard' 
}: { 
  business: any, 
  theme?: string 
}) {
  const allReviews = getUnifiedReviews(business);
  const consolidated = getConsolidatedRating(business);
  const googleCount = consolidated.googleCount;

  const headerClass = theme === 'sports'
    ? 'text-white font-black uppercase italic'
    : theme === 'beauty'
    ? 'font-serif text-[#4a3f3f]'
    : 'font-bold text-on-surface';

  const cardClass = theme === 'sports'
    ? 'p-6 md:p-8 bg-gray-900 border border-gray-800'
    : theme === 'beauty'
    ? 'p-8 bg-white border border-[#f4ecec] rounded-3xl'
    : 'p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant bg-surface';

  const reviewItemClass = (source: string) => {
    if (theme === 'sports') {
      return source === 'Google'
        ? 'bg-gray-950 border-l-4 border-l-blue-500 border border-gray-800'
        : 'bg-gray-950 border border-gray-800';
    } else if (theme === 'beauty') {
      return source === 'Google'
        ? 'bg-[#faf5f5] border-l-4 border-l-[#e8b4b8] border border-[#f4ecec]'
        : 'bg-white border border-[#f4ecec]';
    } else {
      return source === 'Google'
        ? 'border-blue-100 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/20 to-transparent'
        : 'border-outline-variant';
    }
  };

  const textClass = theme === 'sports' ? 'text-gray-400' : theme === 'beauty' ? 'text-[#7a6b6b]' : 'text-on-surface-variant';
  const nameClass = theme === 'sports' ? 'text-white font-black' : theme === 'beauty' ? 'text-[#4a3f3f] font-serif' : 'text-on-surface font-bold';
  const starsClass = theme === 'sports' ? 'text-[#e5ff00]' : theme === 'beauty' ? 'text-[#e8b4b8]' : 'text-amber-500';

  return (
    <section className="flex flex-col gap-4" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className={`text-2xl ${headerClass}`}>Customer Reviews</h2>
      <div className={cardClass}>
        <ReviewForm listingId={business.id} />
        <div className="flex flex-col gap-6 mt-8">
          {allReviews.length === 0 ? (
            <div className={`${textClass} italic p-4 text-center`}>
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {allReviews.map((review: any) => (
                  <div 
                    key={review.id} 
                    className={`p-5 border rounded-2xl transition-all hover:shadow-md ${reviewItemClass(review.source)}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold overflow-hidden border border-outline-variant/30">
                          {review.authorImage ? (
                            <img src={review.authorImage} alt={review.authorName} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            (review.authorName || 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`flex flex-wrap items-center gap-2 ${nameClass}`}>
                            {review.source === 'Site' && review.userId ? (
                              <Link href={`/user/${review.userId}`} className="hover:text-primary transition-colors hover:underline">
                                {review.authorName}
                              </Link>
                            ) : (
                              review.authorName
                            )}
                            {review.source === 'Google' && (
                              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                                <span className="text-[10px]">🌐</span> Google Review
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-on-surface-variant flex items-center gap-2">
                            <span>{review.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`font-bold tracking-widest ${starsClass}`}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className={`m-0 leading-relaxed italic font-light pl-1 ${textClass}`}>
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
              
              {googleCount > 0 && business.mapLink && (
                <div className="mt-8 pt-6 border-t border-outline-variant/40 flex justify-center">
                  <a 
                    href={business.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3.5 bg-surface-container-low border border-outline-variant hover:bg-surface-container-medium hover:border-primary/30 text-primary hover:text-primary font-semibold rounded-2xl shadow-sm transition-all text-sm group"
                  >
                    <svg className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.445-2.89-6.445-6.445s2.89-6.445 6.445-6.445c1.614 0 3.084.593 4.225 1.574l3.19-3.19C19.29 2.015 15.938 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.643 0 11.24-4.667 11.24-11.24 0-.75-.084-1.477-.24-2.215H12.24z"/>
                    </svg>
                    <span>Read all {googleCount} Google reviews</span>
                    <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
