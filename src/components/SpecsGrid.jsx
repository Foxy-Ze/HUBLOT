// src/components/SpecsGrid.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gauge, Clock, Zap, Anchor, ShieldCheck, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// SVG CAD Wireframes for background blueprints
function CADVector({ type }) {
  if (type === 'escapement') {
    return (
      <svg className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none stroke-neutral-400 fill-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="25" strokeWidth="1" />
        <circle cx="50" cy="50" r="10" strokeWidth="1" />
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="10"
            x2="50"
            y2="18"
            strokeWidth="1.5"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
      </svg>
    );
  }
  if (type === 'barrel') {
    return (
      <svg className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none stroke-neutral-400 fill-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" strokeWidth="1" />
        <path d="M 50,50 m -30,0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0" strokeWidth="1" strokeDasharray="4 2" />
        <path d="M 50,50 m -15,0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 pointer-events-none stroke-neutral-400 fill-none" viewBox="0 0 100 100">
      <rect x="20" y="20" width="60" height="60" strokeWidth="1" strokeDasharray="4 4" />
      <polygon points="50,15 85,85 15,85" strokeWidth="1" />
      <circle cx="50" cy="50" r="30" strokeWidth="1" />
    </svg>
  );
}

const SPECS = [
  { label: 'POWER RESERVE', targetValue: 10, suffix: ' DAYS', detail: 'Twin series-coupled barrels', icon: Zap, cad: 'barrel' },
  { label: 'COMPONENTS', targetValue: 223, suffix: ' PARTS', detail: 'In-house skeleton manufacture', icon: Gauge, cad: 'escapement' },
  { label: 'FREQUENCY', targetValue: 21600, suffix: ' VPH', detail: '3 Hz Swiss escapement rate', icon: Clock, cad: 'escapement' },
  { label: 'WATER RESISTANCE', targetValue: 100, suffix: ' METERS', detail: '10 ATM / 330 feet tested', icon: Anchor, cad: 'other' },
  { label: 'JEWELS', targetValue: 24, suffix: ' JEWELS', detail: 'Friction-reducing synthetic rubies', icon: ShieldCheck, cad: 'barrel' },
  { label: 'CASE DIAMETER', targetValue: 45, suffix: ' MM', detail: 'Micro-blasted black ceramic', icon: Compass, cad: 'other' },
];

export default function SpecsGrid() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.spec-item', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 35,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });

      SPECS.forEach((spec, i) => {
        const counterEl = document.getElementById(`spec-val-${i}`);
        if (!counterEl) return;

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: spec.targetValue,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
          onUpdate: () => {
            const formatted = spec.targetValue > 1000 
              ? Math.floor(counterObj.val).toLocaleString() 
              : Math.floor(counterObj.val);
            counterEl.textContent = `${formatted}${spec.suffix}`;
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-black text-white py-32 px-6 md:px-16 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-xs tracking-[0.4em] text-neutral-500 uppercase block mb-3">
            Phase 04 // Precision Metrics
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            Technical Blueprint
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-4 tracking-wider">
            Engineered with micrometer tolerances. Every metric represents uncompromising horological execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-900 border border-neutral-900 rounded-lg overflow-hidden">
          {SPECS.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                className="spec-item relative overflow-hidden bg-[#080808] p-8 hover:bg-[#0c0c0c] transition-colors duration-300 flex flex-col justify-between"
              >
                {/* Embedded CAD Vector Schematics */}
                <CADVector type={spec.cad} />

                <div className="flex items-center justify-between mb-8 z-10">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
                    {spec.label}
                  </span>
                  <Icon className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="z-10">
                  <div id={`spec-val-${i}`} className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 font-mono">
                    0{spec.suffix}
                  </div>
                  <p className="font-mono text-xs text-neutral-400 leading-relaxed">
                    {spec.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-neutral-500 tracking-widest uppercase border-t border-neutral-900 pt-6">
          <span>TOLERANCE: ±0.002 MM</span>
          <span className="my-2 sm:my-0">TEST PRESSURE: 10 BAR HYDROSTATIC</span>
          <span>MANUFACTURE NYON // SWITZERLAND</span>
        </div>
      </div>
    </section>
  );
}