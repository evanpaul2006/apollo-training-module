"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

export function FeatureSplit() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const cards = [
    {
      title: "Interactive Modules",
      description: "Step-by-step simulations of real manufacturing processes, ensuring your team learns by doing.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    },
    {
      title: "Skill Tracking",
      description: "Monitor competency levels across your entire workforce. Identify skill gaps before they affect production.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    },
    {
      title: "Standardized Curriculum",
      description: "Deploy consistent training material to every plant globally. Ensure everyone follows the exact same safety and quality standards.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    }
  ];

  return (
    <section id="features" ref={containerRef} className="py-32 relative">
      {/* Structural Ambient Shadow */}
      <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] bg-apollo/10 blur-[200px] rounded-full pointer-events-none" />

      <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 relative items-start">
          
          {/* Left: Editorial Split Typography (Sticky) */}
          <div className="w-full md:w-[45%] sticky top-32 flex flex-col justify-center self-start h-auto z-10">
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", x: -20 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
            >
              <span className="inline-block rounded-full px-3 py-1 mb-8 text-[10px] uppercase tracking-[0.2em] font-medium border border-white/10 bg-white/5 text-white/70">
                Training Platform
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white mb-8 font-medium">
                Built for the <br/>
                <span className="text-white/40">factory floor.</span>
              </h2>
              <p className="text-lg text-white/50 leading-relaxed font-light max-w-md">
                Interactive training modules designed specifically for Apollo Tyres manufacturing teams. Move beyond slide decks with practical, hands-on learning.
              </p>
            </motion.div>
          </div>

          {/* Right: Z-Axis Cascade Interactive Cards */}
          <div className="w-full md:w-[55%] relative flex flex-col gap-12 pb-32">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className="group relative w-full perspective-1000 origin-bottom cursor-pointer"
                initial={{ opacity: 0, y: 100, rotateX: -10, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ 
                  duration: 1.0, 
                  ease: [0.32, 0.72, 0, 1] 
                }}
              >
                {/* External Ambient Glow on Hover */}
                <div className="absolute -inset-1 bg-[#7B52B9]/60 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

                <div className="double-bezel relative z-10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:ring-white/20 group-hover:shadow-[0_10px_40px_-10px_rgba(123,82,185,0.3)] group-active:scale-[0.98]">
                  <div className="double-bezel-inner p-8 md:p-10 flex flex-col gap-6 relative overflow-hidden h-full transition-colors duration-700 bg-[#0A0A0A] group-hover:bg-[#0c0c0c]">
                    
                    {/* Sweeping Highlight Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/80 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-white/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        {card.icon}
                      </div>
                      
                      {/* Hidden Kinetic Arrow */}
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 -translate-x-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-white text-black">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                    </div>
                    
                    <div className="relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
                      <h3 className="text-2xl font-heading font-medium text-white mb-3 tracking-wide">{card.title}</h3>
                      <p className="text-white/50 leading-relaxed font-light transition-colors duration-700 group-hover:text-white/70">
                        {card.description}
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
