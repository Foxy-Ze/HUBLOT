// src/App.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useImagePreloader } from './hooks/useImagePreloader';
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

  // 1. Smooth Scroll (Lenis) + GSAP Ticker Sync
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

  // 2. Global Mechanical Scroll Choreography (activates after preloader finishes)
  useEffect(() => {
    if (!isLoaded) return;

    let ctx;
    // Wait 120ms so WatchCanvas finishes creating its scroll-pin spacer first
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const sections = gsap.utils.toArray('section:not(:first-of-type)');

        sections.forEach((section) => {
          // A. Mechanical Snap-Up on Section Titles (H2 / H3)
          const headings = section.querySelectorAll('h2, h3');
          if (headings.length > 0) {
            gsap.fromTo(
              headings,
              { y: 36, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
              {
                y: 0,
                opacity: 1,
                clipPath: 'inset(0 0 0% 0)',
                duration: 0.9,
                ease: 'expo.out',
                stagger: 0.08,
                scrollTrigger: {
                  trigger: section,
                  start: 'top 82%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }

          // B. Staggered Reveal for Bento Cards, Spec Cells & Stratum Rows
          const cards = section.querySelectorAll('.group');
          if (cards.length > 0) {
            gsap.fromTo(
              cards,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.75,
                ease: 'power3.out',
                stagger: 0.08,
                clearProps: 'transform',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 76%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }
        });

        ScrollTrigger.refresh();
      });
    }, 120);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [isLoaded]);

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-red-500 selection:text-white">
      <CustomCursor />

      {!isLoaded ? (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center px-6">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping mb-6" />
          <p className="font-mono text-[11px] tracking-[0.4em] text-neutral-300 uppercase mb-4">
            CALIBRE HUB1201 // INITIALIZING
          </p>
          <div className="w-56 h-[1px] bg-neutral-900 overflow-hidden relative">
            <div
              className="h-full bg-red-600 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-600 uppercase mt-3">
            {progress}% BUFFERED
          </span>
        </div>
      ) : (
        <>
          <Navbar />
          <main>
            <WatchCanvas images={images} />
            <MacroCards />
            <PowerReserve />
            <SpecsGrid />
            <LayerExplosion />
          </main>
          <FooterCTA />
        </>
      )}
    </div>
  );
}