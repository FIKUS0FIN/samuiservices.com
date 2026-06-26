import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/auth';

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
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;

    const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
    const lng = formData.get('lng') ? parseFloat(formData.get('lng') as string) : null;

    if (!name || !categoryId || !islandId || !description) {
      throw new Error("Missing required fields");
    }

    await prisma.listing.create({
      data: {
        name,
        categoryId,
        islandId,
        phone,
        address,
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
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Add Your Business</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Join the largest service directory in the Gulf of Thailand.</p>
        </div>

        <Card style={{ padding: '3rem' }}>
          <form action={createListing} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Basic Info */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>1. Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input label="Business Name" name="name" type="text" placeholder="e.g. Samui Builders Pro" required />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Category</label>
                  <select name="categoryId" className="input-field" required>
                    <option value="">Select a category...</option>
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
                  <select name="islandId" className="input-field" required>
                    <option value="">Select an island...</option>
                    {islands.map(island => (
                      <option key={island.id} value={island.id}>{island.name}</option>
                    ))}
                  </select>
                </div>
                <Input label="Phone Number" name="phone" type="tel" placeholder="+66 XX XXX XXXX" />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Full Address" name="address" type="text" fullWidth placeholder="123 Beach Rd, Koh Samui..." />
                </div>
                <Input label="Latitude (Map Pin)" name="lat" type="number" step="any" placeholder="e.g. 9.5120" />
                <Input label="Longitude (Map Pin)" name="lng" type="number" step="any" placeholder="e.g. 100.0136" />
              </div>
            </div>

            {/* Description & Media */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>3. Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Business Description</label>
                <textarea name="description" className="input-field" rows={5} placeholder="Describe what you do, your experience, and what makes your service great..." required></textarea>
              </div>
              <Input label="Cover Image URL (Temporary)" name="image" type="url" fullWidth placeholder="https://..." />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Link href="/dashboard">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" variant="primary">Submit Listing</Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
}
