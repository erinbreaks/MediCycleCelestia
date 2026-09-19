import React from 'react';
import { Recycle, HeartPulse, Activity } from 'lucide-react';

interface HeartbeatRecycleLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'emerald' | 'white' | 'dark' | 'glass';
  className?: string;
  showPulseDot?: boolean;
}

export const HeartbeatRecycleLogo: React.FC<HeartbeatRecycleLogoProps> = ({
  size = 'md',
  variant = 'emerald',
  className = '',
  showPulseDot = false
}) => {
  // Dimensions mapping
  const sizeMap = {
    sm: {
      container: 'w-8 h-8 rounded-xl',
      recycleIcon: 'w-5 h-5',
      heartIcon: 'w-3 h-3',
      dot: 'w-1.5 h-1.5',
    },
    md: {
      container: 'w-11 h-11 rounded-2xl',
      recycleIcon: 'w-7 h-7',
      heartIcon: 'w-4 h-4',
      dot: 'w-2 h-2',
    },
    lg: {
      container: 'w-14 h-14 rounded-2xl',
      recycleIcon: 'w-9 h-9',
      heartIcon: 'w-5 h-5',
      dot: 'w-2.5 h-2.5',
    },
    xl: {
      container: 'w-20 h-20 rounded-3xl',
      recycleIcon: 'w-13 h-13',
      heartIcon: 'w-7 h-7',
      dot: 'w-3 h-3',
    }
  };

  const currentSize = sizeMap[size];

  // Variant color schemes
  const variantStyles = {
    emerald: {
      container: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white shadow-md shadow-emerald-700/25 ring-1 ring-emerald-500/30',
      recycle: 'text-emerald-300/45',
      heart: 'text-white',
      dotBg: 'bg-emerald-300',
    },
    white: {
      container: 'bg-white text-emerald-800 shadow-sm border border-stone-200 ring-1 ring-stone-900/5',
      recycle: 'text-emerald-700/35',
      heart: 'text-emerald-700',
      dotBg: 'bg-emerald-500',
    },
    dark: {
      container: 'bg-stone-800 text-emerald-400 border border-stone-700 shadow-md',
      recycle: 'text-emerald-500/35',
      heart: 'text-emerald-400',
      dotBg: 'bg-emerald-400',
    },
    glass: {
      container: 'bg-emerald-950/40 backdrop-blur-md text-emerald-200 border border-emerald-500/30 shadow-inner',
      recycle: 'text-emerald-400/40',
      heart: 'text-emerald-200',
      dotBg: 'bg-emerald-400',
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <div
      aria-label="MediCycle Heartbeat and Recycle Symbol"
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden transition-all duration-200 ${currentSize.container} ${currentVariant.container} ${className}`}
    >
      {/* Background circular subtle glow */}
      <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none" />

      {/* Layer 1: Outer Recycle Möbius Loop (Representing Circular Medicine Recovery) */}
      <Recycle 
        className={`${currentSize.recycleIcon} ${currentVariant.recycle} transition-transform duration-500 hover:rotate-180`} 
        strokeWidth={2}
      />

      {/* Layer 2: Core Heartbeat (Heart + Pulse wave) centered right inside the recycling loop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <HeartPulse 
          className={`${currentSize.heartIcon} ${currentVariant.heart} drop-shadow-xs transition-transform duration-300 group-hover:scale-110`} 
          strokeWidth={2.6}
        />
      </div>

      {/* Optional Heartbeat Active Pulse Dot */}
      {showPulseDot && (
        <span className="absolute top-1 right-1 flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentVariant.dotBg}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${currentVariant.dotBg}`} />
        </span>
      )}
    </div>
  );
};
