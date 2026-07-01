import { Metadata } from 'next';
import { Cross, MapPin, Phone, Clock, HeartPulse, Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Hospitals & Medical Care - Samui Services',
  description: 'Information about major international and government hospitals on Koh Samui.',
};

export default function HospitalsPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pt-20 pb-16 px-6 border-b border-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main mb-6">
            Hospitals & Medical Care
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Koh Samui offers excellent medical facilities, ranging from premium international hospitals to capable government hospitals and local clinics to ensure your health and safety.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-5xl space-y-16">
        
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">International Hospitals</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-2">Bangkok Hospital Samui</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                The most well-known premium international hospital on the island, offering a wide range of specialized services, emergency care, and international standard facilities.
              </p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Chaweng Noi</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24 Hours Emergency</div>
                <div className="flex items-center gap-2 text-text-muted"><Phone className="w-4 h-4 text-primary" /> 1719 (Hotline)</div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-2">Samui International Hospital</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Located centrally in Chaweng, this hospital caters largely to tourists and expats, offering excellent medical, dental, and emergency care.
              </p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Chaweng Beach Road</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24 Hours Emergency</div>
                <div className="flex items-center gap-2 text-text-muted"><Phone className="w-4 h-4 text-primary" /> +66 (0) 77 332 654</div>
              </div>
            </div>
            
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-2">Thai International Hospital</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                Another reputable private hospital offering high-quality care, modern equipment, and a wide array of specialist departments at competitive prices.
              </p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Bophut</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24 Hours Emergency</div>
                <div className="flex items-center gap-2 text-text-muted"><Phone className="w-4 h-4 text-primary" /> +66 (0) 77 332 791</div>
              </div>
            </div>
            
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold text-text-main mb-2">Bandon International Hospital</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">
                A smaller but highly capable private hospital near the Big C Supercenter, providing excellent outpatient and emergency services.
              </p>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-muted/50">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Bophut</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24 Hours Emergency</div>
                <div className="flex items-center gap-2 text-text-muted"><Phone className="w-4 h-4 text-primary" /> +66 (0) 77 245 236</div>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Cross className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Government Hospitals</h2>
          </div>
          
          <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-primary/30 transition-colors">
            <h3 className="text-xl font-bold text-text-main mb-2">Koh Samui Hospital (Nathon)</h3>
            <p className="text-text-muted text-sm leading-relaxed mb-4 max-w-2xl">
              The main government hospital on the island. While wait times can be longer than private hospitals, it offers excellent care, very affordable pricing, and is the primary center for dealing with serious emergencies or complex cases.
            </p>
            <div className="space-y-2 text-sm pt-4 border-t border-outline-muted/50 max-w-2xl">
              <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Nathon</div>
              <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24 Hours Emergency</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
