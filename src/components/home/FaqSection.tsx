import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  CheckCircle2, 
  Sparkles,
  MessageCircleQuestion,
  ShieldAlert
} from 'lucide-react';
import { PortalView } from '../../types';

interface FaqItem {
  id: string;
  category: 'donating' | 'patients' | 'safety' | 'rewards';
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'donating',
    question: 'What kinds of medicines can I donate to MediCycle?',
    answer: 'We accept sealed, unopened blister packs, foil strips, and factory-sealed bottles of solid dosage forms (tablets and capsules) with at least 60 days remaining before the printed expiration date. The manufacturer batch number and expiry date must be clearly legible. We strictly do NOT accept opened liquid syrups, half-used ointment tubes, broken packaging, loose tablets, or Schedule X narcotics.',
    highlight: 'Minimum 60 days of shelf life and intact blister foil required.'
  },
  {
    id: 'faq-2',
    category: 'safety',
    question: 'How does MediCycle ensure donated medicines are safe for consumption?',
    answer: 'Every submitted donation undergoes a rigorous three-step verification process. First, our automated intake checks the batch and expiry date. Second, a licensed pharmacist conducts a physical inspection for packaging integrity, seal tampering, and dry storage compliance. Once approved, the medicine is logged into our automated expiry state machine and locked out immediately upon reaching expiry.',
    highlight: 'Physical verification by licensed pharmacists before entering inventory.'
  },
  {
    id: 'faq-3',
    category: 'patients',
    question: 'Are donated medicines really free for patients?',
    answer: 'Yes! All medicines donated by community members and organizations are provided 100% free of charge to patients with valid doctor prescriptions. If a requested drug is not available as a donation, our platform matches the prescription with Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) verified generic alternatives that cost 50% to 85% less than commercial brands.',
    highlight: 'Zero cost for community donations; 50-85% savings on Jan Aushadhi generics.'
  },
  {
    id: 'faq-4',
    category: 'rewards',
    question: 'How do the 20% MRP Donor Reward Points work?',
    answer: 'When you submit eligible unexpired medicines and they are physically verified at our drop-off centers or partnered pharmacies, you receive MediCycle Reward Points equal to 20% of the Maximum Retail Price (MRP). You can redeem these points for instant discount coupons on your next pharmaceutical purchase at any partnered pharmacy across Bengaluru.',
    highlight: 'Earn 20% MRP value back as store discounts on verified donations.'
  },
  {
    id: 'faq-5',
    category: 'safety',
    question: 'What happens to medicines that are expired or rejected?',
    answer: 'Medicines that do not pass physical inspection or have expired are segregated into our Safe Disposal Stream. We partner with state-authorized Central Pollution Control Board (CPCB) biomedical waste management operators. They undergo high-temperature industrial incineration, preventing dangerous active pharmaceutical ingredients from leaking into Bengaluru groundwater and lakes.',
    highlight: 'Certified zero-landfill biomedical incineration prevents toxic water contamination.'
  },
  {
    id: 'faq-6',
    category: 'patients',
    question: 'How does the prescription scanner work and is my health data secure?',
    answer: 'Our prescription scanner reads uploaded prescription photos or PDFs using optical character recognition to extract salt names, strengths (e.g., 500mg, 40mg), and dosage intervals. It automatically compares these with available local stock and generic substitutes. Prescriptions are processed in memory and never sold or shared with commercial advertisers.',
    highlight: 'Fast OCR salt extraction paired with strict patient privacy.'
  },
  {
    id: 'faq-7',
    category: 'donating',
    question: 'Where can I drop off medicines in Bengaluru?',
    answer: 'MediCycle has partnered drop-off kiosks and certified community pharmacies across key Bengaluru neighborhoods including Indiranagar, Koramangala, Jayanagar, Malleshwaram, Whitefield, and HSR Layout. You can view addresses, opening hours, and real-time pharmacy inventories on our interactive Bangalore Medicine Map.',
    highlight: 'Convenient drop kiosks across 6 major Bengaluru zones.'
  },
  {
    id: 'faq-8',
    category: 'patients',
    question: 'Do I need a doctor’s prescription to receive medicines?',
    answer: 'Yes, absolutely. To uphold clinical safety and comply with the Drugs and Cosmetics Act, prescription-grade (Schedule H and H1) medications can only be reserved and dispensed against a valid prescription from a registered medical practitioner.',
    highlight: 'Prescription mandatory for Schedule H & H1 drugs.'
  }
];

interface FaqSectionProps {
  onNavigate?: (view: PortalView) => void;
  onOpenAssistant?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onNavigate, onOpenAssistant }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'donating' | 'patients' | 'safety' | 'rewards'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesQuery = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq-section" aria-label="Frequently Asked Questions" className="py-20 bg-white border-t border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-3 border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
            Clear Answers
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Everything you need to know about medicine donation rules, generic savings, clinical safety, and pickup centers.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., expiry, rewards, Jan Aushadhi, Bangalore)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all shadow-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-center pt-1">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'donating', label: 'Donating Medicines' },
              { id: 'patients', label: 'Patient Access & Generics' },
              { id: 'safety', label: 'Safety & Disposal' },
              { id: 'rewards', label: 'Donor Rewards' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-3xl border border-stone-200 p-8">
              <MessageCircleQuestion className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <p className="font-bold text-stone-800 text-base">No matching questions found</p>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
                Try a different search keyword, or open our MediCycle Assistant in the bottom right to ask any question directly!
              </p>
              {onOpenAssistant && (
                <button
                  onClick={onOpenAssistant}
                  className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask MediCycle Assistant
                </button>
              )}
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded 
                      ? 'bg-stone-50/90 border-emerald-300 shadow-xs' 
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 focus:outline-hidden"
                  >
                    <span className="font-display font-bold text-stone-900 text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-stone-200/70 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3">
                      <p>{faq.answer}</p>
                      {faq.highlight && (
                        <div className="p-3 bg-white rounded-xl border border-emerald-200/80 flex items-center gap-2 text-emerald-900 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Help Footer Card */}
        <div className="mt-12 p-6 sm:p-8 bg-stone-900 text-white rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-display font-bold text-lg text-white">Have a question not listed here?</h4>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Our interactive MediCycle Assistant in the bottom right is ready to help 24/7 with medicine guidelines and search tips.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {onOpenAssistant && (
              <button
                onClick={onOpenAssistant}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Chat with Assistant</span>
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => onNavigate('donor')}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm border border-stone-700 transition-all"
              >
                <span>Donate Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
