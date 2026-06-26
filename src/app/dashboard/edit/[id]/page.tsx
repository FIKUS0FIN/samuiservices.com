import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/auth';
import Link from 'next/link';

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
    where: { id }
  });

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

    const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
    const lng = formData.get('lng') ? parseFloat(formData.get('lng') as string) : null;

    if (!name || !categoryId || !islandId || !description) {
      throw new Error("Missing required fields");
    }

    await prisma.listing.update({
      where: { id },
      data: {
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
    revalidatePath(`/listing/${id}`);
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
          <form action={updateListing} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Basic Info */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>1. Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input label="Business Name" name="name" type="text" defaultValue={listing.name} required />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Category</label>
                  <select name="categoryId" className="input-field" defaultValue={listing.categoryId} required>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>2. Location & Contact</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Island</label>
                  <select name="islandId" className="input-field" defaultValue={listing.islandId} required>
                    {islands.map(island => (
                      <option key={island.id} value={island.id}>{island.name}</option>
                    ))}
                  </select>
                </div>
                <Input label="Phone Number" name="phone" type="tel" defaultValue={listing.phone || ''} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Full Address" name="address" type="text" fullWidth defaultValue={listing.address || ''} />
                </div>
                <Input label="Website" name="website" type="url" defaultValue={listing.website || ''} placeholder="https://" />
                <Input label="Business Hours" name="hours" type="text" defaultValue={listing.hours || ''} placeholder="e.g. Mon-Fri 9AM-5PM" />
                <Input label="Latitude (Map Pin)" name="lat" type="number" step="any" defaultValue={listing.lat || ''} />
                <Input label="Longitude (Map Pin)" name="lng" type="number" step="any" defaultValue={listing.lng || ''} />
              </div>
            </div>

            {/* Description & Media */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>3. Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Business Description</label>
                <textarea name="description" className="input-field" rows={5} defaultValue={listing.description} required></textarea>
              </div>
              <Input label="Cover Image URL (Temporary)" name="image" type="url" fullWidth defaultValue={listing.image || ''} placeholder="https://..." />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Link href="/dashboard">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
}
