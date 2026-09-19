import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Recycle, 
  Users, 
  Award, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2,
  Stethoscope
} from 'lucide-react';
import { PortalView } from '../../types';

interface AboutUsSectionProps {
  onNavigate: (view: PortalView) => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ onNavigate }) => {
  return (
    <section id="about-us-section" aria-label="About MediCycle" className="py-20 bg-stone-100/70 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3 border border-emerald-200">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
            Our Mission & Purpose
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Giving Medicines a Second Life
          </h2>
          <p className="text-stone-600 text-sm sm:text-base lg:text-lg mt-4 leading-relaxed">
            Every year across India, an estimated ₹12,000 Crore worth of intact, unexpired medicines are thrown away, 
            while millions of families struggle with critical out-of-pocket pharmaceutical expenses. MediCycle bridges 
            this divide with a safe, verified, and community-driven redistribution network.
          </p>
        </div>

        {/* Narrative & Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                Born in Bengaluru, built for healthcare dignity and environmental safety.
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                MediCycle was founded by a coalition of clinical pharmacists, public health researchers, and technocrats 
                committed to solving pharmaceutical wastage. When a patient completes a course of therapy or switches prescriptions, 
                their remaining sealed strips shouldn't sit forgotten in a drawer until expiration.
              </p>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                By creating a transparent verification protocol, partnering with neighborhood licensed chemists, and integrating 
                India's <strong>Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)</strong> generic databases, we empower patients 
                to access essential medicines either 100% free of charge or at up to 85% below commercial brand retail prices.
              </p>
            </div>

            {/* Core Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">100% Free for Patients in Need</h4>
                  <p className="text-xs text-stone-600 mt-1">Donated medicines are distributed at zero cost to verified patients and charitable clinics.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">20% MRP Donor Rewards</h4>
                  <p className="text-xs text-stone-600 mt-1">Donors earn credit vouchers redeemable at partnered community pharmacies.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Highlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>The MediCycle Standard</span>
                </div>
                <span className="text-xs text-stone-400 bg-stone-800 px-2.5 py-1 rounded-full">Bengaluru Chapter</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-stone-800/60 rounded-2xl">
                  <span className="text-stone-300 text-xs sm:text-sm">Partnered Pharmacies</span>
                  <span className="font-display font-extrabold text-emerald-400 text-lg">34+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-stone-800/60 rounded-2xl">
                  <span className="text-stone-300 text-xs sm:text-sm">Verified Doctors & NGOs</span>
                  <span className="font-display font-extrabold text-white text-lg">18</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-stone-800/60 rounded-2xl">
                  <span className="text-stone-300 text-xs sm:text-sm">Average Patient Savings</span>
                  <span className="font-display font-extrabold text-amber-400 text-lg">74%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-stone-800/60 rounded-2xl">
                  <span className="text-stone-300 text-xs sm:text-sm">Active Drop-off Hubs</span>
                  <span className="font-display font-extrabold text-white text-lg">6 Zones</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800">
                <p className="text-xs text-stone-400 leading-relaxed italic">
                  "Health equity shouldn't depend on wealth, and unused medicine shouldn't become environmental hazard."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-lg text-stone-900 mb-2">
              Rigorous Quality & Safety
            </h4>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Every donated batch is inspected by registered pharmacists. Only tamper-evident, sealed strips with valid batch labels and at least 60 days of shelf life are admitted.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-5">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-lg text-stone-900 mb-2">
              Prescription-Grounded Care
            </h4>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              We never bypass medical oversight. All medicine claims require a valid doctor's prescription, verified before pickup or delivery from certified centers.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-5">
              <Recycle className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-lg text-stone-900 mb-2">
              Zero-Landfill Commitment
            </h4>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Medicines past their prime are safely funneled into state-authorized biomedical incinerators, preventing dangerous active pharmaceutical ingredients from contaminating groundwater.
            </p>
          </div>
        </div>

        {/* Action Callouts */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('donor')}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-amber-950 bg-amber-200 hover:bg-amber-300/90 border border-amber-300 transition-all flex items-center gap-2 active:scale-95 shadow-xs"
          >
            <span>Join As a Medicine Donor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('patient')}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all flex items-center gap-2 active:scale-95 shadow-xs"
          >
            <span>Find Prescribed Medicines</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('pharmacy')}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 transition-all flex items-center gap-2 active:scale-95 shadow-xs"
          >
            <Building2 className="w-4 h-4 text-stone-600" />
            <span>Partner as a Pharmacy</span>
          </button>
        </div>
      </div>
    </section>
  );
};
