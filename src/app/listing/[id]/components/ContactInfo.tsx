import { MessageForm } from '@/components/features/MessageForm';
import { Listing } from '@prisma/client';
import { Card } from '@/components/ui/Card';

type ContactInfoProps = {
  business: Listing;
};

export function ContactInfo({ business }: ContactInfoProps) {
  return (
    <div style={{ width: '100%', maxWidth: '350px', position: 'sticky', top: '100px', flexShrink: 0 }}>
      <Card className="shadow-lg border-2 border-blue-50">
        <h3 className="text-xl font-bold mb-6 text-center border-b pb-4">Contact Business</h3>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              📞
            </div>
            <div>
              <div className="text-sm text-muted mb-1">Phone Number</div>
              <div className="font-bold text-lg">{business.phone}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              📍
            </div>
            <div>
              <div className="text-sm text-muted mb-1">Location</div>
              <div className="font-bold">{business.address}</div>
            </div>
          </div>
          <div className="mt-4">
             <MessageForm receiverId={business.userId} listingId={business.id} />
          </div>
        </div>
      </Card>
    </div>
  );
}
