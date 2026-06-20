import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import gsap from 'gsap';

import Scene from './components/3D/Scene';
import HeroText from './components/UI/HeroText';
import Wishes from './components/UI/Wishes'; 

export default function App() {
  const [started, setStarted] = useState(false);
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  
  const audioRef = useRef(new Audio('https://cdn.pixabay.com/download/audio/2022/05/05/audio_82136e6eb7.mp3'));

  const handleEnter = () => {
    audioRef.current.loop = true;
    audioRef.current.volume = 0;
    audioRef.current.play().catch(e => console.log(e));
    gsap.to(audioRef.current, { volume: 0.5, duration: 4, ease: "power2.inOut" });
    
    gsap.to(buttonRef.current, { scale: 1.5, opacity: 0, duration: 0.5, ease: "power3.out" });

    setStarted(true); 

    gsap.to(overlayRef.current, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      duration: 1.5,
      delay: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        overlayRef.current.style.display = 'none';
      }
    });
  };

  return (
    <div className="w-full h-screen bg-slate-950 relative">
      
      {/* --- 3D CANVAS LAYER --- */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 5, 35], fov: 50 }}>
          <ScrollControls pages={started ? 3 : 0} damping={0.2}>
            
            <Scene started={started} />
            
            {/* HTML Layer connected to the 3D scroll engine */}
            <Scroll html style={{ width: '100%' }}>
              {started && (
                <>
                  <HeroText />
                  {/* FIXED: Wishes is now safely back inside the Canvas so it can access the scroll data without crashing! */}
                  <Wishes />
                </>
              )}
            </Scroll>
            
          </ScrollControls>
        </Canvas>
      </div>

      {/* --- INTRO CURTAIN (LANDING SCREEN) --- */}
      <div ref={overlayRef} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
        
        {/* The Main Button */}
        <button 
          ref={buttonRef}
          onClick={handleEnter}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-white font-semibold tracking-[0.2em] uppercase shadow-[0_0_40px_rgba(236,72,153,0.4)] hover:scale-105 hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] transition-all duration-300 cursor-pointer z-10"
        >
          Unwrap Surprise
        </button>

        {/* Personalized Signature */}
        <div className="absolute bottom-12 md:bottom-16 flex flex-col items-center justify-center opacity-70 select-none">
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-pink-200 mb-3 drop-shadow-md">
            Crafted Exclusively For You
          </p>
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-pink-500/50"></span>
            <p className="font-cursive text-3xl md:text-4xl text-[#ffd700]" style={{ textShadow: '0 0 15px rgba(255, 215, 0, 0.4)' }}>
              Sahil
            </p>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-pink-500/50"></span>
          </div>
        </div>

      </div>
    </div>
  );
}