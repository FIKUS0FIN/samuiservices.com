import { Card } from '@/components/ui/Card';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/auth';
import { ListingForm } from '@/components/features/ListingForm';

export const metadata = {
  title: 'Edit Listing | Samui Services',
};

export default async function EditListing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect('/api/auth/signin');
  }

  const listing = await prisma.listing.findUnique({
    where: { id }, include: { products: true } });

  if (!listing) {
    notFound();
  }

  // Ensure only the owner or an ADMIN can edit this
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isAdmin = user?.role === 'ADMIN';

  if (listing.userId !== session.user.id && !isAdmin) {
    redirect('/dashboard');
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const islands = await prisma.island.findMany({ orderBy: { name: 'asc' } });

  async function updateListing(formData: FormData) {
    'use server'
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error("Unauthorized");

    // Re-verify permissions inside server action
    const currentListing = await prisma.listing.findUnique({ where: { id } });
    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!currentListing) throw new Error("Not found");
    if (currentListing.userId !== session.user.id && currentUser?.role !== 'ADMIN') {
      throw new Error("Unauthorized");
    }

    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const islandId = formData.get('islandId') as string;
    const subdistrict = formData.get('subdistrict') as string || null;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const website = formData.get('website') as string;
    const hours = formData.get('hours') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;
    const slug = formData.get('slug') as string;
    const layout = formData.get('layout') as string;
    const mapLink = formData.get('mapLink') as string || null;
    const keywordsRaw = formData.get('keywords') as string;
    const services = keywordsRaw 
      ? JSON.stringify(keywordsRaw.split(',').map(s => s.trim()).filter(s => s))
      : null;
    const galleryImages = formData.get('galleryImages') as string || null;
    const socialLinks = formData.get('socialLinks') as string || null;
    const faqs = formData.get('faqs') as string || null;
    const specialOffers = formData.get('specialOffers') as string || null;
    const menu = formData.get('menu') as string || null;
    const videoUrls = formData.get('videoUrls') as string || null;
    const bookingUrl = formData.get('bookingUrl') as string || null;
    const trustBadges = formData.get('trustBadges') as string || null;
    const amenities = formData.get('amenities') as string || null;
    const externalReviews = formData.get('externalReviews') as string || null;

    // Extract products
    const products: { id: string; name: string; price: number | null; description: string | null; image: string | null }[] = [];
    let i = 0;
    while (formData.has(`products[${i}][name]`)) {
      products.push({
        id: formData.get(`products[${i}][id]`) as string,
        name: formData.get(`products[${i}][name]`) as string,
        price: formData.get(`products[${i}][price]`) ? parseFloat(formData.get(`products[${i}][price]`) as string) : null,
        description: formData.get(`products[${i}][description]`) as string || null,
        image: formData.get(`products[${i}][image]`) as string || null,
      });
      i++;
    }

    let lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
    let lng = formData.get('lng') ? parseFloat(formData.get('lng') as string) : null;

    if (lat === null || lng === null) {
      const mapLinkVal = mapLink || '';
      const atMatch = mapLinkVal.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        if (lat === null) lat = parseFloat(atMatch[1]);
        if (lng === null) lng = parseFloat(atMatch[2]);
      } else {
        const qMatch = mapLinkVal.match(/[?&](q|ll|query)=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (qMatch) {
          if (lat === null) lat = parseFloat(qMatch[2]);
          if (lng === null) lng = parseFloat(qMatch[3]);
        }
      }
    }

    if (!name || !categoryId || !islandId || !description || !slug || !layout) {
      throw new Error("Missing required fields");
    }

    // Consolidated rating calculation
    let googleRating = 0;
    let googleCount = 0;
    if (externalReviews) {
      try {
        const parsed = JSON.parse(externalReviews);
        if (parsed && typeof parsed === 'object') {
          googleRating = parseFloat(parsed.rating) || 0;
          googleCount = parseInt(parsed.reviewCount) || 0;
        }
      } catch (e) {
        console.error("Error parsing Google Reviews:", e);
      }
    }

    const localReviews = await prisma.review.findMany({ where: { listingId: id } });
    const localCount = localReviews.length;
    const localRatingSum = localReviews.reduce((sum, r) => sum + r.rating, 0);

    const totalCount = googleCount + localCount;
    const averageRating = totalCount > 0 
      ? (googleRating * googleCount + localRatingSum) / totalCount 
      : 0;

    // Handle products update by deleting old and creating new (simplified for this example)
    await prisma.product.deleteMany({ where: { listingId: id } });

    await prisma.listing.update({
      where: { id },
      data: {
        slug,
        layout,
        products: {
          create: products.map(p => ({
            name: p.name,
            price: p.price,
            description: p.description,
            image: p.image
          }))
        },
        name,
        categoryId,
        islandId,
        subdistrict,
        phone,
        address,
        website,
        hours,
        lat,
        lng,
        mapLink,
        services,
        galleryImages,
        description,
        image,
        averageRating,
        reviewCount: totalCount,
        socialLinks,
        faqs,
        specialOffers,
        menu,
        videoUrls,
        bookingUrl,
        trustBadges,
        amenities,
        externalReviews,
      }
    });

    revalidatePath('/');
    revalidatePath(`/listing/${currentListing.slug}`);
    redirect('/dashboard');
  }

  return (
    <div className="section bg-surface">
      <div className="container max-w-[800px]">
        
        <div className="text-center mb-12">
          <h1 className="text-display-md md:text-display-lg font-bold mb-4 text-on-surface drop-shadow-sm">Edit Listing</h1>
          <p className="text-on-surface-variant text-body-lg md:text-body-xl">Update your business details and photos.</p>
        </div>

        <Card className="p-8 md:p-12 shadow-level-2 border border-outline-variant bg-surface-container-lowest rounded-card">
          <ListingForm
            action={updateListing}
            listing={listing}
            categories={categories}
            islands={islands}
            submitLabel="Save Changes"
          />
        </Card>

      </div>
    </div>
  );
}
