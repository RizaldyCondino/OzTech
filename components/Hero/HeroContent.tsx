"use client";

import { motion } from "framer-motion";
import { HeroSlide } from "@/sanity.types";

interface HeroContentProps {
  slide: HeroSlide;
}

export function HeroContent({ slide }: HeroContentProps) {
  const accentColor = slide.accentColor || "#f97316";

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center lg:items-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="w-full px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20">
        <motion.div
          className="w-full max-w-[min(22rem,55vw)] pointer-events-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {slide.categoryTag && (
            <motion.p
              className="font-semibold tracking-[0.2em] uppercase text-gray-400 mb-2"
              style={{ fontSize: "clamp(9px, 1.1vw, 11px)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {slide.categoryTag}
            </motion.p>
          )}

          <motion.h2
            className="text-gray-900 font-extrabold leading-[1.1] tracking-tight mb-3 sm:mb-4"
            style={{ fontSize: "clamp(1.25rem, 3.5vw + 0.25rem, 2.25rem)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
          >
            {slide.headline}
          </motion.h2>

          <motion.div
            className="mb-4 sm:mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p
              className="text-gray-400 mb-0.5"
              style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
            >
              {slide.subLabel || "Start from"}
            </p>
            {slide.startingPrice && (
              <motion.p
                className="font-extrabold tabular-nums"
                style={{
                  color: accentColor,
                  fontSize: "clamp(1.1rem, 2.5vw + 0.25rem, 1.75rem)",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.55 }}
              >
                ${slide.startingPrice}
              </motion.p>
            )}
          </motion.div>

          <motion.a
            href={slide.ctaHref || "#"}
            className="group inline-flex items-center gap-2 sm:gap-2.5 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-sm transition-colors duration-200 hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            style={{
              fontSize: "clamp(10px, 1.1vw, 12px)",
              padding: "clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.65 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {slide.ctaLabel || "Learn More"}
            <motion.svg
              className="transition-transform duration-200 group-hover:translate-x-0.5"
              style={{ width: "clamp(12px, 1.4vw, 14px)", height: "clamp(12px, 1.4vw, 14px)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
              initial={{ x: -4 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.95 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </motion.svg>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
}