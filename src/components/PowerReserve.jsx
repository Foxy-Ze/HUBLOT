// src/components/PowerReserve.jsx
import { useState, useRef } from 'react';
import { RotateCw, AlertTriangle, CheckCircle2, Volume2, VolumeX } from 'lucide-react';

// Web Audio API Micro-Click Synthesizer
function playMechanicalClick(audioCtxRef, soundEnabled) {
  if (!soundEnabled) return;
  try {
    const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // High mechanical transient click (1800Hz quick snap)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch {
    // Graceful fallback if browser restricts audio
  }
}

export default function PowerReserve() {
  const [days, setDays] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);
  const lastClickVal = useRef(10);

  const percentage = (days / 10) * 100;
  const isCritical = days <= 2;

  const handleSliderChange = (e) => {
    const newVal = parseFloat(e.target.value);
    // Trigger a click every 0.3 days of movement
    if (Math.abs(newVal - lastClickVal.current) >= 0.3) {
      playMechanicalClick(audioCtxRef, soundEnabled);
      lastClickVal.current = newVal;
    }
    setDays(newVal);
  };

  return (
    <section className="relative bg-black text-white py-28 px-6 md:px-16 border-t border-neutral-900 overflow-hidden">
      {/* Dynamic Ambient Glow */}
      <div 
        className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700 ${
          isCritical ? 'bg-red-950/25' : 'bg-neutral-800/15'
        }`} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 pb-6 border-b border-neutral-800">
          <div>
            <span className="font-mono text-xs tracking-[0.35em] text-red-500 uppercase block mb-2">
              Phase 03 // Autonomous Telemetry
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Rack & Pinion Reserve
            </h2>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Acoustic Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-400 hover:text-white uppercase border border-neutral-800 px-3 py-1.5 rounded bg-neutral-950 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-red-500" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-600" />}
              <span>{soundEnabled ? 'Acoustics ON' : 'Muted'}</span>
            </button>
            <p className="font-mono text-xs text-neutral-400 max-w-xs tracking-wider hidden sm:block">
              Simulate winding the twin series-coupled barrels of the Calibre HUB1201.
            </p>
          </div>
        </div>

        {/* Telemetry Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#070707] border border-neutral-800/80 rounded-2xl p-8 md:p-12 shadow-2xl">
          
          {/* Left: Dynamic Readout */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase block mb-4">
                Telemetry Module // 10-Day Reserve
              </span>
              
              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-black text-6xl md:text-8xl tracking-tight text-white font-mono">
                  {days.toFixed(1)}
                </span>
                <span className="font-mono text-sm tracking-widest text-neutral-400 uppercase">
                  DAYS REMAINING
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950 text-[11px] font-mono tracking-widest uppercase transition-all duration-300">
                {isCritical ? (
                  <span className="text-red-400 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" /> Barrels Depleted // Rewind Required
                  </span>
                ) : (
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Optimal Autonomy Synchronized
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-900">
              <span className="font-mono text-[10px] text-neutral-500 tracking-wider uppercase block mb-1">
                Mechanical Transmission
              </span>
              <p className="font-mono text-xs text-neutral-400 leading-relaxed">
                Twin barrels store 240 hours of continuous mainspring torque. The cogwheel rack shifts across a straight track to mechanically indicate depletion.
              </p>
            </div>
          </div>

          {/* Right: Interactive Winding Slider & Gauge */}
          <div className="lg:col-span-7 flex flex-col gap-8 bg-neutral-950 p-6 md:p-8 rounded-xl border border-neutral-900">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
              <span className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
                Crown Winding Simulator
              </span>
              <div className="flex items-center gap-2">
                <RotateCw 
                  className="w-4 h-4 text-neutral-400 transition-transform duration-100 ease-out" 
                  style={{ transform: `rotate(${days * 36}deg)` }}
                />
                <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                  RACK COG: {(days * 36).toFixed(0)}°
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between font-mono text-[10px] text-neutral-500 tracking-widest">
                <span>0 DAYS (EXHAUSTED)</span>
                <span>5 DAYS (NOMINAL)</span>
                <span>10 DAYS (MAXIMUM)</span>
              </div>

              <div className="relative h-4 w-full bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800">
                <div
                  className={`h-full transition-all duration-100 ease-out ${
                    isCritical ? 'bg-red-600' : 'bg-gradient-to-r from-neutral-300 to-white'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Interactive Range Input Slider */}
<div className="space-y-2">
  <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    value={days}
    onChange={handleSliderChange}
    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-red-500 transition-colors touch-none"
/>
  <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-neutral-600 tracking-widest">
    <span>DRAG TO DEPLETE / REWIND</span>
    <button
      type="button"
      onClick={() => {
        setDays(10);
        playMechanicalClick(audioCtxRef, soundEnabled);
      }}
      className="text-neutral-400 hover:text-white uppercase transition-colors underline"
    >
      Reset 10D
    </button>
  </div>
</div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-900 font-mono text-center">
              <div className="p-3 bg-neutral-900/50 rounded border border-neutral-900">
                <div className="text-[10px] text-neutral-500">TOTAL HOURS</div>
                <div className="text-sm font-bold text-white mt-0.5">{(days * 24).toFixed(0)} H</div>
              </div>
              <div className="p-3 bg-neutral-900/50 rounded border border-neutral-900">
                <div className="text-[10px] text-neutral-500">TORQUE OUTPUT</div>
                <div className="text-sm font-bold text-white mt-0.5">{((days / 10) * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3 bg-neutral-900/50 rounded border border-neutral-900">
                <div className="text-[10px] text-neutral-500">ESCAPEMENT</div>
                <div className="text-sm font-bold text-white mt-0.5">3.0 HZ</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}