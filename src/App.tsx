import React, { useState, useEffect } from 'react';
import { PortalView, ImpactStats, UserProfile } from './types';
import { getStats, getRequests } from './services/api';
import { SafetyNoticeBanner } from './components/SafetyNoticeBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ImpactDashboard } from './components/home/ImpactDashboard';
import { ClosedLoopDiagram } from './components/home/ClosedLoopDiagram';
import { SafeDisposalGuide } from './components/home/SafeDisposalGuide';
import { PatientPortal } from './components/patient/PatientPortal';
import { DonorPortal } from './components/donor/DonorPortal';
import { PharmacyPortal } from './components/pharmacy/PharmacyPortal';
import { LoginView } from './components/auth/LoginView';

export default function App() {
  const [currentView, setCurrentView] = useState<PortalView>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    role: 'patient',
    name: 'Ananya Sen',
    phone: '+91 98451 99221',
    email: 'ananya.sen@example.com',
    location: 'Indiranagar, Bengaluru'
  });
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [stats, setStats] = useState<ImpactStats>(getStats());
  const [searchQueryForPatient, setSearchQueryForPatient] = useState<string>('');
  const [selectedSampleRxId, setSelectedSampleRxId] = useState<string | undefined>(undefined);

  const refreshData = () => {
    setStats(getStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setCurrentUser(profile);
    setShowLoginModal(false);
    if (profile.role === 'patient') {
      setCurrentView('patient');
    } else if (profile.role === 'donor') {
      setCurrentView('donor');
    } else if (profile.role === 'pharmacy') {
      setCurrentView('pharmacy');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSearch = (query: string) => {
    setSearchQueryForPatient(query);
    setSelectedSampleRxId(undefined);
    if (currentUser?.role !== 'patient') {
      setCurrentUser({
        role: 'patient',
        name: 'Ananya Sen',
        phone: '+91 98451 99221',
        email: 'ananya.sen@example.com',
        location: 'Indiranagar, Bengaluru'
      });
    }
    setCurrentView('patient');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSampleRx = (sampleId: string) => {
    setSelectedSampleRxId(sampleId);
    setSearchQueryForPatient('');
    if (currentUser?.role !== 'patient') {
      setCurrentUser({
        role: 'patient',
        name: 'Ananya Sen',
        phone: '+91 98451 99221',
        email: 'ananya.sen@example.com',
        location: 'Indiranagar, Bengaluru'
      });
    }
    setCurrentView('patient');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: PortalView) => {
    if (view === 'login') {
      setShowLoginModal(true);
      return;
    }

    // If navigating to a portal and role doesn't match, adapt role for seamless demo experience
    if (view === 'donor' && currentUser?.role !== 'donor') {
      setCurrentUser({
        role: 'donor',
        name: 'Dr. Anita Sharma',
        phone: '+91 98450 12345',
        email: 'anita.sharma@example.com',
        location: 'Defence Colony, Indiranagar',
        isTrustedDonor: true
      });
    } else if (view === 'patient' && currentUser?.role !== 'patient') {
      setCurrentUser({
        role: 'patient',
        name: 'Ananya Sen',
        phone: '+91 98451 99221',
        email: 'ananya.sen@example.com',
        location: 'Indiranagar, Bengaluru'
      });
    } else if (view === 'pharmacy' && currentUser?.role !== 'pharmacy') {
      setCurrentUser({
        role: 'pharmacy',
        name: 'CarePlus Community Pharmacy & Dispensary',
        phone: '+91 80 2528 7766',
        email: 'contact@carepluspharma.in',
        location: '100 Feet Rd, Indiranagar',
        pharmacyName: 'CarePlus Community Pharmacy & Dispensary'
      });
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      {/* 1. Mandatory Medical Safety Notice Banner */}
      <SafetyNoticeBanner />

      {/* 2. Main Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* 3. Main Dynamic Content Views */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              onNavigate={handleNavigate}
              onQuickSearch={handleQuickSearch}
              onSelectSampleRx={handleSelectSampleRx}
            />
            <ImpactDashboard
              stats={stats}
              onDonateClick={() => handleNavigate('donor')}
              onFindClick={() => handleNavigate('patient')}
            />
            <ClosedLoopDiagram />
            <SafeDisposalGuide />
          </>
        )}

        {currentView === 'patient' && (
          <PatientPortal
            initialSearchQuery={searchQueryForPatient}
            selectedSampleRxId={selectedSampleRxId}
            onRequestCreated={refreshData}
          />
        )}

        {currentView === 'donor' && (
          <DonorPortal
            currentUser={currentUser}
            onDonationCreated={refreshData}
            onNavigateToDisposal={() => handleNavigate('impact')}
          />
        )}

        {currentView === 'pharmacy' && (
          <PharmacyPortal
            currentUser={currentUser}
            onInventoryUpdated={refreshData}
          />
        )}

        {currentView === 'impact' && (
          <div className="space-y-0">
            <div className="bg-stone-900 text-white py-12 text-center border-b border-stone-800">
              <div className="max-w-4xl mx-auto px-4">
                <span className="inline-block bg-emerald-900/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  Transparency & Sustainability
                </span>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
                  MediCycle Impact Dashboard & Safe Disposal
                </h1>
                <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
                  Monitoring every redistributed unit, patient cost savings, and environmental diversion from landfills.
                </p>
              </div>
            </div>
            <ImpactDashboard
              stats={stats}
              onDonateClick={() => handleNavigate('donor')}
              onFindClick={() => handleNavigate('patient')}
            />
            <ClosedLoopDiagram />
            <SafeDisposalGuide />
          </div>
        )}
      </main>

      {/* 4. Login Modal / Section */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl my-8">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-stone-700 hover:bg-white hover:text-stone-950 font-bold text-lg flex items-center justify-center shadow-md transition-colors"
            >
              ✕
            </button>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
              <LoginView
                currentRole={currentUser?.role}
                onLogin={handleLogin}
                onCancel={() => setShowLoginModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
