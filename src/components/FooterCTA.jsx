// src/components/FooterCTA.jsx
import { useState, useEffect } from 'react';
import { ArrowUpRight, Clock, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function FooterCTA() {
  const [swissTime, setSwissTime] = useState('');
  const [allocated, setAllocated] = useState(false);

  // Live Swiss Clock (Nyon / Geneva Time)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Europe/Zurich',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setSwissTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative bg-[#030303] text-white pt-28 pb-16 px-6 md:px-16 border-t border-neutral-900 overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Manufacture Status Pill */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-950 font-mono text-[10px] tracking-widest uppercase mb-8">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <MapPin className="w-3 h-3 text-red-500" />
            <span>MANUFACTURE NYON // SWITZERLAND</span>
          </div>
          <span className="text-neutral-700">|</span>
          <div className="flex items-center gap-1.5 text-white">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span>GENEVA: {swissTime || '16:45:00'} CEST</span>
          </div>
        </div>

        {/* Main Headline */}
        <span className="font-mono text-xs tracking-[0.4em] text-red-500 uppercase mb-4 block">
          Phase 06 // Horological Acquisition
        </span>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight max-w-4xl leading-none">
          Own The Machinery of Time
        </h2>
        
        <p className="font-mono text-xs md:text-sm text-neutral-400 mt-6 max-w-xl tracking-wider leading-relaxed">
          The Big Bang MECA-10 Black Magic is strictly allocated via authorized Hublot boutiques and certified horology partners.
        </p>

        {/* Private Allocation Action Console */}
        <div className="mt-12 w-full max-w-lg p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-md">
          {allocated ? (
            <div className="py-6 flex flex-col items-center gap-3 text-center animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                Private Allocation Request Logged
              </h4>
              <p className="font-mono text-xs text-neutral-400 max-w-xs">
                A Hublot concierge representative from the Geneva Salon will contact your registered terminal within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setAllocated(false)}
                className="mt-2 font-mono text-[10px] text-neutral-500 hover:text-white uppercase underline"
              >
                Reset Terminal
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 tracking-widest pb-3 border-b border-neutral-900">
                <span>ALLOCATION STATUS:</span>
                <span className="text-amber-500 flex items-center gap-1 font-bold">
                  <ShieldAlert className="w-3 h-3" /> RESTRICTED ALLOCATION
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setAllocated(true)}
                  className="flex-1 group inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors rounded"
                  data-cursor="REQUEST"
                >
                  <span>Request Private Viewing</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => alert('Downloading Calibre HUB1201 Complete Blueprint Dossier (PDF)...')}
                  className="inline-flex items-center justify-center px-6 py-4 border border-neutral-800 text-neutral-300 font-mono text-xs uppercase tracking-widest hover:border-neutral-600 hover:text-white transition-colors rounded bg-black/40"
                  data-cursor="PDF"
                >
                  Technical Sheet
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Agency Attribution & Horological Gutter */}
        <div className="w-full mt-28 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
          <div>
            © 2026 HUBLOT SA — ALL RIGHTS RESERVED
          </div>
          <div>
            DESIGNED & CRAFTED BY{' '}
            <span className="text-neutral-200 font-bold hover:text-red-500 transition-colors cursor-pointer">
              FLOWFORGE
            </span>
          </div>
          <div>
            REF. 414.CI.1123.RX // 223 PARTS
          </div>
        </div>

      </div>
    </footer>
  );
}