import React from 'react';
import { PortalView, UserProfile } from '../types';
import { 
  HeartHandshake, 
  Search, 
  PlusCircle, 
  Store, 
  Sparkles, 
  PackageCheck,
  User,
  LogOut,
  ArrowLeftRight,
  ShieldCheck
} from 'lucide-react';
import { HeartbeatRecycleLogo } from './brand/HeartbeatRecycleLogo';

interface NavbarProps {
  currentView: PortalView;
  onNavigate: (view: PortalView) => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenLogin,
  onLogout
}) => {
  const role = currentUser?.role;

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand (AI Verified tag removed as requested) */}
          <div 
            id="brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <HeartbeatRecycleLogo 
              size="md" 
              variant="emerald" 
              showPulseDot={true}
              className="group-hover:scale-105 group-hover:shadow-emerald-700/30 transition-all duration-200" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl tracking-tight text-stone-900">
                  Medi<span className="text-emerald-700">Cycle</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Giving Medicines a Second Life
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs - Filtered by Logged-in Role */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200">
            {/* 1. Overview / Homepage - Visible to all */}
            <button
              id="nav-home"
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'home'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Overview
            </button>

            {/* 2. Patient Portal - Visible to Patient role or guest */}
            {(!role || role === 'patient') && (
              <button
                id="nav-patient"
                onClick={() => onNavigate('patient')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'patient'
                    ? 'bg-white text-emerald-800 shadow-xs border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                <Search className="w-4 h-4 text-emerald-600" />
                Patient Portal
              </button>
            )}

            {/* 3. Donor Portal - Visible to Donor role or guest */}
            {(!role || role === 'donor') && (
              <button
                id="nav-donor"
                onClick={() => onNavigate('donor')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'donor'
                    ? 'bg-white text-amber-900 shadow-xs border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                Donor Portal
              </button>
            )}

            {/* 4. Pharmacy Portal - Visible to Pharmacy role or guest */}
            {(!role || role === 'pharmacy') && (
              <button
                id="nav-pharmacy"
                onClick={() => onNavigate('pharmacy')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'pharmacy'
                    ? 'bg-white text-blue-900 shadow-xs border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                <Store className="w-4 h-4 text-blue-600" />
                Pharmacy Portal
              </button>
            )}

            {/* 5. Impact & Disposal - Visible to all */}
            <button
              id="nav-impact"
              onClick={() => onNavigate('impact')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'impact'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-teal-600" />
              Impact & Disposal
            </button>
          </nav>

          {/* Right Action CTAs & Role Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role / User Profile Switcher */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-stone-100/90 hover:bg-stone-200/80 p-1.5 pl-2.5 rounded-2xl border border-stone-300/80 transition-all text-xs">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 text-stone-800 font-semibold hover:text-emerald-800 transition-colors"
                  title="Switch Role or Account"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    currentUser.role === 'patient'
                      ? 'bg-emerald-500'
                      : currentUser.role === 'donor'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`} />
                  <span className="capitalize font-bold text-stone-900">{currentUser.role}:</span>
                  <span className="truncate max-w-[110px] hidden xl:inline">{currentUser.name}</span>
                  <ArrowLeftRight className="w-3 h-3 text-stone-500 ml-0.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

            {/* Required Action Buttons */}
            <button
              id="btn-quick-donate"
              onClick={() => onNavigate('donor')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
              Donate Medicines
            </button>

            <button
              id="btn-header-find-meds"
              onClick={() => onNavigate('patient')}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-800/20 hover:shadow-lg transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Find Medicines</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-stone-200 text-xs font-semibold text-stone-600 overflow-x-auto">
          <button
            onClick={() => onNavigate('home')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${
              currentView === 'home' ? 'text-emerald-800 bg-emerald-50' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Overview
          </button>

          {(!role || role === 'patient') && (
            <button
              onClick={() => onNavigate('patient')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${
                currentView === 'patient' ? 'text-emerald-800 bg-emerald-50' : ''
              }`}
            >
              <Search className="w-3.5 h-3.5" /> Patient
            </button>
          )}

          {(!role || role === 'donor') && (
            <button
              onClick={() => onNavigate('donor')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${
                currentView === 'donor' ? 'text-amber-800 bg-amber-50' : ''
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" /> Donor
            </button>
          )}

          {(!role || role === 'pharmacy') && (
            <button
              onClick={() => onNavigate('pharmacy')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${
                currentView === 'pharmacy' ? 'text-blue-800 bg-blue-50' : ''
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Pharmacy
            </button>
          )}

          <button
            onClick={() => onNavigate('impact')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${
              currentView === 'impact' ? 'text-teal-800 bg-teal-50' : ''
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" /> Impact
          </button>

          <button
            onClick={onOpenLogin}
            className="px-2 py-1 rounded-lg text-emerald-800 bg-emerald-50 flex items-center gap-1 shrink-0 font-bold"
          >
            <ArrowLeftRight className="w-3 h-3" /> Role
          </button>
        </div>
      </div>
    </header>
  );
};
