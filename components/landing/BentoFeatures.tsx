"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, Users, PlayCircle } from "lucide-react";

export function BentoFeatures() {
  return (
    <section id="bento" className="py-32">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <motion.div 
          className="mb-20 max-w-2xl"
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1] }}
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 leading-tight">
            Everything you need to <br className="hidden md:block"/> master your craft.
          </h2>
          <p className="text-xl text-white/50 leading-relaxed font-light">
            A comprehensive suite of tools designed to elevate your technical skills. No generic courses, just targeted, interactive manufacturing training.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense relative z-10">
          {/* Large featured cell */}
          <motion.div 
            className="md:col-span-2 relative rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-sm group min-h-[420px] cursor-pointer transition-all duration-500 hover:border-white/20 hover:bg-[#0c0c0c] active:scale-[0.98]"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="p-8 md:p-12 z-10 relative md:w-1/2 flex flex-col justify-center h-full">
              <h3 className="text-3xl font-heading font-medium text-white mb-4">Interactive Modules</h3>
              <p className="text-white/50 text-lg leading-relaxed">
                Learn through hands-on simulations that mirror real-world manufacturing challenges. Step-by-step guidance.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-[85%] h-[60%] md:w-[60%] md:h-[85%] overflow-hidden">
                <img 
                  src="/images/bento-progress.png" 
                  alt="Interactive Progress UI" 
                  className="w-full h-full object-cover object-left-top rounded-tl-[2rem] border-t border-l border-white/10 opacity-80 transition-transform duration-1000 ease-[0.32,0.72,0,1] group-hover:scale-[1.03] group-hover:-translate-x-2 group-hover:-translate-y-2"
                />
            </div>
          </motion.div>

          {/* Small cell 1 */}
          <motion.div 
            className="rounded-3xl bg-apollo/10 text-white p-8 md:p-10 border border-apollo-light/30 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-500 hover:border-apollo-light/50 hover:bg-apollo/20 hover:-translate-y-1 active:scale-[0.98] group"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          >
            <div>
              <div className="w-14 h-14 bg-apollo/30 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 ease-[0.32,0.72,0,1] group-hover:scale-110">
                <Activity className="w-7 h-7 text-apollo-light" />
              </div>
              <h3 className="text-2xl font-heading font-medium mb-3 text-white">Skill Tracking</h3>
              <p className="text-white/60 leading-relaxed font-light">
                Monitor your progress across different competencies and identify areas for improvement.
              </p>
            </div>
          </motion.div>

          {/* Small cell 2 */}
          <motion.div 
            className="rounded-3xl bg-[#0A0A0A] p-8 md:p-10 border border-white/10 shadow-sm flex flex-col justify-between cursor-pointer group transition-all duration-500 hover:border-white/20 hover:bg-[#0c0c0c] hover:-translate-y-1 active:scale-[0.98]"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
          >
            <div>
              <h3 className="text-2xl font-heading font-medium text-white mb-3">Live Workshops</h3>
              <p className="text-white/50 leading-relaxed mb-8 font-light">
                Join expert-led sessions designed to tackle complex technical problems.
              </p>
            </div>
            <div className="w-full aspect-[2/1] bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden transition-colors duration-500 group-hover:bg-white/10">
               <div className="flex gap-2 items-center bg-white/10 backdrop-blur-md py-2.5 px-5 rounded-full shadow-sm border border-white/10 transition-transform duration-500 ease-[0.32,0.72,0,1] group-hover:scale-105 group-hover:bg-white/20">
                  <PlayCircle className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Watch Replay</span>
               </div>
            </div>
          </motion.div>

          {/* Medium cell */}
          <motion.div 
            className="md:col-span-2 rounded-3xl bg-[#0A0A0A] p-8 md:p-12 border border-white/10 shadow-sm flex flex-col md:flex-row gap-10 items-center cursor-pointer transition-all duration-500 hover:border-white/20 hover:bg-[#0c0c0c] active:scale-[0.98] group"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          >
             <div className="flex-1">
               <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 group-hover:bg-apollo/20">
                  <BarChart3 className="w-6 h-6 text-white/70 transition-colors duration-500 group-hover:text-apollo-light" />
               </div>
               <h3 className="text-2xl font-heading font-medium text-white mb-3">Enterprise Analytics</h3>
               <p className="text-white/50 leading-relaxed font-light text-lg">
                Gain insights into your team's learning patterns. Identify top performers and knowledge gaps with our comprehensive dashboards.
               </p>
             </div>
             <div className="w-full md:w-1/2 aspect-video bg-white/5 rounded-2xl border border-white/5 flex items-end justify-center p-6 gap-3 transition-colors duration-500 group-hover:bg-white/10 overflow-hidden relative">
                {/* Abstract animated bar chart */}
                {[40, 60, 30, 80, 100].map((height, i) => (
                  <motion.div 
                    key={i}
                    animate={{
                      height: [`${height}%`, `${Math.max(20, height - 20)}%`, `${height}%`]
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`w-10 rounded-t-md origin-bottom ${i === 4 ? 'bg-apollo-light' : 'bg-apollo-light/30'}`} 
                    style={{ height: `${height}%` }}
                  />
                ))}
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
