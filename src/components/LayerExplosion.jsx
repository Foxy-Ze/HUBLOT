// src/components/LayerExplosion.jsx
import { useState, useEffect, useRef } from 'react';
import { Layers, MoveVertical, Shield, Cpu, Eye, Sparkles } from 'lucide-react';

const LAYERS = [
  {
    id: 'L1',
    name: 'CERAMIC BEZEL & TITANIUM H-SCREWS',
    thickness: '2.80 MM',
    material: 'Micro-blasted Black Ceramic / Grade 5 Titanium',
    desc: 'Outer shield engineered to withstand extreme torsional stress and high-velocity abrasions.',
    icon: Shield,
    color: 'text-neutral-300',
    accent: 'border-neutral-700',
  },
  {
    id: 'L2',
    name: 'SAPPHIRE CRYSTAL WITH DUAL AR COATING',
    thickness: '1.40 MM',
    material: 'Synthetic Corundum (9 Mohs Hardness)',
    desc: 'Chemically treated inner and outer anti-reflective layer ensuring absolute skeleton clarity.',
    icon: Eye,
    color: 'text-cyan-400',
    accent: 'border-cyan-800/60',
  },
  {
    id: 'L3',
    name: 'SKELETON DIAL & RACK TRANSMISSION',
    thickness: '3.10 MM',
    material: 'Matte Black PVD Brass & Polished Steel Pinions',
    desc: 'Exposes the mechanical link between the twin barrels and the 10-day power reserve gauge.',
    icon: Sparkles,
    color: 'text-red-500',
    accent: 'border-red-800/60',
  },
  {
    id: 'L4',
    name: 'MANUFACTURE CALIBRE HUB1201',
    thickness: '6.80 MM',
    material: '223 Hand-Finished Components / 24 Synthetic Rubies',
    desc: 'Twin series-coupled mainspring barrels running at 3.0 Hz (21,600 VPH) Swiss escapement.',
    icon: Cpu,
    color: 'text-white',
    accent: 'border-neutral-600',
  },
  {
    id: 'L5',
    name: 'CERAMIC CASEBACK & SAPPHIRE APERTURE',
    thickness: '1.85 MM',
    material: 'Micro-blasted Black Ceramic',
    desc: 'Exhibition window secured with 6 titanium H-screws. Hydrostatically tested to 10 ATM.',
    icon: Layers,
    color: 'text-neutral-400',
    accent: 'border-neutral-800',
  },
];

