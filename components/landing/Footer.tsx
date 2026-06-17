import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative bg-[#050505] text-white border-t border-white/5 overflow-hidden">
      {/* Ambient CTA Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-0 w-[800px] h-[600px] bg-[#7B52B9]/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 container max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Massive CTA Section */}
        <div className="py-32 md:py-48 flex flex-col items-center text-center">
          <h2 className="font-heading font-medium text-[clamp(2.5rem,8vw,6.5rem)] leading-[1.05] tracking-tight text-white max-w-5xl mb-12 break-words">
            Ready to master the physics of <span className="text-transparent bg-clip-text bg-gradient-to-r from-apollo-light to-white">manufacturing.</span>
          </h2>
          
          <Link href="/login" className="w-full sm:w-auto flex justify-center">
            <Button className="group rounded-full bg-white text-black hover:text-white p-0 text-lg pressable relative overflow-hidden h-14 w-[calc(100vw-2rem)] max-w-[280px] sm:w-64 border-0 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] transition-shadow duration-700">
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
        </div>

        {/* Minimal Bottom Strip */}
        <div className="border-t border-white/10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-[#050505] flex items-center justify-center font-bold text-xl shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]">
              A
            </div>
            <span className="font-heading font-medium text-lg tracking-tight text-white/90">Apollo Learn</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs font-light text-white/40">
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-white transition-colors">Help Center</Link>
              <Link href="#" className="hover:text-white transition-colors">IT Portal</Link>
            </div>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/20" />
            <p>
              © {new Date().getFullYear()} Apollo Tyres Ltd. All rights reserved. For internal use only.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
