import { Metadata } from 'next';
import { CloudSun, Sun, CloudRain, ThermometerSun, Droplets, Wind } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koh Samui Weather - Samui Services',
  description: 'Live weather information and seasonal climate guide for Koh Samui.',
};

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-surface-hover/20 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pt-20 pb-16 px-6 border-b border-primary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <CloudSun className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-main mb-6">
            Koh Samui Weather
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Unlike the Andaman coast, the Gulf of Thailand has a slightly different weather pattern, making Samui an excellent summer destination with warm and humid tropical monsoon climate year-round.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-5xl space-y-16">
        
        {/* Live Weather Widget UI */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <ThermometerSun className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Live Weather Status</h2>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-lg text-white max-w-3xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <CloudSun className="w-24 h-24 text-blue-100" />
                <div>
                  <div className="text-5xl font-bold mb-2">29°C</div>
                  <div className="text-xl text-blue-100 font-medium">Partly Cloudy</div>
                  <div className="text-blue-200 text-sm mt-1">Feels like 33°C</div>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col gap-6 md:gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-200" />
                  <div>
                    <div className="text-sm text-blue-200">Humidity</div>
                    <div className="font-semibold">84%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wind className="w-5 h-5 text-blue-200" />
                  <div>
                    <div className="text-sm text-blue-200">Wind</div>
                    <div className="font-semibold">12 km/h</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-200/60 mt-6 pt-4 border-t border-white/10 italic text-center">
              (Widget integration placeholder. Real-time data API to be connected.)
            </p>
          </div>
        </section>

        {/* Seasonal Guide */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <CalendarDays className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">Seasonal Guide</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Sun className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Dry Season</h3>
              <div className="text-sm font-semibold text-amber-500 mb-4">Late December - April</div>
              <p className="text-text-muted text-sm leading-relaxed">
                The most popular time to visit. Plenty of sunshine, lower humidity, and calm seas. Ideal for diving, snorkeling, and island hopping.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                <ThermometerSun className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Hot Season</h3>
              <div className="text-sm font-semibold text-orange-500 mb-4">May - August</div>
              <p className="text-text-muted text-sm leading-relaxed">
                Very warm temperatures with occasional, short-lived afternoon tropical showers. The sea is still generally calm and great for swimming.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-muted hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <CloudRain className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Rainy Season</h3>
              <div className="text-sm font-semibold text-blue-500 mb-4">September - Early December</div>
              <p className="text-text-muted text-sm leading-relaxed">
                November is typically the wettest month with heavier downpours and rougher seas. However, it rarely rains all day.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// Re-importing CalendarDays explicitly for the section icon
import { CalendarDays } from 'lucide-react';
