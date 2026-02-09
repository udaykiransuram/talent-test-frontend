"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Hero 3D Component ---
export const Hero3D = () => {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Force video playback on mount to bypass some browser autoplay restrictions
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div 
      ref={ref} 
      className="relative h-[80vh] sm:h-[90vh] md:h-screen w-full overflow-hidden bg-[#050505] flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-classroom.jpg"
          className="h-full w-full object-cover scale-105"
          style={{ filter: "brightness(0.9)", objectFit: "cover", objectPosition: "center 20%" }}
          onError={(e) => console.error("Video load error:", e)}
        >
          {/* HD video of a student thinking deep thought - clean background for text */}
          <source src="https://videos.pexels.com/video-files/8499774/8499774-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        
        {/* Gradients - Left focused to make text pop while keeping student visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
        
        {/* Cinematic Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <motion.div 
        style={{ y: textY, opacity }}
        className="relative z-10 flex flex-col items-center md:items-start px-5 sm:px-8 md:px-16 text-center md:text-left max-w-7xl mx-auto py-8 sm:py-12 md:py-14 w-full"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-md mb-8 shadow-xl shadow-black/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          Next-Gen Education Intelligence
        </motion.div>
        
        <h1 className="text-[2.25rem] sm:text-5xl md:text-7xl lg:text-8xl leading-tight font-bold tracking-tight text-white mb-6 sm:mb-8 drop-shadow-2xl">
          <motion.span 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="block"
          >
            Unlock
          </motion.span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 relative">
            Potential
            <motion.svg 
              className="absolute -bottom-2 left-0 w-full h-3 text-emerald-500" 
              viewBox="0 0 100 10" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
            >
              <motion.path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </motion.svg>
          </span>
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-slate-200 text-sm sm:text-lg md:text-xl max-w-xl leading-relaxed mb-10 sm:mb-14 font-light drop-shadow-md"
        >
          See what grades miss. We diagnose the <span className="text-white font-semibold">hidden patterns</span> in student thinking to bridge the gap between effort and outcome.
        </motion.p>
        
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className="flex flex-col sm:flex-row gap-5"
        >
           <ButtonShiny text="Start Baseline Test" href="/talent-test" primary />
           <ButtonShiny text="View Demo" href="/contact" />
        </motion.div>
      </motion.div>
    </div>
  );
};


// --- Shiny 3D Button ---
const ButtonShiny = ({ text, href, primary = false }: { text: string; href: string, primary?: boolean }) => {
  return (
    <Link 
      href={href}
      className={cn(
        "group relative rounded-full px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95",
        primary 
          ? "bg-slate-100 text-slate-950 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]" 
          : "bg-slate-900 text-white border border-slate-700 hover:bg-slate-800"
      )}
    >
      <span className="relative z-10">{text}</span>
      {primary && (
         <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-500 group-hover:opacity-10 blur-xl" />
      )}
    </Link>
  );
};


// --- 3D Tilt Card ---
export const FeatureCard3D = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isCoarse, setIsCoarse] = useState(false);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });
  // Always create transforms (avoid conditional hook usage)
  const rotateYMV = useTransform(mouseX, [-200, 200], [-10, 10]);
  const rotateXMV = useTransform(mouseY, [-200, 200], [10, -10]);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const apply = () => setIsCoarse(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (isCoarse) return; // disable tilt on touch devices
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    if (isCoarse) return;
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateY: isCoarse ? 0 : rotateYMV,
        rotateX: isCoarse ? 0 : rotateXMV,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-full w-full rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden"
    >
      <div className="h-1 bg-teal-500"></div>
      <div style={{ transform: "translateZ(50px)" }} className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 text-3xl shadow-sm ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/10">
        {icon}
      </div>
      <h3 style={{ transform: "translateZ(40px)" }} className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p style={{ transform: "translateZ(30px)" }} className="text-slate-600 leading-relaxed dark:text-slate-400">
        {description}
      </p>
      
      {/* Glow Effect */}
      <motion.div
        style={{
          background: useMotionTemplate`radial-gradient(
            400px circle at ${mouseX}px ${mouseY}px,
            rgba(50, 200, 160, 0.1),
            transparent 80%
          )`,
        }}
        className={cn(
          "pointer-events-none absolute -inset-px rounded-2xl transition duration-300",
          isCoarse ? "opacity-0" : "opacity-0 group-hover:opacity-100"
        )}
      />
    </motion.div>
  );
};
