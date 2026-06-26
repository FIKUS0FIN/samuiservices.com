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
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const website = formData.get('website') as string;
    const hours = formData.get('hours') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;
    const slug = formData.get('slug') as string;
    const layout = formData.get('layout') as string;

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

    const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
    const lng = formData.get('lng') ? parseFloat(formData.get('lng') as string) : null;

    if (!name || !categoryId || !islandId || !description || !slug || !layout) {
      throw new Error("Missing required fields");
    }

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
        phone,
        address,
        website,
        hours,
        lat,
        lng,
        description,
        image,
      }
    });

    revalidatePath('/');
    revalidatePath(`/listing/${currentListing.slug}`);
    redirect('/dashboard');
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Edit Listing</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Update your business details and photos.</p>
        </div>

        <Card style={{ padding: '3rem' }}>
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
