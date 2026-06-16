"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] flex items-center overflow-hidden pt-32 pb-24 lg:py-0">
      {/* Deep OLED Radial Mesh Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-apollo/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" 
        />
      </div>

      <div className="container max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center justify-center text-center pt-32 md:pt-40 lg:pt-48">
        
        <motion.div style={{ y: yText, opacity: opacityText }} className="flex flex-col items-center">
          <motion.h1 
            className="font-heading text-5xl sm:text-7xl lg:text-[7rem] font-medium tracking-tight text-white leading-[0.9] max-w-5xl mb-10"
            initial={{ opacity: 0, y: 50, filter: 'blur(15px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          >
            Master the physics of <span className="text-transparent bg-clip-text bg-gradient-to-r from-apollo-light to-indigo-300">manufacturing.</span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed mb-14 font-light"
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          >
            The enterprise platform engineered for Apollo Tyres. Haptic simulations, zero-latency technical training, and immersive data feedback.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <Link href="/login" className="block">
              <Button className="group rounded-full bg-white text-black hover:text-white p-0 text-lg relative overflow-hidden h-14 w-64 border-0 transition-transform duration-300 ease-out active:scale-[0.97]">
                {/* Fill Background */}
                <div className="absolute left-0 top-0 bottom-0 w-0 bg-[#58358F] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:w-full z-0" />
                
                {/* Arrow Circle */}
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/10 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:left-[calc(100%-3.125rem)] group-hover:bg-white/20 z-10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-700 group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>

                {/* Text */}
                <span className="absolute inset-0 flex items-center justify-center font-medium z-10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] pl-8 group-hover:pl-0 group-hover:pr-10">
                  Initialize Session
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Double-Bezel Dashboard Showcase */}
        <motion.div 
          className="mt-24 w-full max-w-[1200px] mx-auto perspective-1000"
          initial={{ opacity: 0, y: 100, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
          style={{ y: yImage, scale: scaleImage }}
        >
          <div className="double-bezel">
            <div className="double-bezel-inner relative aspect-[16/9] overflow-hidden group">
               <div className="absolute inset-0 bg-apollo/10 backdrop-blur-xl mix-blend-overlay transition-all duration-700 group-hover:bg-apollo/5" />
               <img 
                  src="/images/hero.png" 
                  alt="Interface" 
                  className="w-full h-full object-cover opacity-80 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
