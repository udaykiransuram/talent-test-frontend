"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LottieAnimation } from "./LottieAnimation";

interface InnerHeroProps {
  title: React.ReactNode;
  subtitle: string;
  pillText?: string;
  children?: React.ReactNode;
  /** Lottie animation floating on the right */
  lottieRight?: string;
  /** Lottie animation floating on the left */
  lottieLeft?: string;
}

export const InnerHero = ({ title, subtitle, pillText, children, lottieRight, lottieLeft }: InnerHeroProps) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="relative w-full bg-gradient-to-b from-teal-300 via-teal-250 to-teal-200 pt-16 pb-20 sm:pt-20 sm:pb-28 overflow-x-clip">
      {/* Abstract Shapes Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-[30%] -right-[10%] w-[700px] h-[700px] rounded-full bg-emerald-500/40 blur-[80px] mix-blend-multiply"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-teal-400/50 blur-[80px] mix-blend-multiply" 
        />
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Floating Lottie - Right */}
      {lottieRight && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="absolute right-[3%] xl:right-[5%] 2xl:right-[8%] top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center pointer-events-none z-[2]"
        >
          <motion.div
            animate={{ y: [-8, 12, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <LottieAnimation src={lottieRight} className="w-64 h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 opacity-75" />
          </motion.div>
        </motion.div>
      )}

      {/* Floating Lottie - Left */}
      {lottieLeft && (
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="absolute left-[3%] xl:left-[5%] 2xl:left-[8%] top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center pointer-events-none z-[2]"
        >
          <motion.div
            animate={{ y: [8, -10, 8] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <LottieAnimation src={lottieLeft} className="w-60 h-60 xl:w-72 xl:h-72 2xl:w-80 2xl:h-80 opacity-65" />
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {pillText && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center rounded-full border border-teal-200/60 bg-white/60 px-3 py-1 text-sm font-medium text-teal-700 backdrop-blur-sm shadow-sm"
            >
              <span className="flex h-2 w-2 mr-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              {pillText}
            </motion.div>
          )}
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-5xl font-semibold tracking-tight text-slate-900 sm:text-7xl"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg leading-8 text-slate-700 text-balance"
          >
            {subtitle}
          </motion.p>

          {children && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="mt-10 flex items-center justify-center gap-x-6"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Clean bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent"></div>
    </div>
  );
};
