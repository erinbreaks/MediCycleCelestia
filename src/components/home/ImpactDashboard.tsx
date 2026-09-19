import React from 'react';
import { ImpactStats } from '../../types';
import { 
  Package, 
  Users, 
  IndianRupee, 
  Heart, 
  Trash2, 
  TrendingUp, 
  Building2, 
  CheckCircle,
  Activity
} from 'lucide-react';

interface ImpactDashboardProps {
  stats: ImpactStats;
  onDonateClick: () => void;
  onFindClick: () => void;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  stats,
  onDonateClick,
  onFindClick
}) => {
  return (
    <section aria-label="Community impact metrics" className="py-14 sm:py-20 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-900/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-900/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5" /> Feature 7 • Impact Dashboard
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Measurable Outcomes & Community Savings
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-xl">
              Real-time transparent metrics on medicine redistribution, patient affordability, and environmental protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Network Metrics
            </span>
          </div>
        </div>

        {/* 4 Primary Impact Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1: Medicine Units Listed & Matched */}
          <div className="bg-stone-800/80 backdrop-blur-xs p-6 rounded-3xl border border-stone-700/80 shadow-inner">
            <div className="flex items-center justify-between text-emerald-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Medicine Units
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-900/60 flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-300" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              {stats.medicinesMatched.toLocaleString()}+
            </div>
            <p className="text-xs text-stone-400 mt-1.5">
              Units listed across verified donors & pharmacy reserves
            </p>
            <div className="mt-4 pt-3 border-t border-stone-700/60 flex items-center justify-between text-[11px] text-emerald-400">
              <span>Match Efficiency: 94.2%</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Stat 2: Patient Requests Matched */}
          <div className="bg-stone-800/80 backdrop-blur-xs p-6 rounded-3xl border border-stone-700/80 shadow-inner">
            <div className="flex items-center justify-between text-blue-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Patients Assisted
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-900/60 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-300" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              {stats.patientRequestsServed.toLocaleString()}
            </div>
            <p className="text-xs text-stone-400 mt-1.5">
              Prescription requests fulfilled with verified medicine
            </p>
            <div className="mt-4 pt-3 border-t border-stone-700/60 flex items-center justify-between text-[11px] text-blue-300">
              <span>Avg. Fulfillment: &lt; 4 Hours</span>
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Stat 3: Estimated Savings */}
          <div className="bg-stone-800/80 backdrop-blur-xs p-6 rounded-3xl border border-stone-700/80 shadow-inner">
            <div className="flex items-center justify-between text-amber-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Estimated Money Saved
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-900/60 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              ₹{stats.estimatedSavingsInr.toLocaleString()}
            </div>
            <p className="text-xs text-stone-400 mt-1.5">
              Direct patient out-of-pocket healthcare expenses saved
            </p>
            <div className="mt-4 pt-3 border-t border-stone-700/60 flex items-center justify-between text-[11px] text-amber-400">
              <span>Up to 75% savings vs MRP</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Stat 4: Environmental Waste Prevented */}
          <div className="bg-stone-800/80 backdrop-blur-xs p-6 rounded-3xl border border-stone-700/80 shadow-inner">
            <div className="flex items-center justify-between text-teal-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Waste Prevented
              </span>
              <div className="w-10 h-10 rounded-2xl bg-teal-900/60 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-teal-300" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              {stats.wastePreventedKg} kg
            </div>
            <p className="text-xs text-stone-400 mt-1.5">
              Medicines redirected from toxic groundwater / landfill dump
            </p>
            <div className="mt-4 pt-3 border-t border-stone-700/60 flex items-center justify-between text-[11px] text-teal-400">
              <span>Eco-Responsible Redirection</span>
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Secondary Network Row */}
        <div className="mt-8 bg-stone-800/50 p-6 rounded-3xl border border-stone-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-700 flex items-center justify-center text-amber-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {stats.verifiedDonorsCount} Verified Donors
                </div>
                <div className="text-xs text-stone-400">
                  Caregivers, patients & clinical volunteers
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-stone-700 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-700 flex items-center justify-center text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {stats.partnerPharmaciesCount} Partner Pharmacies
                </div>
                <div className="text-xs text-stone-400">
                  CarePlus, MedPlus, Jan Aushadhi & Community Stores
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              id="btn-impact-donate-cta"
              onClick={onDonateClick}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors text-center"
            >
              List an Unused Medicine
            </button>
            <button
              id="btn-impact-find-cta"
              onClick={onFindClick}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-semibold text-xs transition-colors text-center"
            >
              Upload Prescription
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
