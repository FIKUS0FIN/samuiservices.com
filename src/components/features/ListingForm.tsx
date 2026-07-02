'use client';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Island {
  id: string;
  name: string;
}

interface ListingData {
  slug?: string;
  layout?: string;
  products?: { id: string; name: string; description: string | null; price: number | null; image: string | null }[];
  name?: string;
  categoryId?: string;
  islandId?: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  hours?: string | null;
  lat?: number | null;
  lng?: number | null;
  description?: string;
  image?: string | null;
  socialLinks?: string | null;
  faqs?: string | null;
  specialOffers?: string | null;
  menu?: string | null;
  videoUrls?: string | null;
  bookingUrl?: string | null;
  trustBadges?: string | null;
  amenities?: string | null;
  externalReviews?: string | null;
}

interface ListingFormProps {
  action: (formData: FormData) => void;
  listing?: ListingData;
  categories: Category[];
  islands: Island[];
  submitLabel?: string;
  cancelHref?: string;
}

export function ListingForm({
  action,
  listing,
  categories,
  islands,
  submitLabel = 'Save Changes',
  cancelHref = '/dashboard'
}: ListingFormProps) {
  const [products, setProducts] = useState(listing?.products || []);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(listing?.description || '');
  const [websiteValue, setWebsiteValue] = useState(listing?.website || '');
  const [crawlUrlsValue, setCrawlUrlsValue] = useState(listing?.website || '');
  const [hoursValue, setHoursValue] = useState(listing?.hours || '');
  const [imageValue, setImageValue] = useState(listing?.image || '');

  // Widget States
  const [socialLinksValue, setSocialLinksValue] = useState(listing?.socialLinks || '');
  const [faqsValue, setFaqsValue] = useState(listing?.faqs || '');
  const [specialOffersValue, setSpecialOffersValue] = useState(listing?.specialOffers || '');
  const [menuValue, setMenuValue] = useState(listing?.menu || '');
  const [videoUrlsValue, setVideoUrlsValue] = useState(listing?.videoUrls || '');
  const [bookingUrlValue, setBookingUrlValue] = useState(listing?.bookingUrl || '');
  const [trustBadgesValue, setTrustBadgesValue] = useState(listing?.trustBadges || '');
  const [amenitiesValue, setAmenitiesValue] = useState(listing?.amenities || '');
  const [externalReviewsValue, setExternalReviewsValue] = useState(listing?.externalReviews || '');
  const [enhancingWidget, setEnhancingWidget] = useState<string | null>(null);

  const handleEnhanceWidget = async (widgetType: string, text: string, setter: (val: string) => void) => {
    if (!text) return;
    setEnhancingWidget(widgetType);
    try {
      const res = await fetch('/api/ai/enhance-widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgetType, text })
      });
      if (res.ok) {
        const data = await res.json() as { result: any };
        setter(JSON.stringify(data.result, null, 2));
      } else {
        alert('Failed to enhance widget.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to AI service.');
    } finally {
      setEnhancingWidget(null);
    }
  };


  const handleEnhanceSEO = async () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const islandId = formData.get('islandId') as string;
    
    if (!name || !categoryId) {
      alert("Please fill out the Business Name and Category first.");
      return;
    }

    const categoryName = categories.find(c => c.id === categoryId)?.name || '';
    const islandName = islands.find(i => i.id === islandId)?.name || '';
    
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: name, categoryName, islandName, description: descriptionValue })
      });
      
      if (res.ok) {
        const data = await res.json() as { result: string };
        setDescriptionValue(data.result);
      } else {
        alert('Failed to enhance SEO.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to AI service.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCrawlWebsite = async () => {
    const urls = crawlUrlsValue.split('\n').map(u => u.trim()).filter(u => u);
    if (urls.length === 0) {
      alert("Please enter at least one website URL to crawl.");
      return;
    }
    if (urls.length > 5) {
      alert("Please enter a maximum of 5 URLs.");
      return;
    }

    setIsCrawling(true);
    try {
      // 1. Crawl the website and extract structured data
      const crawlRes = await fetch('/api/ai/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls })
      });
      
      if (!crawlRes.ok) {
        alert('Failed to crawl website.');
        setIsCrawling(false);
        return;
      }
      
      const { result } = await crawlRes.json() as { result: Record<string, unknown> };
      
      // Update basic fields
      if (typeof result.description === 'string') setDescriptionValue(result.description);
      if (typeof result.hours === 'string') setHoursValue(result.hours);
      
      // Update widget fields
      if (result.socialLinks) setSocialLinksValue(JSON.stringify(result.socialLinks, null, 2));
      if (result.faqs) setFaqsValue(JSON.stringify(result.faqs, null, 2));
      if (result.specialOffers) setSpecialOffersValue(JSON.stringify(result.specialOffers, null, 2));
      if (result.menu) setMenuValue(JSON.stringify(result.menu, null, 2));
      if (result.videoUrls) setVideoUrlsValue(JSON.stringify(result.videoUrls, null, 2));
      if (result.bookingUrl) setBookingUrlValue(result.bookingUrl as string);
      if (result.trustBadges) setTrustBadgesValue(JSON.stringify(result.trustBadges, null, 2));
      if (result.amenities) setAmenitiesValue(JSON.stringify(result.amenities, null, 2));
      if (result.externalReviews) setExternalReviewsValue(JSON.stringify(result.externalReviews, null, 2));
      
      let finalImages: string[] = Array.isArray(result.images) ? (result.images as string[]) : [];

      // 2. Auto-upload images if any found
      if (finalImages.length > 0) {
        try {
          const uploadRes = await fetch('/api/upload-external-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrls: finalImages })
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json() as { result: string[] };
            finalImages = uploadData.result || finalImages;
          }
        } catch (e) {
          console.error("Image upload failed", e);
        }
      }

      // Populate cover image if available
      if (finalImages.length > 0) {
        setImageValue(finalImages[0]);
      }

      // Combine AI extracted products with existing products
      if (Array.isArray(result.products)) {
        const newProducts = result.products.map((p: Record<string, unknown>, i: number) => ({
          id: '',
          name: (p.name as string) || '',
          description: (p.description as string) || '',
          price: (p.price as number) || null,
          image: (p.image as string) || (finalImages[i + 1] || '') // Try to assign an image if available
        }));
        setProducts([...products, ...newProducts]);
      }

    } catch (e) {
      console.error(e);
      alert('Error connecting to crawling service.');
    } finally {
      setIsCrawling(false);
    }
  };

  const addProduct = () => {
    setProducts([...products, { id: '', name: '', description: '', price: null, image: '' }]);
  };

  const removeProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const updateProduct = (index: number, field: string, value: string) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  return (
    <form ref={formRef} action={action} className="space-y-8">

      {/* Basic Info */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-primary text-2xl font-bold">1.</span>
          <h2 className="font-headline-md text-2xl text-on-surface">Basic Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Business Name" name="name" type="text" defaultValue={listing?.name} placeholder="e.g. Blue Lagoon Plumbing" required />

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-sm text-on-surface-variant ml-1">Category</label>
            <select name="categoryId" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface appearance-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" defaultValue={listing?.categoryId} required>
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Input label="Slug (URL Path)" name="slug" type="text" defaultValue={listing?.slug} placeholder="e.g. blue-lagoon-plumbing" required />
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-sm text-on-surface-variant ml-1">Layout Style</label>
            <select name="layout" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface appearance-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" defaultValue={listing?.layout || 'standard'} required>
              <option value="standard">Standard Listing</option>
              <option value="premium">Premium Landing Page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location & Contact */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-primary text-2xl font-bold">2.</span>
          <h2 className="font-headline-md text-2xl text-on-surface">Location & Contact</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-sm text-on-surface-variant ml-1">Island</label>
            <select name="islandId" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface appearance-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" defaultValue={listing?.islandId} required>
              <option value="">Select an island...</option>
              {islands.map(island => (
                <option key={island.id} value={island.id}>{island.name}</option>
              ))}
            </select>
          </div>
          <Input label="Phone Number" name="phone" type="tel" defaultValue={listing?.phone || ''} placeholder="+66 XX XXX XXXX" />
          <div className="flex flex-col gap-2 md:col-span-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-sm text-on-surface-variant ml-1">URLs to Crawl & AI Auto-Fill (Up to 5, one per line)</label>
              <button 
                type="button" 
                onClick={handleCrawlWebsite}
                disabled={isCrawling}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                {isCrawling ? 'Crawling...' : '🕸️ Auto-Fill from Websites'}
              </button>
            </div>
            <textarea 
              value={crawlUrlsValue} 
              onChange={(e) => setCrawlUrlsValue(e.target.value)}
              placeholder="https://example.com&#10;https://example.com/about" 
              rows={3}
              className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all w-full resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <Input label="Full Address" name="address" type="text" fullWidth defaultValue={listing?.address || ''} placeholder="123 Beach Rd, Koh Samui..." />
          </div>
          <Input 
            label="Primary Website"
            name="website" 
            type="url" 
            value={websiteValue} 
            onChange={(e) => setWebsiteValue(e.target.value)}
            placeholder="https://" 
          />
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-sm text-on-surface-variant ml-1">Business Hours</label>
            <input 
              name="hours" 
              type="text" 
              value={hoursValue}
              onChange={(e) => setHoursValue(e.target.value)}
              placeholder="e.g. Mon-Fri 9AM-5PM" 
              className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all w-full"
            />
          </div>
          <Input label="Latitude (Map Pin)" name="lat" type="number" step="any" defaultValue={listing?.lat ?? ''} placeholder="e.g. 9.5120" />
          <Input label="Longitude (Map Pin)" name="lng" type="number" step="any" defaultValue={listing?.lng ?? ''} placeholder="e.g. 100.0136" />
        </div>
      </div>

      {/* Description & Media */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-primary text-2xl font-bold">3.</span>
            <h2 className="font-headline-md text-2xl text-on-surface">Details</h2>
          </div>
          <button 
            type="button" 
            onClick={handleEnhanceSEO}
            disabled={isEnhancing}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md disabled:opacity-50"
          >
            {isEnhancing ? 'Enhancing...' : '✨ AI Enhance SEO'}
          </button>
        </div>
        <div className="flex flex-col gap-2 mb-6">
          <label className="font-label-md text-sm text-on-surface-variant ml-1">Business Description</label>
          <textarea 
            name="description" 
            className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" 
            rows={8} 
            value={descriptionValue} 
            onChange={(e) => setDescriptionValue(e.target.value)}
            placeholder="Describe what you do, your experience, and what makes your service great..." 
            required 
          />
        </div>
        <div className="flex flex-col gap-2 mb-6">
          <label className="font-label-md text-sm text-on-surface-variant ml-1">Cover Image URL</label>
          <input 
            name="image" 
            type="url" 
            value={imageValue}
            onChange={(e) => setImageValue(e.target.value)}
            placeholder="https://..." 
            className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all w-full"
          />
        </div>
      </div>

      {/* Products */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-primary text-2xl font-bold">4.</span>
          <h2 className="font-headline-md text-2xl text-on-surface">Products & Services</h2>
        </div>
        <p className="font-body-sm text-sm text-on-surface-variant mb-6">Add specific products or services to feature on your page (Premium layout recommended).</p>

        {products.map((product, index) => (
          <div key={index} className="bg-surface-container-low border border-outline-variant rounded-xl p-6 mb-6 flex flex-col gap-4">
            <input type="hidden" name={`products[${index}][id]`} value={product.id || 'new'} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Product Name" name={`products[${index}][name]`} type="text" value={product.name} onChange={e => updateProduct(index, 'name', e.target.value)} required />
              <Input label="Price (Optional)" name={`products[${index}][price]`} type="number" step="any" value={product.price || ''} onChange={e => updateProduct(index, 'price', e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
               <label className="font-label-md text-sm text-on-surface-variant ml-1">Description</label>
               <textarea name={`products[${index}][description]`} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" rows={2} value={product.description || ''} onChange={e => updateProduct(index, 'description', e.target.value)}></textarea>
            </div>
             <Input label="Image URL (Optional)" fullWidth name={`products[${index}][image]`} type="url" value={product.image || ''} onChange={e => updateProduct(index, 'image', e.target.value)} />

             <button type="button" onClick={() => removeProduct(index)} className="self-start mt-2 text-error font-label-md text-sm hover:underline">Remove Product</button>
          </div>
        ))}

        <button type="button" onClick={addProduct} className="text-primary font-label-md font-bold hover:underline">+ Add Product</button>
      </div>

      {/* Widgets */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center gap-3 mb-6">
           <span className="text-primary text-2xl font-bold">5.</span>
           <h2 className="font-headline-md text-2xl text-on-surface">Widgets & Extras</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-sm text-on-surface-variant ml-1">Social Links (JSON)</label>
              <button type="button" onClick={() => handleEnhanceWidget('socialLinks', socialLinksValue, setSocialLinksValue)} disabled={enhancingWidget === 'socialLinks'} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">✨ AI Format</button>
            </div>
            <textarea name="socialLinks" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none focus:border-primary focus:ring-1" rows={3} value={socialLinksValue} onChange={(e) => setSocialLinksValue(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-sm text-on-surface-variant ml-1">FAQs (JSON Array)</label>
              <button type="button" onClick={() => handleEnhanceWidget('faqs', faqsValue, setFaqsValue)} disabled={enhancingWidget === 'faqs'} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">✨ AI Enhance</button>
            </div>
            <textarea name="faqs" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none focus:border-primary focus:ring-1" rows={4} value={faqsValue} onChange={(e) => setFaqsValue(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-sm text-on-surface-variant ml-1">Special Offers (JSON Array)</label>
              <button type="button" onClick={() => handleEnhanceWidget('specialOffers', specialOffersValue, setSpecialOffersValue)} disabled={enhancingWidget === 'specialOffers'} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">✨ AI Enhance</button>
            </div>
            <textarea name="specialOffers" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none focus:border-primary focus:ring-1" rows={4} value={specialOffersValue} onChange={(e) => setSpecialOffersValue(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-sm text-on-surface-variant ml-1">Menu / Pricing (JSON Array)</label>
              <button type="button" onClick={() => handleEnhanceWidget('menu', menuValue, setMenuValue)} disabled={enhancingWidget === 'menu'} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">✨ AI Enhance</button>
            </div>
            <textarea name="menu" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none focus:border-primary focus:ring-1" rows={5} value={menuValue} onChange={(e) => setMenuValue(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-sm text-on-surface-variant ml-1">Video URLs (JSON Array of strings)</label>
            <textarea name="videoUrls" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none focus:border-primary focus:ring-1" rows={2} value={videoUrlsValue} onChange={(e) => setVideoUrlsValue(e.target.value)} />
          </div>
          
          <Input label="Booking URL" name="bookingUrl" type="url" fullWidth value={bookingUrlValue} onChange={(e) => setBookingUrlValue(e.target.value)} placeholder="https://" />

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-sm text-on-surface-variant ml-1">Trust Badges (JSON Array of strings)</label>
            <textarea name="trustBadges" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none focus:border-primary focus:ring-1" rows={2} value={trustBadgesValue} onChange={(e) => setTrustBadgesValue(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-sm text-on-surface-variant ml-1">Amenities (JSON Array of strings)</label>
            <textarea name="amenities" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none focus:border-primary focus:ring-1" rows={2} value={amenitiesValue} onChange={(e) => setAmenitiesValue(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-sm text-on-surface-variant ml-1">External Reviews (JSON Array of Embed URLs / Place IDs)</label>
              <button type="button" onClick={() => handleEnhanceWidget('externalReviews', externalReviewsValue, setExternalReviewsValue)} disabled={enhancingWidget === 'externalReviews'} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">✨ AI Format</button>
            </div>
            <textarea name="externalReviews" className="bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-on-surface resize-none focus:border-primary focus:ring-1" rows={3} value={externalReviewsValue} onChange={(e) => setExternalReviewsValue(e.target.value)} />
          </div>

        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Link href={cancelHref}>
          <Button type="button" variant="secondary" className="px-6 py-2.5">Cancel</Button>
        </Link>
        <Button type="submit" variant="primary" className="px-8 py-2.5 shadow-md active:scale-95">{submitLabel}</Button>
      </div>

    </form>
  );
}
