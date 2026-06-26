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
  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Basic Info */}
      <div>
        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>1. Basic Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <Input label="Business Name" name="name" type="text" defaultValue={listing?.name} placeholder="e.g. Samui Builders Pro" required />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Category</label>
            <select name="categoryId" className="input-field" defaultValue={listing?.categoryId} required>
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
            <select name="islandId" className="input-field" defaultValue={listing?.islandId} required>
              <option value="">Select an island...</option>
              {islands.map(island => (
                <option key={island.id} value={island.id}>{island.name}</option>
              ))}
            </select>
          </div>
          <Input label="Phone Number" name="phone" type="tel" defaultValue={listing?.phone || ''} placeholder="+66 XX XXX XXXX" />
          <div style={{ gridColumn: '1 / -1' }}>
            <Input label="Full Address" name="address" type="text" fullWidth defaultValue={listing?.address || ''} placeholder="123 Beach Rd, Koh Samui..." />
          </div>
          <Input label="Website" name="website" type="url" defaultValue={listing?.website || ''} placeholder="https://" />
          <Input label="Business Hours" name="hours" type="text" defaultValue={listing?.hours || ''} placeholder="e.g. Mon-Fri 9AM-5PM" />
          <Input label="Latitude (Map Pin)" name="lat" type="number" step="any" defaultValue={listing?.lat ?? ''} placeholder="e.g. 9.5120" />
          <Input label="Longitude (Map Pin)" name="lng" type="number" step="any" defaultValue={listing?.lng ?? ''} placeholder="e.g. 100.0136" />
        </div>
      </div>

      {/* Description & Media */}
      <div>
        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>3. Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Business Description</label>
          <textarea name="description" className="input-field" rows={5} defaultValue={listing?.description} placeholder="Describe what you do, your experience, and what makes your service great..." required></textarea>
        </div>
        <Input label="Cover Image URL (Temporary)" name="image" type="url" fullWidth defaultValue={listing?.image || ''} placeholder="https://..." />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <Link href={cancelHref}>
          <Button type="button" variant="secondary">Cancel</Button>
        </Link>
        <Button type="submit" variant="primary">{submitLabel}</Button>
      </div>

    </form>
  );
}
