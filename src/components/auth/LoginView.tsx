import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types';
import { 
  Search, 
  HeartHandshake, 
  Store, 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  Building2, 
  Heart,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (profile: UserProfile) => void;
  onCancel?: () => void;
  currentRole?: UserRole | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onCancel,
  currentRole
}) => {
  const [activeSection, setActiveSection] = useState<UserRole>(currentRole || 'patient');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customName, setCustomName] = useState('');

  const demoProfiles: Record<UserRole, UserProfile> = {
    patient: {
      role: 'patient',
      name: 'Ananya Sen',
      phone: '+91 98451 99221',
      email: 'ananya.sen@example.com',
      location: 'Indiranagar, Bengaluru'
    },
    donor: {
      role: 'donor',
      name: 'Dr. Anita Sharma',
      phone: '+91 98450 12345',
      email: 'anita.sharma@example.com',
      location: 'Defence Colony, Indiranagar',
      isTrustedDonor: true
    },
    pharmacy: {
      role: 'pharmacy',
      name: 'CarePlus Community Pharmacy & Dispensary',
      phone: '+91 80 2528 7766',
      email: 'contact@carepluspharma.in',
      location: '100 Feet Rd, Indiranagar',
      pharmacyName: 'CarePlus Community Pharmacy & Dispensary'
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    onLogin(demoProfiles[role]);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customName.trim() || demoProfiles[activeSection].name;
    const profile: UserProfile = {
      role: activeSection,
      name,
      email: customEmail.trim() || demoProfiles[activeSection].email,
      phone: demoProfiles[activeSection].phone,
      location: demoProfiles[activeSection].location,
      pharmacyName: activeSection === 'pharmacy' ? name : undefined,
      isTrustedDonor: activeSection === 'donor'
    };
    onLogin(profile);
  };

  return (
    <div className="py-10 sm:py-16 bg-gradient-to-b from-stone-100/90 via-stone-50 to-white min-h-[85vh] flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Select Your Access Role</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Welcome to Medi<span className="text-emerald-700">Cycle</span> Access Portal
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Select your account type below to access your tailored dashboard and tools.
          </p>
        </div>

        {/* 3 Main Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Section 1: Patient */}
          <div
            onClick={() => setActiveSection('patient')}
            className={`p-6 sm:p-7 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              activeSection === 'patient'
                ? 'bg-white border-emerald-600 ring-4 ring-emerald-600/15 shadow-xl scale-[1.02]'
                : 'bg-white/80 border-stone-200 hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display font-bold text-xl text-stone-900">
                  1. Patient Portal
                </h2>
                {activeSection === 'patient' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Scan prescriptions with AI OCR, discover nearby pharmacies, compare generic Jan Aushadhi prices, and reserve 100% free eligible donated medicines.
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-500">
                <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Prescription scan & price finder
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Free donated stock reservations
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickLogin('patient');
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  activeSection === 'patient'
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Demo Login as Patient
              </button>
            </div>
          </div>

          {/* Section 2: Donor */}
          <div
            onClick={() => setActiveSection('donor')}
            className={`p-6 sm:p-7 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              activeSection === 'donor'
                ? 'bg-white border-amber-600 ring-4 ring-amber-600/15 shadow-xl scale-[1.02]'
                : 'bg-white/80 border-stone-200 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display font-bold text-xl text-stone-900">
                  2. Donor Portal
                </h2>
                {activeSection === 'donor' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 ring-4 ring-amber-100" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                List unused sealed medicines, check safety criteria, track real-time verification status, and earn Trusted Donor recognition.
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-500">
                <div className="flex items-center gap-1.5 font-medium text-amber-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Manual & OCR medicine lookup
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  ⭐ Trusted Donor recognition
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickLogin('donor');
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  activeSection === 'donor'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20'
                    : 'bg-stone-100 hover:bg-amber-50 text-stone-800 hover:text-amber-900'
                }`}
              >
                <Heart className="w-4 h-4" />
                Demo Login as Donor
              </button>
            </div>
          </div>

          {/* Section 3: Pharmacy */}
          <div
            onClick={() => setActiveSection('pharmacy')}
            className={`p-6 sm:p-7 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              activeSection === 'pharmacy'
                ? 'bg-white border-blue-600 ring-4 ring-blue-600/15 shadow-xl scale-[1.02]'
                : 'bg-white/80 border-stone-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-blue-700" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display font-bold text-xl text-stone-900">
                  3. Pharmacy Portal
                </h2>
                {activeSection === 'pharmacy' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Manage CarePlus Community Pharmacy stock inventory, verify pending community donations, and fulfill patient prescription pickup orders.
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-500">
                <div className="flex items-center gap-1.5 font-medium text-blue-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Live inventory & discount adjustments
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Pharmacist donation verification
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickLogin('pharmacy');
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  activeSection === 'pharmacy'
                    ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20'
                    : 'bg-stone-100 hover:bg-blue-50 text-stone-800 hover:text-blue-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Demo Login as Pharmacy
              </button>
            </div>
          </div>
        </div>

        {/* Optional Custom Credentials / Detail Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs max-w-xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-600" />
              Sign In to {activeSection === 'patient' ? 'Patient' : activeSection === 'donor' ? 'Donor' : 'Pharmacy'} Account
            </h3>
            <span className="text-xs bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded-md capitalize">
              Role: {activeSection}
            </span>
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Full Name / Organization
              </label>
              <input
                type="text"
                placeholder={demoProfiles[activeSection].name}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder={demoProfiles[activeSection].email}
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  activeSection === 'patient'
                    ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                    : activeSection === 'donor'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-blue-700 hover:bg-blue-800 shadow-blue-700/20'
                }`}
              >
                <span>Continue to {activeSection === 'patient' ? 'Patient' : activeSection === 'donor' ? 'Donor' : 'Pharmacy'} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
