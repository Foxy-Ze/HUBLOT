// src/components/MacroCards.jsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Disc, Shield, Sliders, Search } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    id: '01',
    title: 'Calibre HUB1201',
    subtitle: 'Skeleton Manufacture Movement',
    desc: 'Conceived and developed in-house. 223 hand-finished components, 24 jewels, featuring a dual display rack-and-pinion power reserve system.',
    image: '/assets/Cutouts/calibri core.png',
    icon: Disc,
    tag: 'MECHANISM',
    colSpan: 'md:col-span-7',
    isCircularMovement: true,
  },
  {
    id: '02',
    title: 'Micro-Blasted Ceramic',
    subtitle: 'High-Tech Bezel & Case Profile',
    desc: '45mm matte black ceramic case with 6 H-shaped titanium screws. Diamond-hard scratch resistance crafted under ultra-high sintering temperatures.',
    image: '/assets/Cutouts/bezel crown.png',
    icon: Shield,
    tag: 'METALLURGY',
    colSpan: 'md:col-span-5',
  },
  {
    id: '03',
    title: 'Lined Rubber Strap',
    subtitle: 'Structured Ergonomics & Clasp',
    desc: 'Black structured lined rubber paired with a black ceramic and black-plated titanium deployant buckle clasp. Engineered for ergonomic grip.',
    image: '/assets/Cutouts/strap clasp.png',
    icon: Sliders,
    tag: 'FUSION',
    colSpan: 'md:col-span-5',
  },
  {
    id: '04',
    title: 'Deconstructed Overview',
    subtitle: 'Ten-Day Autonomous Reserve',
    desc: 'Two series-coupled barrels driving an openworked rack-and-pinion transmission system visible through the sapphire dial and exhibition caseback.',
    image: '/assets/Cutouts/exploded overview.png',
    icon: Layers,
    tag: 'ARCHITECTURE',
    colSpan: 'md:col-span-7',
  },
];

function TiltCard({ card }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const [loupe, setLoupe] = useState({ active: false, x: 0, y: 0, bgX: 0, bgY: 0 });
  const Icon = card.icon;

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    const img = imgRef.current;
    if (!el || !img) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3D Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;

    // Loupe coordinates relative to image
    const imgRect = img.getBoundingClientRect();
    if (
      e.clientX >= imgRect.left &&
      e.clientX <= imgRect.right &&
      e.clientY >= imgRect.top &&
      e.clientY <= imgRect.bottom
    ) {
      const relX = ((e.clientX - imgRect.left) / imgRect.width) * 100;
      const relY = ((e.clientY - imgRect.top) / imgRect.height) * 100;
      setLoupe({
        active: true,
        x,
        y,
        bgX: relX,
        bgY: relY,
      });
    } else {
      setLoupe((prev) => ({ ...prev, active: false }));
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setLoupe((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`macro-card group relative overflow-hidden rounded-xl bg-[#090909] border border-neutral-900/90 transition-[transform] duration-200 ease-out p-8 flex flex-col justify-between ${card.colSpan}`}
      style={{ transformStyle: 'preserve-3d' }}
      data-cursor="INSPECT"
    >
      {/* Radial Specular Lighting */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(239, 68, 68, 0.08), rgba(255, 255, 255, 0.04) 40%, transparent 80%)`,
        }}
      />

      {/* Horologist Loupe (Magnifying Glass) */}
      {loupe.active && (
        <div
          className="pointer-events-none absolute w-28 h-28 -ml-14 -mt-14 rounded-full border-2 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.4)] z-40 overflow-hidden bg-black hidden md:block"
          style={{
            left: `${loupe.x}px`,
            top: `${loupe.y}px`,
            backgroundImage: `url("${card.image}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '240%',
            backgroundPosition: `${loupe.bgX}% ${loupe.bgY}%`,
          }}
        >
          {/* Loupe Crosshair Lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
            <div className="w-full h-[1px] bg-red-500/50" />
            <div className="absolute h-full w-[1px] bg-red-500/50" />
          </div>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-red-400 bg-black/80 px-1 rounded">
            2.2X ZOOM
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 z-20">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-neutral-400 group-hover:text-red-500 transition-colors" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">
            {card.tag} // {card.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-3 h-3 text-neutral-600 group-hover:text-red-400 transition-colors" />
          <span className="font-mono text-[10px] tracking-widest text-neutral-500 border border-neutral-800/80 px-2 py-0.5 rounded bg-black/40">
            HOVER TO LOUPE
          </span>
        </div>
      </div>

      {/* Image Showcase */}
      <div className="relative w-full h-64 md:h-72 my-4 flex items-center justify-center overflow-hidden z-10">
        <img
          ref={imgRef}
          src={card.image}
          alt={card.title}
          className={`max-h-full max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700 ease-out ${
            card.isCircularMovement
              ? 'rounded-full [mask-image:radial-gradient(circle_at_center,black_60%,transparent_98%)] contrast-110 brightness-95'
              : ''
          }`}
          loading="lazy"
        />
      </div>

      {/* Footer Typography */}
      <div className="z-20 mt-6 pt-6 border-t border-neutral-900/80">
        <span className="font-mono text-[11px] text-red-500 tracking-wider block mb-1">
          {card.subtitle}
        </span>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight uppercase mb-2 text-white">
          {card.title}
        </h3>
        <p className="text-neutral-400 text-xs font-mono leading-relaxed">
          {card.desc}
        </p>
      </div>

      <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

export default function MacroCards() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.macro-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#050505] text-white py-32 px-6 md:px-16 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-neutral-800">
          <div>
            <span className="font-mono text-xs tracking-[0.35em] text-red-500 uppercase block mb-2">
              Phase 02 // Structural Dissection
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Anatomy of Innovation
            </h2>
          </div>
          <p className="font-mono text-xs text-neutral-400 max-w-sm mt-4 md:mt-0 tracking-wider">
            Exposing the boundary between micro-mechanics and industrial ceramic metallurgy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {CARDS.map((card) => (
            <TiltCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}