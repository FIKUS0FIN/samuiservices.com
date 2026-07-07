import { Metadata } from 'next';
import Image from 'next/image';
import { Key, Car, Bike, AlertTriangle, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Car & Scooter Rental Guide (2026 Prices)',
  description: 'Get standard car and scooter rental prices on Koh Samui for 2026. Learn about IDP requirements, safety regulations, and how to avoid scams. ✓',
};

export default function RentalsPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=2000"
            alt="Riding a scooter along the scenic Koh Samui coastline" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <Key className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Vehicle Rental Guide
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Your ultimate 2026 handbook for exploring Koh Samui safely. Review standard market rates, licensing rules, and insurance checklists.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Scooter Rentals */}
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
            <div className="h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800"
                alt="Scooter parked on tropical island beach"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-text-main shadow-sm text-sm">
                <Bike className="w-4 h-4 text-primary" /> Scooters & Motorbikes
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col justify-between">
              <div>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  The most agile and popular option for navigating Samui's traffic and narrow side roads. Ideal for solo travelers and couples.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                    <span className="font-semibold text-text-main text-sm">Standard (Honda Click, 125cc)</span>
                    <span className="text-primary font-bold text-sm">150 - 250 THB/day</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                    <span className="font-semibold text-text-main text-sm">Premium (Honda PCX, 160cc)</span>
                    <span className="text-primary font-bold text-sm">300 - 500 THB/day</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                    <span className="font-semibold text-text-main text-sm">Heavy (Yamaha TMAX, 530cc)</span>
                    <span className="text-primary font-bold text-sm">800 - 1,200 THB/day</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="font-semibold text-text-main text-sm">Monthly Rate (Standard Click)</span>
                    <span className="text-primary font-bold text-sm">~3,500 - 5,000 THB</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-2xl p-4 text-xs text-text-muted border border-primary/20 leading-relaxed">
                <strong>Legal Requirement:</strong> Requires an International Driving Permit (IDP) with a valid motorcycle endorsement. Helmets are legally mandatory for both rider and passenger.
              </div>
            </div>
          </div>

          {/* Car Rentals */}
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
            <div className="h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
                alt="Car driving along tropical cliff side road"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-text-main shadow-sm text-sm">
                <Car className="w-4 h-4 text-primary" /> Cars & SUVs
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col justify-between">
              <div>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  Highly recommended for families, groups, or driving during the wet season. Provides safety and air-conditioned comfort.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                    <span className="font-semibold text-text-main text-sm">Economy (Toyota Yaris/Vios)</span>
                    <span className="text-primary font-bold text-sm">800 - 1,200 THB/day</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                    <span className="font-semibold text-text-main text-sm">Family Sedan (Honda Civic)</span>
                    <span className="text-primary font-bold text-sm">1,200 - 1,600 THB/day</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                    <span className="font-semibold text-text-main text-sm">Large SUV (Toyota Fortuner)</span>
                    <span className="text-primary font-bold text-sm">1,800 - 2,500+ THB/day</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="font-semibold text-text-main text-sm">Monthly Rate (Economy)</span>
                    <span className="text-primary font-bold text-sm">~16,000 - 22,000 THB</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-2xl p-4 text-xs text-text-muted border border-primary/20 leading-relaxed">
                <strong>Legal Requirement:</strong> Requires a valid driver's license from your home country, accompanied by an IDP. Security deposit (usually 3,000 - 5,000 THB) is mandatory.
              </div>
            </div>
          </div>

        </div>

        {/* Safety & Best Practices Checklist */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Essential Rental Tips</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-text-main flex items-center gap-2 mb-3 text-base">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Document Everything
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Before driving away, make a comprehensive video walkthrough of the vehicle. Take detailed photos of all pre-existing scratches, scuffs, or dents. This protects you from false damage disputes.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-text-main flex items-center gap-2 mb-3 text-base">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Check the Insurance
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Ask for "First Class Insurance" with excess waiver for peace of mind. Standard government insurance only covers basic third-party medical care, not damage to your rental vehicle.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-text-main flex items-center gap-2 mb-3 text-base">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Passport Collateral
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Never hand over your original passport as collateral to a rental shop. Reputable rental companies will accept a passport photocopy and a cash deposit instead. Your passport is your vital government document.
              </p>
            </div>
          </div>
        </section>

        {/* Legal Licensing Details Widget */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Driving Legally in Thailand</h2>
          </div>
          <p className="text-text-muted mb-8 leading-relaxed text-sm">
            Avoid fines, arrests, and voiding your travel insurance by complying with the local regulations:
          </p>
          <div className="grid sm:grid-cols-2 gap-8 text-xs text-text-muted">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <p><strong>International Driving Permit (IDP):</strong> To drive legally, you must carry your national driving license alongside an IDP. For scooters, your IDP must explicitly list a motorcycle endorsement.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <p><strong>Helmet Laws:</strong> Helmets are mandatory for both riders and passengers. Police carry out regular checkpoints in Chaweng, Bophut, and Lamai. Fines are generally 500 to 1,000 THB.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <p><strong>Left-Side Driving:</strong> Traffic drives on the left in Thailand. Roads can be sandy or wet, making braking hazardous on scooters—drive slowly and use front and rear brakes simultaneously.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <p><strong>Alcohol Limits:</strong> The legal blood alcohol concentration (BAC) limit is 0.05% (0.5 g/l). Driving under the influence carries strict penalties, jail time, and automatically voids insurance policies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Local Expert Verification (E-E-A-T) */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/50 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-text-main text-lg mb-1">Local Expert Verified</h4>
            <p className="text-text-muted text-sm leading-relaxed">
              This guide was researched, compiled, and is regularly updated by our Koh Samui editorial team. We visit every location first-hand and check local listings to ensure you receive accurate and trustworthy information.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
