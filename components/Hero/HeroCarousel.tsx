"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { PaginationDots } from "./PaginationDots";
import { HeroSlide } from "@/sanity.types";

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayMs?: number;
}

const PEEK_MD = 48;
const PEEK_LG = 72;
const GAP = 16;
const MAX_WIDTH = 1440;

function getPeek() {
  if (typeof window === "undefined") return PEEK_LG;
  if (window.innerWidth < 640) return 0;
  if (window.innerWidth < 1024) return PEEK_MD;
  return PEEK_LG;
}

function isSmallScreen() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 640;
}

export default function HeroCarousel({
  slides,
  autoPlayMs = 6000,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [small, setSmall] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const peekRef = useRef(PEEK_LG);

  const activeSlides = slides.filter((s) => s.active ?? true);
  const count = activeSlides.length;

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current) return;
      peekRef.current = getPeek();
      const sm = isSmallScreen();
      setSmall(sm);

      setCardWidth(
        sm
          ? viewportRef.current.offsetWidth
          : viewportRef.current.offsetWidth - peekRef.current * 2
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current || idx < 0 || idx >= count) return;
      setCurrent(idx);
    },
    [current, count]
  );

  const next = useCallback(() => setCurrent((p) => (p + 1) % count), [count]);
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + count) % count),
    [count]
  );

  useEffect(() => {
    if (isHovering || count <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(next, autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovering, next, autoPlayMs, count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = activeSlides[current];
  if (!slide) return null;

  const peek = peekRef.current;
  const translateX = cardWidth
    ? small
      ? -current * (cardWidth + GAP)
      : peek - current * (cardWidth + GAP)
    : peek;

  return (
    <div className="w-full py-6"> {/* Full width container, kept vertical padding */}
      <div
        className="mx-auto flex flex-col items-center gap-5"
        style={{ maxWidth: MAX_WIDTH }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const delta = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 50) {
            delta > 0 ? next() : prev();
          }
        }}
      >
        <div ref={viewportRef} className="w-full overflow-hidden">
          <motion.div
            className="flex"
            style={{ gap: GAP }}
            animate={{ x: translateX }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
          >
            {activeSlides.map((s, i) => {
              const isActive = i === current;

              return (
                <motion.div
                  key={s._id || `slide-${i}`}
                  className="flex-shrink-0"
                  style={{
                    width: cardWidth ? `${cardWidth}px` : "100%",
                  }}
                  onClick={() => !isActive && !small && goTo(i)}
                  whileHover={{ scale: isActive || small ? 1 : 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={[
                      "relative overflow-hidden rounded-2xl select-none",
                      isActive
                        ? "shadow-xl opacity-100"
                        : small
                        ? "opacity-0 pointer-events-none"
                        : "shadow-sm opacity-60 cursor-pointer",
                    ].join(" ")}
                    style={{
                      aspectRatio: "16/7",   // ← This controls the height
                      width: "100%",
                      minHeight: 200,
                      maxHeight: 520,        // ← Important: prevents it from going too tall
                    }}
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : small ? 1 : 0.97,
                      opacity: isActive ? 1 : small ? 0 : 0.6,
                    }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    aria-hidden={!isActive}
                  >
                    <HeroBackground slide={s} />
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          key={`content-${s._id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          <HeroContent slide={s} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <PaginationDots
          slides={activeSlides}
          current={current}
          onGoTo={goTo}
          accentColor={slide.accentColor ?? "#f97316"}
        />
      </div>
    </div>
  );
}