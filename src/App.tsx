import React, { useState, useEffect } from 'react';
import { PortalView, ImpactStats, UserAuthSession } from './types';
import { getStats, getRequests } from './services/api';
import { SafetyNoticeBanner } from './components/SafetyNoticeBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ImpactDashboard } from './components/home/ImpactDashboard';
import { ClosedLoopDiagram } from './components/home/ClosedLoopDiagram';
import { SafeDisposalGuide } from './components/home/SafeDisposalGuide';
import { AboutUsSection } from './components/home/AboutUsSection';
import { FaqSection } from './components/home/FaqSection';
import { PatientPortal } from './components/patient/PatientPortal';
import { DonorPortal } from './components/donor/DonorPortal';
import { PharmacyPortal } from './components/pharmacy/PharmacyPortal';
import { PortalAuthModal } from './components/auth/PortalAuthModal';
import { AssistanceChatbot } from './components/chat/AssistanceChatbot';

export default function App() {
  const [currentView, setCurrentView] = useState<PortalView>('home');
  const [stats, setStats] = useState<ImpactStats>(getStats());
  const [activeRequestsCount, setActiveRequestsCount] = useState<number>(0);
  const [searchQueryForPatient, setSearchQueryForPatient] = useState<string>('');
  const [selectedSampleRxId, setSelectedSampleRxId] = useState<string | undefined>(undefined);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Authentication State with local persistence
  const [authSession, setAuthSession] = useState<UserAuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('medicycle_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'patient' | 'pharmacy'>('patient');

  const refreshData = () => {
    setStats(getStats());
    const reqs = getRequests();
    const active = reqs.filter(r => r.status !== 'Collected' && r.status !== 'Cancelled').length;
    setActiveRequestsCount(active);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLoginSuccess = (session: UserAuthSession) => {
    setAuthSession(session);
    try {
      localStorage.setItem('medicycle_auth_session', JSON.stringify(session));
    } catch {
      // ignore
    }
    setAuthModalOpen(false);
    if (session.role === 'patient') {
      setCurrentView('patient');
    } else if (session.role === 'pharmacy') {
      setCurrentView('pharmacy');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setAuthSession(null);
    try {
      localStorage.removeItem('medicycle_auth_session');
    } catch {
      // ignore
    }
  };

  const handleOpenLogin = (role: 'patient' | 'pharmacy' = 'patient') => {
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQueryForPatient(query);
    setSelectedSampleRxId(undefined);
    setCurrentView('patient');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSampleRx = (sampleId: string) => {
    setSelectedSampleRxId(sampleId);
    setSearchQueryForPatient('');
    setCurrentView('patient');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: PortalView) => {
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
        activeRequestsCount={activeRequestsCount}
        authSession={authSession}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
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
            <AboutUsSection onNavigate={handleNavigate} />
            <SafeDisposalGuide />
            <FaqSection 
              onNavigate={handleNavigate} 
              onOpenAssistant={() => setIsChatbotOpen(true)} 
            />
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
            onDonationCreated={refreshData}
            onNavigateToDisposal={() => handleNavigate('impact')}
          />
        )}

        {currentView === 'pharmacy' && (
          <PharmacyPortal
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

      {/* 4. Portal Authentication Modal (Fake Password + Easy Verify Captcha) */}
      <PortalAuthModal
        isOpen={authModalOpen}
        initialRole={authModalRole}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* 5. Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 6. Assistance Chatbot Floating Widget (Homepage) */}
      {currentView === 'home' && (
        <AssistanceChatbot
          onNavigate={handleNavigate}
          isOpenExternal={isChatbotOpen}
          onToggleExternal={setIsChatbotOpen}
        />
      )}
    </div>
  );
}
