"use client";

import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export function ScrollGlowPath() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 });
  const clipHeight = useTransform(smoothProgress, [0, 1], [5, 100]);
  const clipPath = useMotionTemplate`polygon(0 0, 100% 0, 100% ${clipHeight}%, 0 ${clipHeight}%)`;

  const bezierPath = "M 50 0 C 50 10, 85 15, 85 28 C 85 40, 15 45, 15 65 C 15 80, 85 80, 85 92 C 85 98, 50 96, 50 100";

  return (
    <div className="absolute inset-x-0 top-0 h-full w-full max-w-[1400px] mx-auto pointer-events-none z-0 overflow-visible mix-blend-screen opacity-100">
      <motion.div style={{ clipPath }} className="w-full h-full absolute inset-0">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="circuitGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B52B9" stopOpacity="0" />
              <stop offset="15%" stopColor="#93C5FD" />
              <stop offset="50%" stopColor="#7B52B9" />
              <stop offset="85%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#58358F" stopOpacity="0" />
            </linearGradient>
            
            <filter id="glow-heavy" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
            <filter id="glow-medium" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="glow-light" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>

          {/* Heavy spread glow */}
          <motion.path
            d={bezierPath}
            stroke="url(#circuitGlow)"
            strokeWidth="20"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            filter="url(#glow-heavy)"
            opacity="0.3"
          />

          {/* Medium blur glow */}
          <motion.path
            d={bezierPath}
            stroke="url(#circuitGlow)"
            strokeWidth="8"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            filter="url(#glow-medium)"
            opacity="0.6"
          />

          {/* Light blur core */}
          <motion.path
            d={bezierPath}
            stroke="url(#circuitGlow)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            filter="url(#glow-light)"
            opacity="0.8"
          />
          
          {/* Intense solid inner core */}
          <motion.path
            d={bezierPath}
            stroke="#ffffff"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      </motion.div>
    </div>
  );
}
