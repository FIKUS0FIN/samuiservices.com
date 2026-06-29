/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { getBusinessBySlug } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { MessageForm } from "@/components/features/MessageForm";
import { ReviewForm } from '@/components/features/ReviewForm';
import { ClaimButton } from '@/components/features/ClaimButton';
import ProductGrid from './components/ProductGrid';

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: 'Not Found' };
  
  return {
    title: `${business.name} | ${business.category.name} in ${business.island.name}`,
    description: business.description,
    openGraph: {
      title: business.name,
      description: business.description,
      images: business.image ? [{ url: business.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
    }
  };
}

export default async function BusinessDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  
  if (!business) {
    notFound();
  }

  // Schema.org JSON-LD for LocalBusiness
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    image: business.image,
    telephone: business.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.island.name,
      addressRegion: 'Surat Thani',
      addressCountry: 'TH'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.averageRating,
      reviewCount: business.reviewCount
    },
    description: business.description,
    hasOfferCatalog: business.products && business.products.length > 0 ? {
      '@type': 'OfferCatalog',
      name: 'Products & Services',
      itemListElement: business.products.map((product, index) => ({
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
    } : undefined
  };

  // Route to the appropriate layout based on category name
  const categoryName = business.category?.name || '';
  let LayoutComponent = StandardLayout;

  switch (categoryName) {
    case 'Real Estate agencies':
      LayoutComponent = RealEstateLayout;
      break;
    case 'Transportation and Delivery Service':
      LayoutComponent = TransportationLayout;
      break;
    case 'Electronics Repair Serivce':
      LayoutComponent = ElectronicsRepairLayout;
      break;
    case 'Construction & Repair Service':
      LayoutComponent = ConstructionLayout;
      break;
    case "Children's Interactions Services":
      LayoutComponent = ChildrenServicesLayout;
      break;
    case 'Home & Garden Services':
      LayoutComponent = HomeGardenLayout;
      break;
    case 'Clothing & Accessories Shops':
      LayoutComponent = ClothingLayout;
      break;
    case 'Gitf & Souvenir Shops': // using the exact string from the user prompt
      LayoutComponent = GiftShopLayout;
      break;
    case 'Furniture & Interior Shops':
      LayoutComponent = FurnitureLayout;
      break;
    case 'Toure Providers': // using the exact string from the user prompt
      LayoutComponent = ToursLayout;
      break;
    case 'Beauty & Health Services':
      LayoutComponent = BeautyHealthLayout;
      break;
    case 'Hobbies & Sports Service':
      LayoutComponent = HobbiesSportsLayout;
      break;
    case 'Business Service':
      LayoutComponent = BusinessServiceLayout;
      break;
    default:
      LayoutComponent = StandardLayout;
      break;
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Inject JSON-LD into the head for Google and AI agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
      />
      <LayoutComponent business={business} />
    </div>
  );
}
