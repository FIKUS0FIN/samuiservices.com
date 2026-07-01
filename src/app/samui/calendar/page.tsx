import { Metadata } from 'next';
import { InteractiveCalendar } from '@/components/features/InteractiveCalendar';

export const metadata: Metadata = {
  title: 'Koh Samui Events Calendar - Samui Services',
  description: 'Interactive calendar for Koh Samui showing national holidays and local events.',
};

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-primary mb-4 text-center">Island Calendar</h1>
        <p className="text-lg text-text-muted mb-10 text-center max-w-2xl mx-auto">
          Plan your trip around major Thai national holidays and popular local events on Koh Samui and neighboring islands.
        </p>
        
        <InteractiveCalendar />
      </div>
    </div>
  );
}
