import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const TaujiStory: React.FC = () => {
  // 1. Properly typed refs as HTMLDivElement
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const gotiRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Silent Backend Ping to combat Render's cold start
    fetch('https://your-taujiludo-backend.onrender.com/health').catch(() => {});

    // Context ensures animations are scoped and cleaned up
    const ctx = gsap.context(() => {
      
      // Master Scroll Timeline for the Goti (Piece)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrubbing effect
        }
      });

      // Move the piece down the vertical track
      if (gotiRef.current) {
        tl.to(gotiRef.current, {
          top: "95%",
          ease: "none"
        });
      }

      // Animate Story Cards as they enter the viewport
      // Explicitly telling TypeScript this is an array of HTMLDivElements
      const cards = gsap.utils.toArray('.story-card') as HTMLDivElement[];
      
      cards.forEach((card) => {
        gsap.fromTo(card, 
          { opacity: 0, x: 50 }, 
          {
            opacity: 1, 
            x: 0, 
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 70%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });

      // CTA pop at the end
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
            }
          }
        );
      }

    }, containerRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#050505] text-white font-sans selection:bg-white selection:text-black">
      
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_80%)]" />

      {/* Hero Section */}
      <div className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <h2 className="text-gray-500 tracking-[0.3em] uppercase text-xs md:text-sm font-bold mb-4">Welcome to the Board</h2>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
          TaujiLudo
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-light max-w-lg">
          The classic game of strategy, re-engineered for the modern high-stakes player. Scroll to begin your journey.
        </p>
        <div className="mt-12 animate-bounce">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent mx-auto" />
        </div>
      </div>

      {/* The Scroll Track & Story Container */}
      <div className="relative w-full max-w-5xl mx-auto py-20 px-4 md:px-10 flex">
        
        {/* The Vertical Ludo Track (Left side on mobile, Center on desktop) */}
        <div className="relative w-16 md:w-24 ml-2 md:mx-auto flex-shrink-0 z-20">
          {/* Track Line */}
          <div ref={trackRef} className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 md:w-3 bg-[#111] rounded-full overflow-hidden border border-white/5 shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
             <div className="w-full h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>

          {/* Safe Zones (Stars) */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-6 h-6 rounded-sm rotate-45 border-2 border-red-500 bg-black shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-6 h-6 rounded-sm rotate-45 border-2 border-blue-500 bg-black shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
          <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-6 h-6 rounded-sm rotate-45 border-2 border-green-500 bg-black shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
          <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-yellow-400 bg-black shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center justify-center">
             <div className="w-2 h-2 bg-yellow-400 rounded-full" />
          </div>

          {/* The Player Piece (Goti) */}
          <div 
            ref={gotiRef} 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 md:w-14 md:h-14 bg-white rounded-full border-4 border-[#050505] shadow-[0_0_30px_rgba(255,255,255,0.8)] z-30 flex items-center justify-center"
          >
            <div className="w-4 h-4 bg-[#050505] rounded-full" />
          </div>
        </div>

        {/* Story Content Blocks */}
        <div className="flex-1 ml-8 md:ml-0 flex flex-col justify-between py-[15%] gap-[25vh]">
          
          <StoryCard 
            color="text-red-500" 
            title="Step 1: The Secure Start" 
            headline="100% Verified Human Players"
            content="Your journey begins in a secure vault. We utilize military-grade RNG (Random Number Generation) and strict anti-bot algorithms. Every roll is cryptographically fair. Every opponent is real."
          />

          <StoryCard 
            color="text-blue-500" 
            title="Step 2: The Path" 
            headline="Enter the Global Arena"
            content="Whether you prefer the rapid tension of a 1v1 Deathmatch or the strategic chaos of a 4-player classic board, our matchmaking engine connects you instantly. The board is always open."
          />

          <StoryCard 
            color="text-green-500" 
            title="Step 3: The Attack" 
            headline="High Stakes, Real Value"
            content="This isn't just a game; it's a battle of wits. Choose your risk profile with entry pots ranging from casual ₹10 matches to high-roller ₹10,000 VIP tables. Outsmart them, outplay them, and take the pot."
          />

          <StoryCard 
            color="text-yellow-400" 
            title="Step 4: Home" 
            headline="Instant Cash, Instant Glory"
            content="You crossed the board. You made it Home. Your winnings shouldn't be held hostage. Withdraw your balance instantly to your UPI or Bank Account 24/7. No waiting, just winning."
          />

        </div>
      </div>

      {/* The Final Destination (CTA) */}
      <div className="min-h-[60vh] flex flex-col items-center justify-center relative z-10 px-6 mb-20">
        <div ref={ctaRef} className="text-center bg-[#0a0a0a] border border-white/10 p-10 md:p-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md max-w-2xl w-full">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">It's Your Turn.</h2>
          <p className="text-gray-400 mb-8">The backend is primed. The tables are live. Roll the dice and claim your spot at the top.</p>
          <button 
            onClick={() => window.location.href='/login'}
            className="w-full md:w-auto px-12 py-5 bg-white text-black font-black text-lg uppercase tracking-widest rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Enter TaujiLudo
          </button>
        </div>
      </div>

    </div>
  );
};

// 2. Define strict Prop Types for the sub-component
interface StoryCardProps {
  color: string;
  title: string;
  headline: string;
  content: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ color, title, headline, content }) => (
  <div className="story-card w-full md:max-w-md bg-[#0a0a0a]/80 border border-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:ml-20">
    <p className={`${color} text-xs font-bold tracking-[0.2em] uppercase mb-2`}>{title}</p>
    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-white/90">{headline}</h3>
    <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">
      {content}
    </p>
  </div>
);

export default TaujiStory;