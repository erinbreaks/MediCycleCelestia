import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

export const SafetyNoticeBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 py-1.5 px-4 text-xs flex justify-between items-center text-amber-900">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Safety Safeguards Active — Medical Verification & Substitution Rules
        </span>
        <button
          id="btn-show-safety-notice"
          onClick={() => setIsOpen(true)}
          className="text-amber-800 hover:text-amber-950 font-semibold underline flex items-center gap-1 text-[11px]"
        >
          View Safeguards <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <section aria-label="Medical safety notice" className="bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 border-b border-amber-200/80 text-stone-800 py-3 px-4 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-stone-900 tracking-tight flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Prescription Verification Notice:
              </span>
              <span className="text-stone-700">
                “This tool reads your prescription and helps locate medicines. It does not prescribe, diagnose, or recommend medication.”
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-stone-600 text-xs">
              <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-sm">
                No Automatic Substitution:
              </span>
              <span>
                “Ask a licensed pharmacist or doctor whether an alternative is suitable.” All matched supplies undergo verification prior to handover.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            id="btn-hide-safety-notice"
            onClick={() => setIsOpen(false)}
            aria-label="Acknowledge and minimize safety notice"
            className="text-stone-500 hover:text-stone-800 p-1 rounded-md hover:bg-stone-200/50 transition-colors"
            title="Minimize notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
