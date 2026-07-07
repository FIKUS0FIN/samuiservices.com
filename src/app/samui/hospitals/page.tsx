import { Metadata } from 'next';
import Image from 'next/image';
import { Cross, MapPin, Phone, Clock, HeartPulse, Activity, ShieldCheck, Ambulance, FileSpreadsheet } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Hospitals & Emergency Medical Care (2026)',
  description: 'Find the best international and government hospitals on Koh Samui. Learn about English-speaking staff, 24/7 emergency services, and medical insurance! ✓',
};

export default function HospitalsPage() {
  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface overflow-x-hidden pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1519494026892-80bbd2d6fd0d.jpg?auto=format&fit=crop&q=80&w=2000"
            alt="Modern clinic counter with friendly professional environment" 
            fill
            className="object-cover"
            priority sizes="(max-width: 768px) 100vw, 1200px"/>
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-4 text-white shadow-md">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h1 className="font-display text-display md:text-display text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Hospitals & Medical Care
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Your safety and health are paramount. Review Koh Samui&apos;s premium international private clinics, government hospitals, and emergency guidelines.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-5xl space-y-16">
        
        {/* International Private Hospitals */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">International Private Hospitals</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Bangkok Hospital Samui */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1629909613654-28e377c37b09.jpg?auto=format&fit=crop&q=80&w=800"
                  alt="Bangkok Hospital Samui"
                  fill
                  className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
                <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Premium Care (JCI Accredited)
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Bangkok Hospital Samui</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    The premier private hospital on the island, featuring state-of-the-art facilities, specialized departments, ICU beds, and multi-lingual staff. Works directly with most major international travel insurers.
                  </p>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Chaweng Noi (Main Ring Road)</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24/7 Emergency Care & ICU</div>
                  <div className="flex items-center gap-2 text-text-muted font-bold text-primary"><Phone className="w-4 h-4" /> 1719 (National Hotline) / +66 77 429 500</div>
                </div>
              </div>
            </div>

            {/* Samui International Hospital */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1629909613654-28e377c37b09.jpg?auto=format&fit=crop&q=80&w=800"
                  alt="Samui International Hospital"
                  fill
                  className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
                <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Tourist & Expat Favorite
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Samui International Hospital</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    Located centrally in northern Chaweng, this hospital has long served travelers and expats. Offers comprehensive dental care, general surgery, and cosmetic medicine alongside primary emergency response.
                  </p>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Northern Chaweng Beach Road</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24/7 Emergency Room</div>
                  <div className="flex items-center gap-2 text-text-muted font-bold text-primary"><Phone className="w-4 h-4" /> +66 77 230 781</div>
                </div>
              </div>
            </div>

            {/* Thai International Hospital */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1519494026892-80bbd2d6fd0d.jpg?auto=format&fit=crop&q=80&w=800"
                  alt="Thai International Hospital"
                  fill
                  className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Thai International Hospital</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    A modern private hospital located near Bophut, offering high-quality medical services, comprehensive diagnostic imaging (CT scans), and specialized surgical departments at highly competitive private rates.
                  </p>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Bophut (Near Big C Supercenter)</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24/7 Emergency Room</div>
                  <div className="flex items-center gap-2 text-text-muted font-bold text-primary"><Phone className="w-4 h-4" /> +66 77 332 654</div>
                </div>
              </div>
            </div>

            {/* Bandon International Hospital */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 relative">
                <Image 
                  src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1629909613654-28e377c37b09.jpg?auto=format&fit=crop&q=80&w=800"
                  alt="Bandon International Hospital"
                  fill
                  className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Bandon International Hospital</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    A smaller private medical center situated along the main ring road. Renowned for its efficient outpatient services, dive medicine (hyperbaric chamber coordination), and quick emergency treatment.
                  </p>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Bophut subdistrict</div>
                  <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24/7 Emergency Services</div>
                  <div className="flex items-center gap-2 text-text-muted font-bold text-primary"><Phone className="w-4 h-4" /> +66 77 245 236</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Public Government Hospital */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Cross className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main m-0">Government Public Hospital</h2>
          </div>
          
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/50 flex flex-col lg:flex-row hover:shadow-md transition-all duration-300">
            <div className="w-full lg:w-1/3 h-64 lg:h-auto min-h-[250px] relative">
              <Image 
                src="https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/explore/photo-1519494026892-80bbd2d6fd0d.jpg?auto=format&fit=crop&q=80&w=800"
                alt="Koh Samui Hospital Nathon"
                fill
                className="object-cover" sizes="(max-width: 768px) 100vw, 400px"/>
            </div>
            <div className="w-full lg:w-2/3 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-text-main mb-2">Koh Samui Government Hospital</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  The primary public hospital on the island, situated in the capital town of Nathon. While waiting times can be significantly longer than in private hospitals, it offers highly capable care at a fraction of the cost. It is the primary facility for serious trauma and complex operations.
                </p>
              </div>
              <div className="space-y-2 text-sm pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-4 h-4 text-primary" /> Nathon Town (West Coast)</div>
                <div className="flex items-center gap-2 text-text-muted"><Clock className="w-4 h-4 text-primary" /> 24/7 Emergency Department</div>
                <div className="flex items-center gap-2 text-text-muted font-bold text-primary"><Phone className="w-4 h-4" /> +66 77 421 230</div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency & Insurance Procedures Widget */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/50">
          <div className="flex items-center gap-3 mb-6">
            <Ambulance className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-text-main m-0">Emergency Procedures</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary h-12 w-12 flex items-center justify-center shrink-0"><Phone className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-text-main mb-1 text-sm">Ambulance Hotline (1669)</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  In the event of a severe accident or life-threatening emergency, dial <strong>1669</strong>. This is the Thai national medical emergency line, routing you directly to public hospital dispatch. For English assistance, you can also contact the Tourist Police at <strong>1155</strong>.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary h-12 w-12 flex items-center justify-center shrink-0"><FileSpreadsheet className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-text-main mb-1 text-sm">Insurance & Payment Claims</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Before visiting private hospitals, contact your travel insurer to initiate a claim file. Private hospitals will require your passport, insurance certificate, and often a credit card pre-authorization before admiting you for non-life-threatening treatments.
                </p>
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
