import React from 'react';
import { PortalView } from '../types';
import { ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';
import { HeartbeatRecycleLogo } from './brand/HeartbeatRecycleLogo';

interface FooterProps {
  onNavigate: (view: PortalView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <HeartbeatRecycleLogo size="md" variant="emerald" />
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                Medi<span className="text-emerald-400">Cycle</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Giving Medicines a Second Life. Connecting unused eligible medicines with verified healthcare needs while helping patients find prescribed medicines at accessible prices.
            </p>
            <div className="text-xs text-stone-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Registered Healthcare Redistribution Initiative</span>
            </div>
          </div>

          {/* Col 2: Portals */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Portals & Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('patient')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Patient Portal (Scan & Search)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('donor')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Donor Portal (Donate Unused Meds)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pharmacy')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Pharmacy Portal (Inventory & Orders)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('impact')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Impact Dashboard & Safe Disposal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Safe Disposal & Compliance */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Safety & Regulatory
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li>• Prescription verification required</li>
              <li>• Strict non-substitution guarantee</li>
              <li>• Licensed pharmacist inspection on drop</li>
              <li>• 100% Free redistribution of donated units</li>
              <li>• Certified biomedical incineration disposal</li>
            </ul>
          </div>

          {/* Col 4: Contact & Helpline */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Emergency & Support
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-stone-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Helpline: <strong>1800-MED-CYCLE</strong> (Toll-Free)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@medicycle.org</span>
              </div>
              <div className="flex items-start gap-2 text-stone-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Central Logistics Hub: 100 Feet Road, Indiranagar, Bengaluru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Safeguards Notice Box */}
        <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700/80 text-xs text-stone-400 space-y-1">
          <p className="font-semibold text-stone-300">
            Mandatory Medical Disclaimer:
          </p>
          <p>
            This tool reads your prescription and helps locate medicines. It does not prescribe, diagnose, or recommend medication. Always consult a licensed physician or pharmacist for medical advice.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div>
            © {new Date().getFullYear()} MediCycle Foundation. Dedicated to eliminating medicine poverty & waste.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Powered by Gemini AI Vision OCR</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Closed-Loop Healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
