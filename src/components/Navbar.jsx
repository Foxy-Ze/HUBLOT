// src/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function Navbar() {
  const [ambientAudio, setAmbientAudio] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (ambientAudio) {
      const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      let tickAlt = false;
      intervalRef.current = setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(tickAlt ? 3200 : 2800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.008);

          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.008);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.008);
          tickAlt = !tickAlt;
        } catch {}
      }, 166);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ambientAudio]);

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-6 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="font-black text-xl tracking-tighter text-white uppercase">
          HUBLOT
        </div>
        <div className="h-4 w-[1px] bg-neutral-800" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase hidden sm:inline">
          MECA-10 // BLACK MAGIC
        </span>
      </div>

      <div className="pointer-events-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => setAmbientAudio(!ambientAudio)}
          className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-neutral-400 hover:text-white uppercase border border-neutral-800 bg-black/60 backdrop-blur-md px-3 py-2 rounded transition-colors"
          data-cursor="SOUND"
        >
          {ambientAudio ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="text-white">3.0 HZ ESCAPEMENT</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              <span>SOUND OFF</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            document.getElementById('specifications')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="font-mono text-[10px] tracking-widest text-neutral-300 hover:text-white uppercase border border-neutral-800 bg-black/60 backdrop-blur-md px-4 py-2 rounded transition-colors"
        >
          Explore Specs
        </button>
      </div>
    </header>
  );
}