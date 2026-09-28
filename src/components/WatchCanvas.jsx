// src/components/WatchCanvas.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WatchCanvas({ images }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const phaseBadgeRef = useRef(null);
  const scrubValRef = useRef(null);
  const frameValRef = useRef(null);
  const rotValRef = useRef(null);
  const reticleSvgRef = useRef(null);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalFrames = images.length;
    const frameObj = { frame: 0 };

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const updateDimensions = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    const renderFrame = (floatIndex) => {
      const clamped = Math.max(0, Math.min(floatIndex, totalFrames - 1));
      const floorIdx = Math.floor(clamped);
      const ceilIdx = Math.min(floorIdx + 1, totalFrames - 1);
      const alpha = clamped - floorIdx;

      const imgA = images[floorIdx];
      const imgB = images[ceilIdx];

      // If base frame is missing, do not clear canvas to black
      if (!imgA || !imgA.complete || imgA.naturalWidth === 0) return;

      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear Canvas to pure black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const isMobile = width < 1024;
      const naturalW = imgA.naturalWidth;
      const naturalH = imgA.naturalHeight;
      const imgAspect = naturalW / naturalH;
      const canvasAspect = width / height;

      let drawW, drawH, drawX, drawY;

      if (isMobile) {
        drawW = width * 1.05;
        drawH = drawW / imgAspect;
        drawX = (width - drawW) / 2;
        drawY = (height - drawH) / 2 + 40;
      } else {
        if (canvasAspect > imgAspect) {
          drawH = height * 0.92;
          drawW = drawH * imgAspect;
          drawX = (width - drawW) / 2;
          drawY = (height - drawH) / 2;
        } else {
          drawW = width * 0.92;
          drawH = drawW / imgAspect;
          drawX = (width - drawW) / 2;
          drawY = (height - drawH) / 2;
        }
      }

      // Draw Base Frame
      ctx.globalAlpha = 1;
      ctx.drawImage(imgA, drawX, drawY, drawW, drawH);

      // Sub-frame crossfade
      if (alpha > 0.02 && imgB && imgB.complete && imgB.naturalWidth > 0 && floorIdx !== ceilIdx) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(imgB, drawX, drawY, drawW, drawH);
      }

      ctx.restore();
    };

    updateDimensions();
    renderFrame(0);

    const ctxTimeline = gsap.context(() => {
      gsap.to(frameObj, {
        frame: totalFrames - 1,
        ease: 'none',
        scrollTrigger: {
          id: 'hero-pin',
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            renderFrame(frameObj.frame);

            const p = self.progress;
            const scrubPercent = Math.round(p * 100);
            const frameNum = Math.min(Math.round(frameObj.frame) + 1, totalFrames);
            const rotDeg = Math.round(p * 180);

            if (scrubValRef.current) scrubValRef.current.textContent = `${scrubPercent}%`;
            if (frameValRef.current) frameValRef.current.textContent = `[${String(frameNum).padStart(3, '0')}/${String(totalFrames).padStart(3, '0')}]`;
            if (rotValRef.current) rotValRef.current.textContent = `${rotDeg}°`;
            if (reticleSvgRef.current) {
              reticleSvgRef.current.style.transform = `rotate(${rotDeg * 0.5}deg)`;
            }

            if (phaseBadgeRef.current) {
              if (p < 0.3) {
                phaseBadgeRef.current.textContent = '01 // ASSEMBLED STATE';
              } else if (p < 0.75) {
                phaseBadgeRef.current.textContent = '02 // SKELETON DISSECTION';
              } else {
                phaseBadgeRef.current.textContent = '03 // MECHANICAL VOID';
              }
            }
          },
        },
      });

      const fadeEnd = window.innerWidth < 1024 ? '+=40%' : '+=70%';
      gsap.to('.hero-editorial-col', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: fadeEnd,
          scrub: 0.6,
        },
        y: -40,
        opacity: 0.15,
        ease: 'power1.out',
      });
    }, containerRef);

    const handleResize = () => {
      updateDimensions();
      renderFrame(frameObj.frame);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctxTimeline.revert();
      ScrollTrigger.getById('hero-pin')?.kill(true);
    };
  }, [images]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center"
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #222 1px, transparent 1px),
            linear-gradient(to bottom, #222 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at 60% 50%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 60% 50%, black 40%, transparent 80%)',
        }}
      />

      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[650px] bg-neutral-800/15 rounded-full blur-[160px] pointer-events-none" />

      {/* SVG CAD Reticle */}
      <div className="absolute top-1/2 right-[12%] -translate-y-1/2 w-[580px] h-[580px] pointer-events-none hidden lg:block opacity-40">
        <svg
          ref={reticleSvgRef}
          viewBox="0 0 500 500"
          className="w-full h-full will-change-transform"
        >
          <circle cx="250" cy="250" r="230" fill="none" stroke="#444" strokeWidth="1" strokeDasharray="3 9" />
          <circle cx="250" cy="250" r="215" fill="none" stroke="#2a2a2a" strokeWidth="1" />
          <circle cx="250" cy="250" r="190" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="12 40" />
          <line x1="250" y1="10" x2="250" y2="30" stroke="#ef4444" strokeWidth="2" />
          <line x1="250" y1="470" x2="250" y2="490" stroke="#666" strokeWidth="1.5" />
          <line x1="10" y1="250" x2="30" y2="250" stroke="#666" strokeWidth="1.5" />
          <line x1="470" y1="250" x2="490" y2="250" stroke="#666" strokeWidth="1.5" />
        </svg>

        <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-neutral-500 tracking-[0.2em] uppercase flex items-center gap-2">
          <span>[ 45.00 MM BEZEL CALIPER ]</span>
        </div>
        <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 font-mono text-[9px] text-neutral-500 tracking-[0.2em] uppercase">
          <span>THICKNESS: 15.95 MM</span>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 md:px-16 h-full relative z-20 pointer-events-none flex flex-col justify-between py-24">
        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 tracking-[0.25em] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            <span>NYON // 46.3833° N, 6.2396° E</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">SERIAL NO. 414.CI.1123.RX</span>
            <span className="text-neutral-400">CALIBRE HUB1201</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="hero-editorial-col lg:col-span-5 max-w-lg">
            <div
              ref={phaseBadgeRef}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-900/80 border border-neutral-800 text-[10px] font-mono tracking-widest text-red-500 uppercase mb-4"
            >
              01 // ASSEMBLED STATE
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
              BIG BANG
              <span className="block text-neutral-400 font-light text-3xl sm:text-5xl lg:text-6xl mt-1">
                MECA-10
              </span>
            </h1>

            <div className="h-[2px] w-12 bg-red-600 my-6" />

            <p className="font-mono text-xs text-neutral-400 leading-relaxed tracking-wider">
              An architectural openworked skeleton calibre equipped with a 10-day power reserve, encased within micro-blasted black ceramic.
            </p>

            <div className="mt-8 flex items-center gap-6 font-mono text-[11px] text-neutral-500 tracking-wider">
              <div>
                <span className="text-white font-bold block">45 MM</span>
                <span>CERAMIC</span>
              </div>
              <div className="w-[1px] h-6 bg-neutral-800" />
              <div>
                <span className="text-white font-bold block">240 HOURS</span>
                <span>AUTONOMY</span>
              </div>
              <div className="w-[1px] h-6 bg-neutral-800" />
              <div>
                <span className="text-white font-bold block">HUB1201</span>
                <span>MANUFACTURE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 tracking-widest uppercase border-t border-neutral-900/80 pt-4">
          <span className="flex items-center gap-2">
            SCROLL TO EXPLODE <span className="animate-bounce inline-block">↓</span>
          </span>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>SCRUB: <strong ref={scrubValRef} className="text-white font-mono">0%</strong></span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">FRAME: <strong ref={frameValRef} className="text-red-500 font-mono">[001/058]</strong></span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">ROTATION: <strong ref={rotValRef} className="text-white font-mono">0°</strong></span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center lg:justify-end lg:pr-12 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full max-w-[1000px] object-contain"
        />
      </div>

      <div className="absolute inset-0 z-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_65%,#000000_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-36 z-20 pointer-events-none bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
}