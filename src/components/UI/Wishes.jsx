import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import gsap from 'gsap';

export default function Wishes() {
  const [mounted, setMounted] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(380); // We will calculate this dynamically
  const scrollData = useScroll();
  const hasTriggered = useRef(false);

  // Refs for animation
  const auroraRef = useRef(null);
  const coreGlowRef = useRef(null);
  const titleRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const parchmentRef = useRef(null);
  const bottomRollerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    // THE FIX: Measure the exact screen height and calculate a perfect fit!
    // It will take up 55% of the screen height, but will never grow larger than 420px.
    if (typeof window !== 'undefined') {
      const calculatedHeight = Math.min(window.innerHeight * 0.55, 420);
      setScrollHeight(calculatedHeight);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    gsap.set(auroraRef.current, { opacity: 0 });
    gsap.set(coreGlowRef.current, { scale: 0, opacity: 0 });
    gsap.set(titleRef.current, { opacity: 0, y: 20 });
    gsap.set(scrollContainerRef.current, { opacity: 0, y: 30 });
    
    gsap.set(parchmentRef.current, { height: 0 }); 
    gsap.set(bottomRollerRef.current, { y: 0 });
    gsap.set(textRef.current, { opacity: 0, y: 15 });
  }, [mounted]);

  useFrame(() => {
    if (!mounted) return;
    const scroll = scrollData.offset;

    // --- SCROLLING DOWN ---
    if (scroll > 0.40 && !hasTriggered.current) {
      hasTriggered.current = true;

      gsap.to(auroraRef.current, { opacity: 1, duration: 1.4, ease: "power2.out" });
      gsap.to(coreGlowRef.current, { scale: 1, opacity: 1, duration: 1.8, ease: "expo.out" });
      gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" });
      gsap.to(scrollContainerRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });

      // Using the dynamically calculated height instead of hardcoded pixels
      gsap.to(parchmentRef.current, { height: scrollHeight, duration: 1.5, ease: "power2.inOut" });
      gsap.to(bottomRollerRef.current, { y: scrollHeight, duration: 1.5, ease: "power2.inOut" }); 

      gsap.to(textRef.current, { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: "power2.out" });
    } 
    
    // --- SCROLLING UP ---
    else if (scroll < 0.30 && hasTriggered.current) {
      hasTriggered.current = false;

      gsap.to(textRef.current, { opacity: 0, y: 15, duration: 0.3 });
      
      gsap.to(parchmentRef.current, { height: 0, duration: 0.8, ease: "power2.inOut" });
      gsap.to(bottomRollerRef.current, { y: 0, duration: 0.8, ease: "power2.inOut" });

      gsap.to(scrollContainerRef.current, { opacity: 0, y: 30, duration: 0.6, ease: "power2.in" });
      gsap.to(titleRef.current, { opacity: 0, y: 20, duration: 0.6 });
      gsap.to(auroraRef.current, { opacity: 0, duration: 0.8 });
      gsap.to(coreGlowRef.current, { scale: 0, opacity: 0, duration: 0.8 });
    }
  });

  const WoodenRoller = () => (
    <div className="relative w-full h-8 md:h-10 bg-[linear-gradient(to_bottom,#451a03_0%,#92400e_30%,#d97706_50%,#92400e_70%,#451a03_100%)] rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.7)] border-y border-amber-900/80">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-11 bg-[linear-gradient(to_bottom,#fef08a_0%,#eab308_30%,#a16207_70%,#713f12_100%)] rounded-full border border-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-11 bg-[linear-gradient(to_bottom,#fef08a_0%,#eab308_30%,#a16207_70%,#713f12_100%)] rounded-full border border-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
    </div>
  );

  if (!mounted) return null;

  return createPortal(
    <section className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none select-none px-4">
      
      {/* Background Mask */}
      <div className="absolute inset-0 z-0">
        <div ref={auroraRef} className="absolute inset-0 bg-gradient-to-t from-pink-950/95 via-purple-950/80 to-slate-950/40 backdrop-blur-[2px]" />
        <div ref={coreGlowRef} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140vw] h-[40vh] bg-gradient-to-t from-pink-500/30 to-purple-500/10 blur-[60px] rounded-t-full" />
      </div>

      <div className="w-full flex flex-col items-center justify-center relative z-10">
        
        <h2 ref={titleRef} className="text-xl md:text-2xl font-serif text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 font-bold drop-shadow-[0_0_10px_rgba(250,204,21,0.3)] tracking-widest uppercase">
          A Royal Decree
        </h2>

        {/* We dynamically set the height of the container so flexbox perfectly centers it on screen */}
        <div ref={scrollContainerRef} style={{ height: scrollHeight }} className="relative w-full max-w-[85vw] md:max-w-sm drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          
          <div className="absolute top-0 left-0 w-full z-30">
            <WoodenRoller />
          </div>

          <div 
            ref={parchmentRef} 
            className="absolute top-4 left-[3%] w-[94%] bg-[#fdf5e6] shadow-[inset_0_0_60px_rgba(139,69,19,0.35)] border-x border-amber-900/40 overflow-hidden z-10"
          >
            <div className="absolute inset-0 mix-blend-multiply opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
            
            {/* The inner wrapper is locked to the dynamic height, preventing the text from squishing! */}
            <div style={{ height: scrollHeight }} className="w-full flex flex-col items-center justify-center p-4 md:p-6 text-center mix-blend-multiply relative">
              <div ref={textRef} className="relative z-20 flex flex-col items-center justify-center w-full h-full">
                
                <h3 className="text-xl md:text-2xl text-amber-950 font-serif mb-2 font-bold tracking-wide">
                  Happy Birthday, Khushi
                </h3>
                
                {/* Dynamically resized text to fit all screens */}
                <p className="text-amber-900/90 text-xs md:text-sm font-medium leading-relaxed max-w-xs mx-auto italic">
                  "May this new year of your life bring you countless reasons to smile. You deserve a birthday as spectacular as you are, filled with unending joy and limitless success."
                </p>

                <div className="mt-3 pt-2 w-4/5 mx-auto relative flex flex-col items-center border-t border-amber-900/10">
                   <p className="text-amber-950/70 text-[9px] tracking-[0.3em] uppercase mb-0.5">Forever Yours,</p>
                   <p className="text-3xl md:text-4xl font-cursive text-amber-800 drop-shadow-sm">Sahil</p>
                </div>

                <div className="absolute -bottom-2 md:-bottom-3 w-9 h-9 md:w-11 md:h-11 bg-[radial-gradient(circle_at_30%_30%,#dc2626,#991b1b,#7f1d1d)] rounded-full shadow-[0_3px_6px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_6px_rgba(0,0,0,0.5)] flex items-center justify-center border border-red-900/50">
                   <span className="text-yellow-400/90 text-sm md:text-lg font-serif font-bold">K</span>
                </div>

              </div>
            </div>
          </div>

          <div ref={bottomRollerRef} className="absolute top-4 left-0 w-full z-20">
            <WoodenRoller />
          </div>

        </div>
      </div>
    </section>,
    document.body
  );
}