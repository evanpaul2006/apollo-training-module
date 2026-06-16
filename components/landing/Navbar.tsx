"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center mt-6 pointer-events-none">
        <motion.div 
          className="pointer-events-auto flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur-2xl ring-1 ring-white/10 rounded-full w-[90%] max-w-5xl shadow-2xl"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-apollo text-white flex items-center justify-center font-bold text-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
              A
            </div>
            <span className="font-heading font-medium text-lg tracking-wide text-white">Apollo Learn</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#enterprise" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              Enterprise
            </Link>
            <Link href="#features" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              Platform
            </Link>
          </nav>

          <div className="hidden md:flex items-center">
            <Link href="/login">
              <Button className="group rounded-full bg-white text-black hover:text-white p-0 pressable relative overflow-hidden h-11 w-44 border-0">
                {/* Fill Background */}
                <div className="absolute left-0 top-0 bottom-0 w-0 bg-[#58358F] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:w-full z-0" />
                
                {/* Arrow Circle */}
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/10 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:left-[calc(100%-2.5rem)] group-hover:bg-white/20 z-10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-700 group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>

                {/* Text */}
                <span className="absolute inset-0 flex items-center justify-center text-sm font-medium z-10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] pl-6 group-hover:pl-0 group-hover:pr-8">
                  Get Started
                </span>
              </Button>
            </Link>
          </div>

          {/* Hamburger Morph */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50 relative group"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`h-0.5 w-6 bg-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 w-6 bg-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </motion.div>
      </header>

      {/* Expanded Modal */}
      <div 
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-3xl transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col justify-center items-center ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <nav className="flex flex-col items-center gap-8">
          {[
            { label: 'Enterprise', href: '#enterprise' },
            { label: 'Platform', href: '#features' }
          ].map((item, i) => (
            <Link 
              key={item.label}
              href={item.href} 
              className="text-4xl font-heading font-medium text-white hover:text-apollo-light transition-colors"
              style={{
                transition: `transform 700ms cubic-bezier(0.32,0.72,0,1) ${100 + (i * 100)}ms, opacity 700ms cubic-bezier(0.32,0.72,0,1) ${100 + (i * 100)}ms`,
                transform: isOpen ? 'translateY(0)' : 'translateY(48px)',
                opacity: isOpen ? 1 : 0
              }}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div
             style={{
                transition: `transform 700ms cubic-bezier(0.32,0.72,0,1) 400ms, opacity 700ms cubic-bezier(0.32,0.72,0,1) 400ms`,
                transform: isOpen ? 'translateY(0)' : 'translateY(48px)',
                opacity: isOpen ? 1 : 0
              }}
          >
             <Link href="/login" onClick={() => setIsOpen(false)}>
               <Button className="mt-8 rounded-full bg-white text-black hover:bg-white/90 px-8 py-6 text-lg font-medium pressable">
                  Get Started
                </Button>
             </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
