import { Card } from '@/components/ui/Card';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/auth';
import { ListingForm } from '@/components/features/ListingForm';

export const metadata = {
  title: 'Add Your Business | Samui Services',
  description: 'Register your business on the premier directory for Koh Samui, Phangan, and Tao.',
};

export default async function AddListing() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/api/auth/signin?callbackUrl=/add-listing');
  }

  // Fetch categories and islands to populate dropdowns
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const islands = await prisma.island.findMany({ orderBy: { name: 'asc' } });

  async function createListing(formData: FormData) {
    'use server'
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

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
    const products: { name: string; price: number | null; description: string | null; image: string | null }[] = [];
    let i = 0;
    while (formData.has(`products[${i}][name]`)) {
      products.push({
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

    await prisma.listing.create({
      data: {
        slug,
        layout,
        products: {
          create: products
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
        userId: session.user.id
      }
    });

    revalidatePath('/');
    redirect('/dashboard');
  }

  return (
    <div className="section bg-surface min-h-screen">
      <div className="container max-w-[800px] pt-12">
        
        <div className="text-center mb-12">
          <h1 className="font-display text-display-md md:text-display-lg font-bold mb-4 text-primary drop-shadow-sm">Add Your Business</h1>
          <p className="font-body-lg text-on-surface-variant text-body-lg md:text-body-xl max-w-xl mx-auto">Connect with thousands of travelers and residents across the Thai islands. Start your registration below.</p>
        </div>

        <Card className="p-8 md:p-12 shadow-level-2 border border-outline-variant bg-surface-container-lowest rounded-card">
          <ListingForm
            action={createListing}
            categories={categories}
            islands={islands}
            submitLabel="Submit Listing"
          />
        </Card>

      </div>
    </div>
  );
}
