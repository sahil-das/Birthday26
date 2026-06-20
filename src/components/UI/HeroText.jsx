import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroText() {
  const topTextRef = useRef(null);
  const bottomTextRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(topTextRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "power3.out", delay: 1 });
    gsap.fromTo(bottomTextRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "power3.out", delay: 1 });
  }, []);

  return (
    <section className="h-screen flex flex-col items-center justify-between py-12 md:py-16 text-center px-4 pointer-events-none">
      
      {/* --- TOP OF SCREEN (PERFECTLY GLUED HTML TITLE) --- */}
      <div ref={topTextRef} className="pt-4 md:pt-8 w-full flex flex-col items-center justify-center">
        <h1 className="text-xl md:text-3xl tracking-[0.3em] uppercase text-pink-300/90 mb-2 font-light drop-shadow-lg">
          Happy Birthday
        </h1>
        {/* CSS glowing effect replicating the 3D emissive material */}
        <h2 className="text-6xl md:text-8xl text-[#ffd700] font-cursive leading-none" 
            style={{ textShadow: '0 0 15px #ffaa00, 0 0 30px #ffaa00' }}>
          Khushi
        </h2>
      </div>

      {/* --- BOTTOM OF SCREEN --- */}
      <div ref={bottomTextRef} className="animate-bounce pb-6">
        <p className="text-sm md:text-base text-slate-300 font-light max-w-md mx-auto drop-shadow-lg bg-slate-900/50 px-4 py-2 rounded-full backdrop-blur-md">
          ↓ Scroll down to unwrap memories ↓
        </p>
      </div>

    </section>
  );
}