import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import LudoScene from '../utils/Scenes/LudoScene';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@react-three/drei';
import { Suspense } from 'react'; // Don't forget to import Suspense from React!

// The Premium Boot Sequence Overlay
const BootSequence: React.FC = () => {
  const { progress, active } = useProgress();

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        active ? 'opacity-100 backdrop-blur-xl' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing Ambient Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-500/20 blur-[50px] rounded-full" />
        
        {/* Loading Icon/Logo */}
        <div className="w-20 h-20 border border-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] relative z-10 bg-black/20">
          {/* Swapped the yellow dot for the glowing TaujiLudo Logo */}
          <img 
            src="/logo.png" 
            alt="TaujiLudo" 
            className="w-12 h-12 object-contain animate-pulse drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" 
            onError={(e) => {
              // Fallback just in case the image path is broken during dev
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Text */}
        <h2 className="text-white text-xl font-black uppercase tracking-[0.3em] mb-6 relative z-10">
          Initializing Arena
        </h2>

        {/* Progress Bar */}
        <div className="w-64 md:w-80 h-1 bg-white/10 rounded-full overflow-hidden relative z-10">
          <div 
            className="h-full bg-yellow-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(250,204,21,0.8)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Telemetry Data */}
        <div className="mt-4 flex justify-between w-64 md:w-80 text-[10px] font-mono text-gray-500 uppercase tracking-widest relative z-10">
          <span>Establishing Link</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

// Gsap
gsap.registerPlugin(ScrollTrigger);

export const LandingPage2: React.FC = () => {
  // Hero Animation Refs
  const taujiRef = useRef<HTMLHeadingElement>(null);
  const ludoRef = useRef<HTMLHeadingElement>(null);
  const hudLeftRef = useRef<HTMLDivElement>(null);
  const hudRightRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);
  
  // Bento Dashboard Refs
  const bentoContainerRef = useRef<HTMLDivElement>(null);
  const bento1Ref = useRef<HTMLDivElement>(null);
  const bento2Ref = useRef<HTMLDivElement>(null);
  const bento3Ref = useRef<HTMLDivElement>(null);
  const bento4Ref = useRef<HTMLDivElement>(null);

  // CTA Ref
  const ctaRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. THE VAULT REVEAL (Hero Animation)
      const tlHero = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-trigger", 
          start: "top top",
          end: "bottom top", 
          scrub: 1.5,
        }
      });

      tlHero.to(taujiRef.current, { x: "-30vw", y: "-15vh", opacity: 0, rotation: -5 }, 0) 
            .to(ludoRef.current, { x: "30vw", y: "15vh", opacity: 0, rotation: 5 }, 0)   
            .to(hudLeftRef.current, { x: "-15vw", opacity: 0 }, 0)                       
            .to(hudRightRef.current, { x: "15vw", opacity: 0 }, 0)                       
            .to(scrollIndRef.current, { y: "15vh", opacity: 0 }, 0)                      
            .to(frameRef.current, { scale: 1.5, opacity: 0 }, 0);                        

     // =========================================================================
      // 2. THE TRANSFORMER BENTO ASSEMBLE/DISASSEMBLE
      // NOTE: "scrub: 1.5" automatically handles the flawless SCROLL UP animation!
      // =========================================================================
      const tlBento = gsap.timeline({
        scrollTrigger: {
          trigger: "#bento-section",
          start: "top 55%", 
          end: "bottom top",
          scrub: 1.5, 
        }
      });

      tlBento.fromTo(bentoContainerRef.current,
        { opacity: 0, scale: 0.9, filter: "blur(20px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" }
      )
      .fromTo(bento1Ref.current,
        { opacity: 0, x: "-15vw", y: "-15vh", rotation: -15, filter: "blur(15px)" },
        { opacity: 1, x: 0, y: 0, rotation: 0, filter: "blur(0px)", duration: 1.75, ease: "back.out(1.2)" },
        "-=1"
      )
      .fromTo(bento2Ref.current,
        { opacity: 0, x: "15vw", y: "-15vh", rotation: 15, filter: "blur(15px)" },
        { opacity: 1, x: 0, y: 0, rotation: 0, filter: "blur(0px)", duration: 1.75, ease: "back.out(1.2)" },
        "<0.1" 
      )
      .fromTo(bento3Ref.current,
        { opacity: 0, x: "-25vw", y: "5vh", rotation: -10, filter: "blur(15px)" },
        { opacity: 1, x: 0, y: 0, rotation: 0, filter: "blur(0px)", duration: 1.75, ease: "back.out(1.2)" },
        "<0.1"
      )
      .fromTo(bento4Ref.current,
        { opacity: 0, x: "20vw", y: "20vh", rotation: 10, filter: "blur(15px)" },
        { opacity: 1, x: 0, y: 0, rotation: 0, filter: "blur(0px)", duration: 1.75, ease: "back.out(1.2)" },
        "<0.1"
      )
      // HOLD STATE
      .to(bentoContainerRef.current, { opacity: 1, duration: 10 })
      // DISASSEMBLE
      .to(bento1Ref.current, { opacity: 0, x: "-20vw", y: "-20vh", rotation: -25, filter: "blur(20px)", duration: 2, ease: "power2.in" })
      .to(bento2Ref.current, { opacity: 0, x: "25vw", y: "-15vh", rotation: 25, filter: "blur(20px)", duration: 2, ease: "power2.in" }, "<0.1")
      .to(bento3Ref.current, { opacity: 0, x: "-30vw", y: "15vh", rotation: -20, filter: "blur(20px)", duration: 2, ease: "power2.in" }, "<0.1")
      .to(bento4Ref.current, { opacity: 0, x: "30vw", y: "25vh", rotation: 20, filter: "blur(20px)", duration: 2, ease: "power2.in" }, "<0.1")
      // BASE PLATE VANISH
      .to(bentoContainerRef.current,
        { opacity: 0, scale: 1.1, filter: "blur(20px)", duration: 2, ease: "power2.in" },
        "-=1.5"
      );

      // =========================================================================
      // 3. THE CLIMAX (HUD BAR REVEAL)
      // =========================================================================
      const tlCta = gsap.timeline({
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 90%", // Start animating when the top of the CTA hits the bottom 10% of the screen
          end: "top 40%",   // Fully formed by the time it reaches the middle of the screen
          scrub: 1.5,       // Smooth, buttery lag
        }
      });

      tlCta.fromTo(ctaRef.current,
        { 
          scale: 0.9, 
          opacity: 0, 
          y: 150, 
          filter: "blur(20px)",
          rotationX: 10 // Slight 3D tilt as it comes up
        },
        {
          scale: 1, 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          rotationX: 0,
          ease: "power3.out"
        }
      );
    });

    return () => ctx.revert();
  }, []);
  return (
    <div className="relative w-full bg-[#050505] text-white selection:bg-yellow-500 selection:text-black font-sans">
      
      <BootSequence />
      
      {/* 3D LAYER: Pinned background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <LudoScene />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML SCROLL TRACK */}
      <div className="main-container relative z-10 overflow-x-hidden">
        
        {/* Section 1: The Exploding Vault Hero */}
        <section id="hero-trigger" className="h-[150vh] w-full relative pointer-events-none">
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            
            {/* Nostalgic HUD (Left) */}
            <div ref={hudLeftRef} className="absolute top-8 left-6 md:top-12 md:left-12 flex flex-col gap-2 font-mono text-[10px] md:text-xs text-gray-400 uppercase tracking-[0.2em] z-20">
              <div className="flex gap-3 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse delay-75" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse delay-150" />
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse delay-300" />
              </div>
              <span>Childhood Board</span>
              <span>Modern Arena</span>
              <span className="text-white mt-2 font-bold tracking-widest">Waiting for a 6...</span>
            </div>

            {/* Nostalgic HUD (Right) */}
            <div ref={hudRightRef} className="absolute top-8 right-6 md:top-12 md:right-12 font-mono text-[10px] md:text-xs text-gray-400 uppercase tracking-[0.2em] text-right z-20">
               <span>Players: 2</span>
               <br/>
               <span>Status: Ready</span>
            </div>

            {/* Massive Typography Vault */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full mt-[-5vh]">
              <h1 
                ref={taujiRef}
                className="text-[clamp(5rem,15vw,14rem)] leading-[0.8] font-black uppercase text-white tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] -translate-x-4 md:-translate-x-12"
              >
                Tauji
              </h1>
              <h1 
                ref={ludoRef}
                className="text-[clamp(5rem,15vw,14rem)] leading-[0.8] font-black uppercase text-transparent tracking-tighter translate-x-4 md:translate-x-12"
                style={{ WebkitTextStroke: 'max(2px, 0.2vw) rgba(255, 255, 255, 0.9)' }}
              >
                Ludo
              </h1>
            </div>

            {/* Abstract Ludo 'Home' Frame */}
            <div ref={frameRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] max-w-[600px] max-h-[600px] border border-white/5 rounded-[2rem] z-0 flex flex-col justify-between p-6 md:p-10 pointer-events-none">
               <div className="flex justify-between w-full">
                  <div className="w-10 h-10 md:w-16 md:h-16 border-t-4 border-l-4 border-red-500/40 rounded-tl-2xl" />
                  <div className="w-10 h-10 md:w-16 md:h-16 border-t-4 border-r-4 border-green-500/40 rounded-tr-2xl" />
               </div>
               <div className="flex justify-between w-full">
                  <div className="w-10 h-10 md:w-16 md:h-16 border-b-4 border-l-4 border-blue-500/40 rounded-bl-2xl" />
                  <div className="w-10 h-10 md:w-16 md:h-16 border-b-4 border-r-4 border-yellow-400/40 rounded-br-2xl" />
               </div>
            </div>

            {/* Scroll Indicator */}
            <div ref={scrollIndRef} className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
              <div className="w-[1px] h-12 md:h-16 bg-gray-800 relative overflow-hidden">
                 <div className="w-full h-1/2 bg-white absolute top-0 animate-[scrolldown_1.5s_ease-in-out_infinite]" />
              </div>
              <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase mt-4 text-white font-bold">Make Your Move</span>
            </div>

          </div>
        </section>

        {/* {/* =========================================================================
            SECTION 2: TRANSFORMER BENTO BOX REVEAL
        ========================================================================= */}
        <section id="bento-section" className="h-[250vh] w-full relative z-10 pointer-events-none">
          <div className="sticky top-0 h-screen w-full flex items-end justify-start px-4 md:px-12  pointer-events-none">

            {/* The Glass Command Center Panel */}
            <div
              ref={bentoContainerRef}
              className="pointer-events-auto w-full max-w-2xl relative"
            >
              {/* Premium Background Panel */}
              <div className="absolute inset-0 bg-[#070707]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] -z-10" />

              {/* Panel Header */}
              <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 flex items-center justify-between border-b border-white/5">
                 <div>
                    <h2 className="text-[10px] font-mono tracking-[0.3em] text-yellow-500/80 uppercase mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                      Live Network
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white/90">System Specs</h3>
                 </div>
                 {/* Decorative Tech Elements */}
                 <div className="hidden md:flex gap-1.5 opacity-50">
                    <div className="w-1 h-4 bg-white rounded-full" />
                    <div className="w-1 h-6 bg-white rounded-full" />
                    <div className="w-1 h-3 bg-white rounded-full" />
                 </div>
              </div>

              {/* The Bento Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 p-5 md:p-8 pt-5 md:pt-6">

                {/* Card 1: Security */}
                <div ref={bento1Ref} className="bento-item col-span-1 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 border border-white/5 rounded-3xl p-5 md:p-6 relative overflow-hidden group">
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-red-500/20 blur-[30px] rounded-full group-hover:opacity-100 opacity-40 transition-opacity duration-700 pointer-events-none" />
                  <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20 mb-4 md:mb-6">
                    <span className="text-red-400 font-black text-[10px]">SAFE</span>
                  </div>
                  <h3 className="text-base md:text-lg font-black uppercase text-white/90 leading-tight">Verified<br/>Players</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-2 leading-relaxed">100% Human. Military RNG.</p>
                </div>

                {/* Card 2: Arena */}
                <div ref={bento2Ref} className="bento-item col-span-1 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 border border-white/5 rounded-3xl p-5 md:p-6 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 blur-[30px] rounded-full group-hover:opacity-100 opacity-40 transition-opacity duration-700 pointer-events-none" />
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 mb-4 md:mb-6">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h3 className="text-base md:text-lg font-black uppercase text-white/90 leading-tight">Global<br/>Arena</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-2 leading-relaxed">Instant 1v1 Match.</p>
                </div>

                {/* Card 3: High Stakes */}
                <div ref={bento3Ref} className="bento-item col-span-2 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 border border-white/5 rounded-3xl p-5 md:p-6 relative overflow-hidden group flex flex-col justify-between">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-500/10 blur-[40px] rounded-full group-hover:opacity-100 opacity-40 transition-opacity duration-700 pointer-events-none" />
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                      <span className="text-green-400 font-black text-sm">₹</span>
                    </div>
                    <div className="flex gap-2">
                       <span className="font-mono text-[9px] md:text-[10px] border border-white/10 px-2 py-1 rounded bg-black/40 text-gray-400">Min: ₹50</span>
                       <span className="font-mono text-[9px] md:text-[10px] border border-yellow-500/30 px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]">Max: ₹10K</span>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg md:text-xl font-black uppercase text-white/90">High Stakes</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1">Choose your risk profile. Outsmart them, take the pot.</p>
                  </div>
                </div>

                {/* Card 4: Payouts */}
                <div ref={bento4Ref} className="bento-item col-span-2 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 border border-white/5 rounded-3xl p-5 md:p-6 relative overflow-hidden group flex flex-col justify-between">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-400/10 blur-[40px] rounded-full group-hover:opacity-100 opacity-40 transition-opacity duration-700 pointer-events-none" />
                  <div className="flex justify-between items-center mb-2 relative z-10">
                    <h3 className="text-lg md:text-xl font-black uppercase text-white/90">Instant Win</h3>
                    <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center border border-yellow-400/20">
                       <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 w-[90%] md:w-[80%] relative z-10">Withdraw your balance instantly to your UPI or Bank Account 24/7. There is some waiting periods.</p>
                </div>

              </div>
            </div>
          </div>
        </section>


       {/* =========================================================================
            SECTION 3/4: THE CLIMAX (WIDE HUD TERMINAL)
            Redesigned to float at the top half, revealing the 3D board below
        ========================================================================= */}
        <section className="min-h-screen flex flex-col items-center justify-start pt-[7vh] md:pt-[10vh] relative pointer-events-none px-6 pb-20">
          
          <div 
            ref={ctaRef} 
            className="pointer-events-auto w-full max-w-5xl relative group"
            style={{ perspective: "1000px" }}
          >
            
            {/* Massive Ambient Gold Glow (Activates on Hover) */}
            <div className="absolute -inset-4 md:-inset-10 bg-yellow-500/20 blur-[80px] rounded-[3rem] opacity-40 group-hover:opacity-80 transition-opacity duration-1000 pointer-events-none" />

            {/* The Glass HUD Bar */}
            <div className="relative bg-[#070707]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 transform transition-transform duration-700 hover:scale-[1.02]">
              
              {/* LEFT SIDE: Text & Trust Badges */}
              <div className="flex-1 text-center md:text-left w-full">
                
                {/* Telemetry Accents */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4 md:mb-6">
                   <span className="font-mono text-[9px] md:text-[10px] text-gray-500 tracking-[0.2em] uppercase">Gateway // 01</span>
                   <span className="hidden md:flex items-center gap-1.5 font-mono text-[10px] text-green-400 tracking-[0.2em] uppercase">
                     <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" /> System Live
                   </span>
                </div>

                {/* The Hook */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-lg leading-none">
                  Your Table<br className="hidden md:block"/> Is Ready
                </h2>
                <p className="text-gray-400 text-sm md:text-base font-light max-w-md mx-auto md:mx-0 leading-relaxed mb-6 md:mb-8">
                  The stakes are set. The board is clear. Step into the high-roller arena and claim the pot.
                </p>

                {/* Trust Badges */}
                <div className="flex items-center justify-center md:justify-start gap-6 text-[9px] md:text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Encrypted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Zero Lag
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE: Graphic & Button */}
              <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto">
                
                {/* Mobile System Live (Hidden on Desktop) */}
                <span className="md:hidden flex items-center gap-1.5 font-mono text-[9px] text-green-400 tracking-[0.2em] uppercase mb-6">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" /> System Live
                </span>

                {/* Central Graphic: The Digital Token */}
                <div className="flex justify-center mb-6 relative">
                  {/* Outer rotating dashed ring */}
                  <div className="absolute w-[4.5rem] h-[4.5rem] md:w-20 md:h-20 border border-white/10 border-dashed rounded-full animate-[spin_10s_linear_infinite]" />
                  {/* Inner glass ring */}
                  <div className="w-14 h-14 md:w-16 md:h-16 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-xl relative z-10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                      {/* Glowing Core */}
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full animate-pulse flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.5)]">
                         <svg className="w-4 h-4 md:w-5 md:h-5 text-black translate-x-[1px] md:translate-x-[2px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                  </div>
                </div>

                {/* The Premium Button */}
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full md:w-64 relative group/btn block"
                >
                  {/* Button Hover Aura */}
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-0 group-hover/btn:opacity-60 transition-opacity duration-500" />
                  {/* Button Surface */}
                  <div className="relative w-full bg-white text-black py-4 md:py-5 rounded-full font-black text-sm md:text-base lg:text-lg tracking-[0.2em] uppercase hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center gap-3">
                    Enter Match
                    <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/btn:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};