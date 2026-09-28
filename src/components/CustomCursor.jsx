// src/components/CustomCursor.jsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const labelRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only enable on non-touch pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    const moveCursor = (e) => {
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.28,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Interactive target detection
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setIsHovered(true);
        setCursorText(target.getAttribute('data-cursor') || '');
      } else if (e.target.closest('button, input, a, .macro-card')) {
        setIsHovered(true);
        setCursorText('');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Central Targeting Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-red-500 rounded-full pointer-events-none z-[100] transition-opacity duration-200"
      />

      {/* Reticle / Ring HUD */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 rounded-full pointer-events-none z-[99] flex items-center justify-center transition-all duration-300 ${
          isHovered
            ? 'w-16 h-16 -ml-8 -mt-8 border border-red-500/80 bg-red-950/20 backdrop-blur-[1px]'
            : 'w-10 h-10 border border-neutral-600/50'
        }`}
      >
        {cursorText && (
          <span
            ref={labelRef}
            className="font-mono text-[9px] tracking-widest uppercase text-white font-bold"
          >
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}