// src/App.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useImagePreloader } from './hooks/useImagePreLoader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import WatchCanvas from './components/WatchCanvas';
import MacroCards from './components/MacroCards';
import PowerReserve from './components/PowerReserve';
import SpecsGrid from './components/SpecsGrid';
import LayerExplosion from './components/LayerExplosion';
import FooterCTA from './components/FooterCTA';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { images, progress, isLoaded } = useImagePreloader();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-black text-white min-h-screen selection:bg-neutral-800">
      <CustomCursor />
      <Navbar />

      {/* Preloader Screen */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4">
            <span className="font-mono text-xs tracking-[0.4em] text-neutral-400 uppercase">
              Calibre HUB1201 // Initializing
            </span>
            <div className="w-56 h-[2px] bg-neutral-900 overflow-hidden relative border border-neutral-800">
              <div
                className="h-full bg-white transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-neutral-600">
              {progress}% BUFFERED
            </span>
          </div>
        </div>
      )}

      {/* SINGLE Hero Instance - Mounted only once images are ready */}
      {isLoaded && <WatchCanvas images={images} />}

      {/* Phase 02: Bento Macro Cards */}
      <div id="specifications">
        <MacroCards />
      </div>

      {/* Phase 03: Telemetry Power Reserve */}
      <PowerReserve />

      {/* Phase 04: Blueprint Specs */}
      <SpecsGrid />

      {/* Phase 05: 3D Layer Explosion */}
      <LayerExplosion />

      {/* Phase 06: VIP Acquisition Footer */}
      <FooterCTA />
    </main>
  );
}