import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Gallery() {
  const containerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  // We use Intersection Observer to trigger the fade-ins only when she scrolls down to them!
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target, 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
          );
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, { threshold: 0.2 });

    if (card1Ref.current) observer.observe(card1Ref.current);
    if (card2Ref.current) observer.observe(card2Ref.current);
    if (card3Ref.current) observer.observe(card3Ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto px-6 mt-[90vh] py-32 pointer-events-auto" ref={containerRef}>
      
      {/* --- TITLE --- */}
      <h2 className="text-4xl md:text-6xl font-serif text-center mb-24 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400 font-bold drop-shadow-lg">
        My Wishes For You
      </h2>

      {/* --- THE WISHES WALL (Typography Focus) --- */}
      <div className="flex flex-col gap-16 md:gap-24 relative">
        
        {/* Connecting Background Line for elegance */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-pink-500/30 to-transparent -translate-x-1/2" />

        {/* Wish Card 1: Aligned Left */}
        <div ref={card1Ref} className="md:w-1/2 md:pr-12 text-left opacity-0">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 transition-all hover:shadow-[0_0_40px_rgba(255,182,193,0.15)] relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
            
            <h3 className="text-2xl text-pink-300 font-serif mb-4">Unending Joy</h3>
            <p className="text-slate-300 leading-relaxed font-light text-lg">
              May this new year of your life bring you countless reasons to smile. I hope your days are filled with the same bright, beautiful energy that you bring into my life every single day.
            </p>
          </div>
        </div>

        {/* Wish Card 2: Aligned Right */}
        <div ref={card2Ref} className="md:w-1/2 md:ml-auto md:pl-12 text-left md:text-right opacity-0">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 transition-all hover:shadow-[0_0_40px_rgba(192,132,252,0.15)] relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <h3 className="text-2xl text-purple-300 font-serif mb-4">Limitless Success</h3>
            <p className="text-slate-300 leading-relaxed font-light text-lg">
              Whatever dreams you are chasing, I know you will catch them. May you find success in everything you touch, and may you always have the courage to reach for the stars.
            </p>
          </div>
        </div>

        {/* Wish Card 3: Centered */}
        <div ref={card3Ref} className="w-full md:w-3/4 mx-auto text-center opacity-0 mt-8">
          <div className="bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-10 md:p-14 shadow-[0_0_50px_rgba(255,182,193,0.1)] relative">
            <p className="text-pink-200 text-2xl md:text-3xl font-cursive leading-relaxed drop-shadow-md">
              "To the most beautiful person, inside and out. You deserve a birthday as spectacular as you are."
            </p>
          </div>
        </div>

      </div>
      
      {/* --- FINAL SIGN-OFF --- */}
      <div className="text-center mt-40 pb-32">
        <h3 className="text-3xl font-serif text-white mb-6 tracking-wide">Happy Birthday, Khushi.</h3>
        <p className="text-slate-400 max-w-lg mx-auto font-light">
          Enjoy your special day, and don't forget to make a wish.
        </p>
      </div>

    </section>
  );
}