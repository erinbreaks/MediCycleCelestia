import React, { useState } from 'react';
import { PortalView } from '../../types';
import { 
  Search, 
  UploadCloud, 
  HeartHandshake, 
  Store, 
  ShieldCheck, 
  Sparkles, 
  Mic, 
  ArrowRight, 
  CheckCircle2, 
  Pill,
  Clock,
  Coins
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (view: PortalView) => void;
  onQuickSearch: (query: string) => void;
  onSelectSampleRx: (sampleId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onQuickSearch,
  onSelectSampleRx
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please type your medicine name.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        onQuickSearch(transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onQuickSearch(searchQuery.trim());
    } else {
      onNavigate('patient');
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-stone-100/80 via-stone-50 to-white">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-emerald-100/40 via-amber-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Mission Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Empathetic Medicine Redistribution & Access
          </div>

          {/* Main Headline (Tab 1 instruction) */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
            Find the medicines you need.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800">
              Give unused medicines a second chance.
            </span>
          </h1>

          {/* Supporting Message (Tab 1 instruction) */}
          <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Upload a prescription, discover affordable sources, and connect with verified medicine providers.
          </p>

          {/* Search & Voice-First Input Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-lg shadow-stone-200/70 border border-stone-200 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-emerald-600/30 focus-within:border-emerald-600"
          >
            <div className="pl-3 text-stone-400">
              <Search className="w-5 h-5 text-emerald-600" />
            </div>
            <input
              id="hero-medicine-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine e.g. Metformin 500mg, Telmisartan 40mg..."
              className="w-full py-2.5 px-2 text-stone-900 text-sm focus:outline-none placeholder:text-stone-400 bg-transparent"
            />
            <button
              id="btn-hero-voice"
              type="button"
              onClick={handleVoiceInput}
              title="Voice-first search: speak medicine name"
              className={`p-2.5 rounded-xl transition-colors ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-stone-500 hover:text-emerald-700 hover:bg-stone-100'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              id="btn-hero-search-submit"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shrink-0 active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Main 3 Action Buttons (Tab 1 instruction) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="btn-hero-find-medicines"
              onClick={() => onNavigate('patient')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              Find Medicines
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-donate-medicines"
              onClick={() => onNavigate('donor')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm text-amber-900 bg-amber-100 hover:bg-amber-200/80 border border-amber-300 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-amber-700" />
              Donate Medicines
            </button>

            <button
              id="btn-hero-list-pharmacy"
              onClick={() => onNavigate('pharmacy')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Store className="w-4 h-4 text-stone-600" />
              List Pharmacy Stock
            </button>
          </div>

          {/* Quick Instant Test Prescriptions */}
          <div className="pt-2 text-xs text-stone-500 flex flex-wrap items-center justify-center gap-2">
            <span className="font-medium text-stone-600">Try Instant Sample Prescriptions:</span>
            <button
              id="btn-sample-rx-1"
              onClick={() => onSelectSampleRx('sample-rx-1')}
              className="px-2.5 py-1 rounded-lg bg-stone-200/70 hover:bg-stone-300/80 text-stone-800 font-semibold transition-colors flex items-center gap-1"
            >
              <Pill className="w-3 h-3 text-emerald-700" />
              Hypertension & Diabetes Combo Rx
            </button>
            <button
              id="btn-sample-rx-2"
              onClick={() => onSelectSampleRx('sample-rx-2')}
              className="px-2.5 py-1 rounded-lg bg-stone-200/70 hover:bg-stone-300/80 text-stone-800 font-semibold transition-colors flex items-center gap-1"
            >
              <Pill className="w-3 h-3 text-amber-700" />
              Respiratory Infection Rx (Flagged handwriting demo)
            </button>
          </div>
        </div>

        {/* 3 Value Proposition Highlight Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-lg text-stone-900 mb-1.5">
              AI Prescription Scanner
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Upload any photo or PDF prescription. AI extracts medicine names, dosages, and quantities with clear confidence verification and manual editing safeguards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-lg text-stone-900 mb-1.5">
              Smart Price & Savings Finder
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Simultaneously compares retail pharmacies, government Jan Aushadhi generic stores, and verified 100% free donated stock to highlight lowest estimated costs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:border-teal-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-lg text-stone-900 mb-1.5">
              Safety & Verification Protocol
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every donated medicine requires intact blister packaging and ≥90 days remaining expiry. Ineligible drugs are routed to responsible environmental disposal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
