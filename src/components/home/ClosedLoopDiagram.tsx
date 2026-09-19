import React from 'react';
import { 
  FileText, 
  Scan, 
  Search, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Package, 
  Recycle, 
  HeartPulse,
  ArrowRight,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { HeartbeatRecycleLogo } from '../brand/HeartbeatRecycleLogo';

export const ClosedLoopDiagram: React.FC = () => {
  return (
    <section aria-label="Closed-loop medicine flow" className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-semibold mb-3 shadow-2xs">
            <HeartbeatRecycleLogo size="sm" variant="emerald" className="!w-5 !h-5 !rounded-md" />
            <span>Closed Loop Healthcare & Life-Cycle</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            How MediCycle Creates a Safe Closed Loop
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Eliminating medicine waste while ensuring clinical safety, non-substitution guarantees, and genuine patient affordability.
          </p>
        </div>

        <div className="space-y-10">
          {/* Loop 1: Patient Demand Journey */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <h3 className="font-display font-bold text-lg text-stone-900">
                Loop 1: Patient Prescription Access
              </h3>
              <span className="text-xs text-stone-500 hidden sm:inline">— Demand & Sourcing</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col items-center">
                <FileText className="w-6 h-6 text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-stone-900">1. Prescription</span>
                <span className="text-[11px] text-stone-500">Photo or PDF upload</span>
              </div>

              <div className="hidden md:flex items-center justify-center text-stone-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col items-center">
                <Scan className="w-6 h-6 text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-stone-900">2. AI Scan</span>
                <span className="text-[11px] text-stone-500">Name, dose & qty extraction</span>
              </div>

              <div className="hidden md:flex items-center justify-center text-stone-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col items-center">
                <Search className="w-6 h-6 text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-stone-900">3. Find Availability</span>
                <span className="text-[11px] text-stone-500">Pharmacies & verified donors</span>
              </div>

              <div className="hidden md:flex items-center justify-center text-stone-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col items-center">
                <Scale className="w-6 h-6 text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-stone-900">4. Compare Cost</span>
                <span className="text-[11px] text-stone-500">Highlights lowest estimate</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Final Step: Pharmacist verification at collection ensures zero unauthorized substitution
              </span>
              <span className="bg-stone-100 px-2.5 py-1 rounded-full text-stone-600">
                Status Tracker: Requested → Accepted → Reserved → Collected
              </span>
            </div>
          </div>

          {/* Loop 2: Donor Supply & Safety Review */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-amber-600" />
              <h3 className="font-display font-bold text-lg text-stone-900">
                Loop 2: Unused Medicine Redistribution
              </h3>
              <span className="text-xs text-stone-500 hidden sm:inline">— Supply & Safety Verification</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col items-center">
                <Package className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs font-bold text-stone-900">1. Unused Medicine</span>
                <span className="text-[11px] text-stone-500">Donor lists spare packs</span>
              </div>

              <div className="hidden md:flex items-center justify-center text-stone-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col items-center">
                <ShieldCheck className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs font-bold text-stone-900">2. Safety Review</span>
                <span className="text-[11px] text-stone-500">≥90 days expiry & sealed blister</span>
              </div>

              <div className="hidden md:flex items-center justify-center text-stone-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col items-center">
                <Recycle className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs font-bold text-stone-900">3. Verified Inventory</span>
                <span className="text-[11px] text-stone-500">100% Free patient access</span>
              </div>

              <div className="hidden md:flex items-center justify-center text-stone-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col items-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-stone-900">4. Redistribution</span>
                <span className="text-[11px] text-stone-500">Matched with verified Rx</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Expiry Guard: Expired or unsealed medicines are immediately flagged and routed to safe disposal
              </span>
              <span className="bg-amber-50 text-amber-900 px-2.5 py-1 rounded-full font-medium">
                100% Free Donated Stock for Eligible Low-Income Needs
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
