"use client";

import { motion } from "framer-motion";

export function LogoWall() {
  const logos = [
    { name: "Volvo", src: "https://cdn.simpleicons.org/volvo/FFFFFF" },
    { name: "Honda", src: "https://cdn.simpleicons.org/honda/FFFFFF" },
    { name: "Ford", src: "https://cdn.simpleicons.org/ford/FFFFFF" },
    { name: "Suzuki", src: "https://cdn.simpleicons.org/suzuki/FFFFFF" },
    { name: "Toyota", src: "https://cdn.simpleicons.org/toyota/FFFFFF" },
    { name: "Volkswagen", src: "https://cdn.simpleicons.org/volkswagen/FFFFFF" },
    { name: "Audi", src: "https://cdn.simpleicons.org/audi/FFFFFF" },
    { name: "BMW", src: "https://cdn.simpleicons.org/bmw/FFFFFF" },
  ];

  // We duplicate the array to create a seamless infinite loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-24 relative overflow-hidden bg-[#050505]">
      <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
        
        <motion.div 
          className="flex flex-col items-center justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
        >
           <span className="inline-block rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-medium border border-white/10 bg-white/5 text-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
             Trusted by Global Manufacturers
           </span>
        </motion.div>

        <div className="relative w-full mask-edges mx-auto max-w-5xl">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {duplicatedLogos.map((logo, index) => (
              <div 
                key={index} 
                className="w-48 mx-8 flex items-center justify-center group"
              >
                <div className="relative w-full h-16 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 cursor-pointer">
                  <img 
                    src={logo.src} 
                    alt={logo.name} 
                    className="max-h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-700" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
