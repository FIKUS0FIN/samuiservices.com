import { Listing } from '@prisma/client';
import { Card } from '@/components/ui/Card';

type BusinessInfoProps = {
  business: Listing;
};

export function BusinessInfo({ business }: BusinessInfoProps) {
  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">About this business</h3>
      <p className="text-lg text-muted" style={{ lineHeight: 1.8 }}>
        {business.description}
      </p>
    </Card>
  );
}
