/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { getBusinessBySlug } from '@/lib/db';
import { Metadata } from 'next';
import { parseDescriptionAndReviews } from '@/lib/parseDescription';

import StandardLayout from './layouts/StandardLayout';
import RealEstateLayout from './layouts/RealEstateLayout';

export const revalidate = 3600; // 1 hour caching for optimal performance
import TransportationLayout from './layouts/TransportationLayout';
import ElectronicsRepairLayout from './layouts/ElectronicsRepairLayout';
import ConstructionLayout from './layouts/ConstructionLayout';
import ChildrenServicesLayout from './layouts/ChildrenServicesLayout';
import HomeGardenLayout from './layouts/HomeGardenLayout';
import ClothingLayout from './layouts/ClothingLayout';
import GiftShopLayout from './layouts/GiftShopLayout';
import FurnitureLayout from './layouts/FurnitureLayout';
import ToursLayout from './layouts/ToursLayout';
import BeautyHealthLayout from './layouts/BeautyHealthLayout';
import HobbiesSportsLayout from './layouts/HobbiesSportsLayout';
import BusinessServiceLayout from './layouts/BusinessServiceLayout';

const safeParse = (str: string | null | undefined, fallback: any = []) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

const safeToISOString = (dateVal: any): string => {
  if (!dateVal) return new Date().toISOString();
  try {
    const d = (typeof dateVal === 'string' || typeof dateVal === 'number') ? new Date(dateVal) : dateVal;
    if (d instanceof Date && !isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {}
  return new Date().toISOString();
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let business = null;
  try {
    business = await getBusinessBySlug(slug);
  } catch (error) {
    console.error(`Metadata DB Error for slug ${slug}:`, error);
  }
  if (!business) return { title: 'Not Found' };
  
  const services = safeParse(business.services, []);
  const keywordString = [business.name, business.category.name, business.island.name, 'Koh Samui', 'Thailand', ...services].join(', ');
  
  const optimizedTitle = `Top ${business.category.name} in ${business.island.name} | ${business.name} Reviews & Info`;
  const optimizedDescription = `${business.name} is a highly-rated ${business.category.name} located in ${business.island.name}, Koh Samui. ${business.averageRating > 0 ? `Rated ${business.averageRating} stars.` : ''} Check out reviews, opening hours, photos, and contact information.`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com';

  return {
    title: optimizedTitle,
    description: business.description || optimizedDescription,
    keywords: keywordString,
    openGraph: {
      title: optimizedTitle,
      description: business.description || optimizedDescription,
      images: business.image ? [{ url: business.image }] : [],
      type: 'website',
    },
    // BEST PRACTICE: Noindex thin content to preserve crawl budget and domain quality
    robots: {
      index: !!business.image || (business.description && business.description.length > 50) || business.reviewCount > 0,
      follow: true,
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `${baseUrl}/listing/${slug}`,
      types: {
        'text/markdown': `${baseUrl}/api/agent/listing/${slug}`
      }
    }
  };
}

import { QAWidget } from '@/components/features/QAWidget';
import { MobileActionBar } from '@/components/features/MobileActionBar';

export default async function BusinessDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let business = null;
  try {
    business = await getBusinessBySlug(slug);
  } catch (error) {
    console.error(`Page DB Error for slug ${slug}:`, error);
  }
  
  if (!business) {
    notFound();
  }

  const galleryImages = safeParse(business.galleryImages, []);
  const hours = safeParse(business.hours, []);
  const services = safeParse(business.services, []);
  const allImages = business.image ? [business.image, ...galleryImages] : galleryImages;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com';
  
  // Parse external reviews if available
  let googleReviews: any[] = [];
  if (business.externalReviews) {
    try {
      const parsed = JSON.parse(business.externalReviews);
      if (parsed && Array.isArray(parsed.reviews)) {
        googleReviews = parsed.reviews;
      }
    } catch (e) {}
  }

  const { reviews: parsedScrapedReviews } = parseDescriptionAndReviews(
    business.description,
    business.name,
    business.category?.name,
    business.island?.name
  );

  const allReviewsSchema = [
    ...(business.reviews || []).map((r: any) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.user?.name || 'Anonymous'
      },
      datePublished: safeToISOString(r.createdAt).split('T')[0],
      reviewBody: r.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1
      }
    })),
    ...parsedScrapedReviews.map((r: any) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author || 'Anonymous'
      },
      datePublished: safeToISOString(business.createdAt).split('T')[0],
      reviewBody: r.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1
      }
    })),
    ...googleReviews.map((r: any) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author || 'Anonymous Google User'
      },
      datePublished: safeToISOString(r.time).split('T')[0],
      reviewBody: r.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1
      }
    }))
  ];

  // 1. LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': business.category.name.includes('Restaurant') || business.category.name.includes('Food') ? 'Restaurant' : 'LocalBusiness',
    name: business.name,
    image: allImages.length > 0 ? allImages : undefined,
    telephone: business.phone || undefined,
    url: business.website || `${baseUrl}/listing/${slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address || '',
      addressLocality: business.island.name,
      addressRegion: 'Surat Thani',
      addressCountry: 'TH'
    },
    geo: business.lat && business.lng ? {
      '@type': 'GeoCoordinates',
      latitude: business.lat,
      longitude: business.lng
    } : undefined,
    aggregateRating: business.averageRating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: business.averageRating,
      reviewCount: allReviewsSchema.length > 0 ? allReviewsSchema.length : (business.reviewCount > 0 ? business.reviewCount : 1)
    } : undefined,
    priceRange: business.priceLevel || '$$',
    description: business.description,
    keywords: services.length > 0 ? services.join(', ') : undefined,
    hasOfferCatalog: business.products && business.products.length > 0 ? {
      '@type': 'OfferCatalog',
      name: 'Products & Services',
      itemListElement: business.products.map((product: any, index: number) => {
        const productImg = product.image || allImages[0] || `${baseUrl}/apple-touch-icon.png`;
        const productOffers = {
          '@type': 'Offer',
          price: product.price || 0,
          priceCurrency: 'THB',
          availability: 'https://schema.org/InStock',
          url: `${baseUrl}/listing/${slug}`,
          priceValidUntil: '2027-12-31',
          validFrom: safeToISOString(business.createdAt).split('T')[0],
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: '0',
                currency: 'THB'
              },
              shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: 'TH'
              },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 1,
                  unitCode: 'DAY'
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 1,
                  maxValue: 3,
                  unitCode: 'DAY'
                }
              }
            },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'TH',
            returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
          }
        };

        return {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: product.name,
            description: product.description || undefined,
            image: productImg,
            offers: productOffers,
            brand: {
              '@type': 'Brand',
              name: business.name
            },
            aggregateRating: business.averageRating > 0 ? {
              '@type': 'AggregateRating',
              ratingValue: business.averageRating,
              reviewCount: allReviewsSchema.length > 0 ? allReviewsSchema.length : (business.reviewCount > 0 ? business.reviewCount : 1)
            } : undefined,
            review: allReviewsSchema.length > 0 ? allReviewsSchema : undefined,
          },
          price: product.price || 0,
          priceCurrency: 'THB',
          availability: 'https://schema.org/InStock',
          position: index + 1
        };
      })
    } : undefined,
    review: allReviewsSchema.length > 0 ? allReviewsSchema : undefined,
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: business.island.name,
        item: `${baseUrl}/${business.island.slug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: business.category.name,
        item: `${baseUrl}/?category=${business.category.slug}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: business.name
      }
    ]
  };

  // 3. FAQPage Schema
  const faqs = [];
  if (business.address) {
    faqs.push({
      '@type': 'Question',
      name: `Where is ${business.name} located?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${business.name} is located at ${business.address}, in ${business.island.name}, Koh Samui, Thailand.`
      }
    });
  }
  if (business.phone) {
    faqs.push({
      '@type': 'Question',
      name: `How can I contact ${business.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `You can reach ${business.name} by calling their phone number: ${business.phone}.`
      }
    });
  }
  if (hours.length > 0) {
    faqs.push({
      '@type': 'Question',
      name: `What are the opening hours for ${business.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Their typical opening hours are: ${hours.join(', ')}.`
      }
    });
  }
  if (business.website) {
    faqs.push({
      '@type': 'Question',
      name: `Does ${business.name} have an official website?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes, you can visit the official website for ${business.name} at ${business.website} for more details, services, and online inquiries.`
      }
    });
  }
  if (services.length > 0) {
    faqs.push({
      '@type': 'Question',
      name: `What services and specialties does ${business.name} offer?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${business.name} specializes in: ${services.join(', ')}.`
      }
    });
  }
  if (business.averageRating > 0) {
    faqs.push({
      '@type': 'Question',
      name: `What is the customer rating of ${business.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${business.name} has an average rating of ${business.averageRating.toFixed(1)} out of 5 stars based on customer reviews.`
      }
    });
  }
  if (faqs.length < 3) {
    faqs.push({
      '@type': 'Question',
      name: `What category of business is ${business.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${business.name} is classified under the ${business.category.name} category in Koh Samui.`
      }
    });
  }
  if (faqs.length < 4) {
    faqs.push({
      '@type': 'Question',
      name: `Is ${business.name} located in Koh Samui?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes, ${business.name} is located on the island of Koh Samui, in Surat Thani province, Thailand.`
      }
    });
  }

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
  } : null;

  // 4. ProfilePage Schema
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: safeToISOString(business.createdAt),
    dateModified: safeToISOString(business.updatedAt),
    mainEntity: {
      '@type': 'Organization',
      name: business.name,
      image: allImages.length > 0 ? allImages[0] : undefined,
      description: business.description,
      keywords: services.length > 0 ? services.join(', ') : undefined
    }
  };

  // Combine JSON-LD schemas
  const schemas: any[] = [localBusinessSchema, breadcrumbSchema, profilePageSchema];
  if (faqSchema) schemas.push(faqSchema);

  // Route to the appropriate layout
  const layout = business.layout || 'standard';
  const categoryName = business.category?.name || '';
  let LayoutComponent = StandardLayout;

  switch (layout) {
    case 'real-estate': LayoutComponent = RealEstateLayout; break;
    case 'transportation': LayoutComponent = TransportationLayout; break;
    case 'electronics-repair': LayoutComponent = ElectronicsRepairLayout; break;
    case 'construction': LayoutComponent = ConstructionLayout; break;
    case 'children-services': LayoutComponent = ChildrenServicesLayout; break;
    case 'home-garden': LayoutComponent = HomeGardenLayout; break;
    case 'clothing': LayoutComponent = ClothingLayout; break;
    case 'gift-shop': LayoutComponent = GiftShopLayout; break;
    case 'furniture': LayoutComponent = FurnitureLayout; break;
    case 'tours': LayoutComponent = ToursLayout; break;
    case 'beauty-health': LayoutComponent = BeautyHealthLayout; break;
    case 'hobbies-sports': LayoutComponent = HobbiesSportsLayout; break;
    case 'business-services': LayoutComponent = BusinessServiceLayout; break;
    case 'standard': LayoutComponent = StandardLayout; break;
    default:
      // Fallback to category-based matching for backward compatibility
      switch (categoryName) {
        case 'Real Estate agencies': LayoutComponent = RealEstateLayout; break;
        case 'Transportation and Delivery Service': LayoutComponent = TransportationLayout; break;
        case 'Electronics Repair Serivce': LayoutComponent = ElectronicsRepairLayout; break;
        case 'Construction & Repair Service': LayoutComponent = ConstructionLayout; break;
        case "Children's Interactions Services": LayoutComponent = ChildrenServicesLayout; break;
        case 'Home & Garden Services': LayoutComponent = HomeGardenLayout; break;
        case 'Clothing & Accessories Shops': LayoutComponent = ClothingLayout; break;
        case 'Gitf & Souvenir Shops': LayoutComponent = GiftShopLayout; break;
        case 'Furniture & Interior Shops': LayoutComponent = FurnitureLayout; break;
        case 'Toure Providers': LayoutComponent = ToursLayout; break;
        case 'Beauty & Health Services': LayoutComponent = BeautyHealthLayout; break;
        case 'Hobbies & Sports Service': LayoutComponent = HobbiesSportsLayout; break;
        case 'Business Service': LayoutComponent = BusinessServiceLayout; break;
        default: LayoutComponent = StandardLayout; break;
      }
      break;
  }

  return (
    <div className="bg-surface min-h-screen pb-28 lg:pb-12">
      {/* Inject all JSON-LD schemas into the head for Google and AI agents */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
        />
      ))}
      <LayoutComponent business={business} faqs={faqs} />
      
      {/* Render FAQs visually for all non-Standard layouts */}
      {LayoutComponent !== StandardLayout && faqs.length > 0 && (
        <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
          <section className="flex flex-col gap-4 mt-8" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-on-surface">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-surface p-5 rounded-2xl border border-outline-variant group cursor-pointer transition-all">
                  <summary className="font-bold text-lg text-on-surface outline-none list-none flex justify-between items-center select-none">
                    {faq.name}
                    <span className="text-primary group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                  </summary>
                  <p className="mt-4 text-on-surface-variant leading-relaxed border-t border-outline-variant/30 pt-4">
                    {faq.acceptedAnswer.text}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Global Q&A Widget injected below all layouts */}
      <QAWidget listingId={business.id} initialQuestions={(business as any).questions || []} />

      {/* Global mobile quick-action bar for call, map, and website */}
      <MobileActionBar business={business} />
    </div>
  );
}
