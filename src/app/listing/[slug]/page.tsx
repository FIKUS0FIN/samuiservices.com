/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { getBusinessBySlug } from '@/lib/db';
import { Metadata } from 'next';

import StandardLayout from './layouts/StandardLayout';
import RealEstateLayout from './layouts/RealEstateLayout';
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: 'Not Found' };
  
  const services = safeParse(business.services, []);
  const keywordString = [business.name, business.category.name, business.island.name, 'Koh Samui', 'Thailand', ...services].join(', ');
  
  const optimizedTitle = `Top ${business.category.name} in ${business.island.name} | ${business.name} Reviews & Info`;
  const optimizedDescription = `${business.name} is a highly-rated ${business.category.name} located in ${business.island.name}, Koh Samui. ${business.averageRating > 0 ? `Rated ${business.averageRating} stars.` : ''} Check out reviews, opening hours, photos, and contact information.`;

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
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `https://www.samuibusinessdirectory.com/listing/${slug}`,
      types: {
        'text/markdown': `https://www.samuibusinessdirectory.com/api/agent/listing/${slug}`
      }
    }
  };
}

export default async function BusinessDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  
  if (!business) {
    notFound();
  }

  const galleryImages = safeParse(business.galleryImages, []);
  const hours = safeParse(business.hours, []);
  const allImages = business.image ? [business.image, ...galleryImages] : galleryImages;

  // 1. LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': business.category.name.includes('Restaurant') || business.category.name.includes('Food') ? 'Restaurant' : 'LocalBusiness',
    name: business.name,
    image: allImages.length > 0 ? allImages : undefined,
    telephone: business.phone || undefined,
    url: business.website || `https://www.samuibusinessdirectory.com/listing/${slug}`,
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
      reviewCount: business.reviewCount > 0 ? business.reviewCount : 1
    } : undefined,
    priceRange: business.priceLevel || '$$',
    description: business.description,
    hasOfferCatalog: business.products && business.products.length > 0 ? {
      '@type': 'OfferCatalog',
      name: 'Products & Services',
      itemListElement: business.products.map((product: any, index: number) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.image,
        },
        price: product.price,
        priceCurrency: 'THB',
        position: index + 1
      }))
    } : undefined,
    review: business.reviews && business.reviews.length > 0 ? business.reviews.map((r: any) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.user?.name || 'Anonymous'
      },
      datePublished: r.createdAt.toISOString().split('T')[0],
      reviewBody: r.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1
      }
    })) : undefined,
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
        item: 'https://www.samuibusinessdirectory.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: business.island.name,
        item: `https://www.samuibusinessdirectory.com/island/${business.island.slug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: business.category.name,
        item: `https://www.samuibusinessdirectory.com/category/${business.category.slug}`
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

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
  } : null;

  // Combine JSON-LD schemas
  const schemas: any[] = [localBusinessSchema, breadcrumbSchema];
  if (faqSchema) schemas.push(faqSchema);

  // Route to the appropriate layout
  const categoryName = business.category?.name || '';
  let LayoutComponent = StandardLayout;

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

  return (
    <div className="bg-surface min-h-screen">
      {/* Inject all JSON-LD schemas into the head for Google and AI agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
      />
      <LayoutComponent business={business} faqs={faqs} />
    </div>
  );
}
