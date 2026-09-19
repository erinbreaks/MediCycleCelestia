import React from 'react';
import { 
  Trash2, 
  AlertOctagon, 
  MapPin, 
  ShieldAlert, 
  Check, 
  X, 
  Droplets,
  Phone,
  Building
} from 'lucide-react';

export const SafeDisposalGuide: React.FC = () => {
  return (
    <section aria-label="Safe medicine disposal guide" className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-3 border border-red-200">
            <Trash2 className="w-3.5 h-3.5" /> Environmental Stewardship
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Safe Disposal Routing Protocol
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Ineligible, damaged, or expired medicines must never enter the redistribution loop or community landfills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Eligibility vs Disposal Checklist */}
          <div className="bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200">
            <h3 className="font-display font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Triage Rules: What Can & Cannot Be Donated
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80">
                <div className="font-bold text-emerald-900 flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  Eligible for MediCycle Donation:
                </div>
                <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                  <li>Unopened, fully intact blister or strip foil packaging</li>
                  <li>At least 90 days remaining before labeled expiry date</li>
                  <li>Original manufacturer batch number & label visible</li>
                  <li>Stored in dry, temperature-regulated domestic conditions</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border border-red-200/80">
                <div className="font-bold text-red-900 flex items-center gap-2 mb-2">
                  <X className="w-4 h-4 text-red-700" />
                  Requires Safe Disposal Routing (Ineligible):
                </div>
                <ul className="space-y-1 text-red-800 list-disc list-inside">
                  <li>Expired medicines (&lt; 0 days) or expiring in &lt; 90 days</li>
                  <li>Opened bottles, uncapped syrups, or severed blister pockets</li>
                  <li>Temperature-sensitive biologics or opened insulin pens</li>
                  <li>Scheduled narcotic / controlled psychotropic substances</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Droplets className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Never flush down sinks or toilets:</strong> Pharmaceuticals pass through water treatment plants into drinking rivers, causing antimicrobial resistance and ecological toxicity.
              </span>
            </div>
          </div>

          {/* Authorized Disposal Drop Bins */}
          <div className="bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200">
            <h3 className="font-display font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              Authorized Safe Disposal Drop Points
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-4">
              Drop off ineligible medications at certified high-temperature biomedical incineration drop bins:
            </p>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 bg-white rounded-2xl border border-stone-200 flex items-start justify-between">
                <div>
                  <div className="font-bold text-stone-900">MediCycle Central Drop Box #1</div>
                  <div className="text-stone-500 text-xs mt-0.5">Indiranagar 100 Ft Road, Next to Metro Station</div>
                  <div className="text-emerald-700 font-medium text-xs mt-1">Open 24/7 • Free Secure Drop Box</div>
                </div>
                <span className="text-xs bg-stone-100 px-2 py-1 rounded-md text-stone-600 font-semibold">1.2 km</span>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-stone-200 flex items-start justify-between">
                <div>
                  <div className="font-bold text-stone-900">Domlur Community Health Center</div>
                  <div className="text-stone-500 text-xs mt-0.5">HAL 2nd Stage, Domlur Ring Road</div>
                  <div className="text-emerald-700 font-medium text-xs mt-1">Mon - Sat: 8:00 AM - 8:00 PM</div>
                </div>
                <span className="text-xs bg-stone-100 px-2 py-1 rounded-md text-stone-600 font-semibold">2.4 km</span>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-stone-200 flex items-start justify-between">
                <div>
                  <div className="font-bold text-stone-900">St. John Hospital Eco-Disposal Cell</div>
                  <div className="text-stone-500 text-xs mt-0.5">Sarjapur Main Road, Koramangala</div>
                  <div className="text-emerald-700 font-medium text-xs mt-1">Biomedical Certified Disposal Hub</div>
                </div>
                <span className="text-xs bg-stone-100 px-2 py-1 rounded-md text-stone-600 font-semibold">3.8 km</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                Disposal Hotline: 1800-MED-CYCLE
              </span>
              <span className="text-emerald-700 font-semibold">Zero Cost Disposal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