export default function LayerExplosion() {
  const [separation, setSeparation] = useState(60);

  const redSlotRef = useRef(null);
  const greenSlotRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    let animId = null;
    let currentP = 0;

    const updateBadgePosition = () => {
      const redSlot = redSlotRef.current;
      const greenSlot = greenSlotRef.current;
      const badge = badgeRef.current;

      if (redSlot && greenSlot && badge) {
        const redRect = redSlot.getBoundingClientRect();
        const greenRect = greenSlot.getBoundingClientRect();
        const vh = window.innerHeight;

        // Start shifting when header reaches 32% from top of screen
        // Finish docking into Green Box when header reaches 10% from top
        const startTrigger = vh * 0.32;
        const endTrigger = vh * 0.10;

        let targetP = (startTrigger - redRect.top) / (startTrigger - endTrigger);
        targetP = Math.max(0, Math.min(1, targetP));

        // Smooth interpolation (lerp) so it glides between Red and Green boxes
        currentP += (targetP - currentP) * 0.16;
        if (Math.abs(targetP - currentP) < 0.001) {
          currentP = targetP;
        }

        // Smoothstep easing curve
        const easedP = currentP * currentP * (3 - 2 * currentP);

        // Exact pixel distance from Red Box to Green Box
        const deltaX = greenRect.left - redRect.left;
        const deltaY = greenRect.top - redRect.top;

        const x = deltaX * easedP;
        const y = deltaY * easedP;

        badge.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        badge.style.borderColor =
          easedP > 0.5 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(38, 38, 38, 1)';
      }

      animId = requestAnimationFrame(updateBadgePosition);
    };

    animId = requestAnimationFrame(updateBadgePosition);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="relative bg-[#060606] text-white py-32 px-6 md:px-16 border-t border-neutral-900 overflow-hidden">
      {/* Blueprint Grid Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #444 1px, transparent 1px),
            linear-gradient(to bottom, #444 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-neutral-800 relative z-30">
          <div>
            <span className="font-mono text-xs tracking-[0.35em] text-red-500 uppercase block mb-2">
              Phase 05 // Mechanical Strata
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Deconstructed Architecture
            </h2>
          </div>

          {/* RED BOX ORIGIN: Starts here when section is viewed */}
          <div
            ref={redSlotRef}
            className="mt-6 md:mt-0 relative w-[210px] h-[42px]"
          >
            {/* Subtle dock outline left behind in header when badge flies down */}
            <div className="w-full h-full rounded-lg border border-dashed border-neutral-800/60 flex items-center justify-center">
              <span className="font-mono text-[9px] tracking-widest text-neutral-700 uppercase">
                TELEMETRY ACTIVE
              </span>
            </div>

            {/* THE MOVING PERCENTAGE METER */}
            <div
              ref={badgeRef}
              className="absolute inset-0 z-50 flex items-center justify-center gap-3 bg-neutral-950/95 backdrop-blur-md border border-neutral-800 px-4 py-2.5 rounded-lg shadow-2xl will-change-transform pointer-events-none"
            >
              <MoveVertical className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
              <span className="font-mono text-xs tracking-wider text-neutral-400 whitespace-nowrap">
                SEPARATION GAP: <strong className="text-white font-mono">{separation}%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Separation Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: HUD Bar (Green Box) + 3D Exploded Visualizer */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {/* Top HUD Bar above explosion window */}
            <div className="w-full flex items-center justify-between bg-black/60 border border-neutral-900 rounded-xl px-4 py-2 min-h-[54px]">
              <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase">
                CALIBRE HUB1201 // STRATA
              </span>

              {/* GREEN BOX TARGET: Badge lands right here when scrolling to slider */}
              <div
                ref={greenSlotRef}
                className="w-[210px] h-[42px] rounded-lg border border-dashed border-neutral-900/50"
              />
            </div>

            {/* 3D Exploded Visualizer Window */}
            <div className="flex flex-col items-center justify-between min-h-[460px] bg-black/60 border border-neutral-900 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute w-72 h-72 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

              {/* Exploded 3D Layer Stack */}
              <div
                className="relative w-64 sm:w-80 h-72 sm:h-80 my-auto flex flex-col items-center justify-center transition-all duration-300 scale-[0.75] sm:scale-95"
                style={{
                  perspective: '1200px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {LAYERS.map((layer, index) => {
                  const centerIndex = 2;
                  const offsetFactor = index - centerIndex;
                  const translateY = offsetFactor * (separation * 0.8);
                  const translateZ = -offsetFactor * (separation * 0.6);

                  return (
                    <div
                      key={layer.id}
                      className={`absolute w-60 sm:w-72 h-16 sm:h-20 rounded-xl border ${layer.accent} bg-neutral-950/90 backdrop-blur-md shadow-2xl p-3 sm:p-4 flex items-center justify-between transition-all duration-300 ease-out`}
                      style={{
                        transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(45deg) rotateZ(-16deg)`,
                        boxShadow:
                          '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                      }}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="font-mono text-[11px] sm:text-xs font-bold text-red-500">
                          {layer.id}
                        </span>
                        <div className="text-left">
                          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-white block uppercase font-semibold truncate max-w-[130px] sm:max-w-[150px]">
                            {layer.name.split(' ')[0]} {layer.name.split(' ')[1]}
                          </span>
                          <span className="font-mono text-[8px] sm:text-[9px] text-neutral-500 tracking-widest block">
                            THICKNESS: {layer.thickness}
                          </span>
                        </div>
                      </div>

                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500/80 animate-ping" />
                    </div>
                  );
                })}
              </div>

              {/* Interactive Separation Slider */}
              <div className="w-full max-w-sm mt-4 space-y-2 z-20">
                <div className="flex justify-between font-mono text-[9px] sm:text-[10px] text-neutral-500 tracking-widest">
                  <span>COMPACT (0%)</span>
                  <span>EXPLODED (100%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={separation}
                  onChange={(e) => setSeparation(parseInt(e.target.value, 10))}
                  className="w-full h-3 sm:h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 transition-all touch-none"
                  data-cursor="DRAG"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Layer Spec Details Matrix */}
          <div className="lg:col-span-6 space-y-3">
            {LAYERS.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.id}
                  className="group bg-[#090909] border border-neutral-900 hover:border-neutral-700 p-5 rounded-xl transition-all duration-300 flex items-start justify-between gap-4"
                  data-cursor="INSPECT"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 group-hover:text-red-500 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-red-500 tracking-widest font-bold">
                          {layer.id} // STRATUM
                        </span>
                        <span className="font-mono text-[10px] text-neutral-500">
                          {layer.thickness}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mt-0.5">
                        {layer.name}
                      </h4>
                      <p className="font-mono text-xs text-neutral-400 mt-1 leading-relaxed">
                        {layer.desc}
                      </p>
                      <span className="inline-block mt-2 font-mono text-[9px] text-neutral-500 tracking-wider uppercase bg-black/60 px-2 py-0.5 rounded border border-neutral-900">
                        MAT: {layer.material}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}