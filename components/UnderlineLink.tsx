"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface UnderlineLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  underlineClassName?: string;
  active?: boolean;           // You can still pass active manually
}

export default function UnderlineLink({
  href,
  children,
  className = "",
  underlineClassName = "",
  active = false,
}: UnderlineLinkProps) {
  const [hovered, setHovered] = useState(false);
  const [isActive, setIsActive] = useState(active);

  // Auto-detect active state based on current hash (for # links)
  useEffect(() => {
    const checkActive = () => {
      if (href.startsWith("#")) {
        const currentHash = window.location.hash || "#";
        setIsActive(currentHash === href);
      } else {
        // For normal links, you can compare with window.location.pathname
        setIsActive(window.location.pathname === href);
      }
    };

    checkActive();
    window.addEventListener("hashchange", checkActive);
    
    return () => window.removeEventListener("hashchange", checkActive);
  }, [href]);

  const showUnderline = hovered || isActive;

  const handleClick = () => {
    // Force active state immediately on click
    if (href.startsWith("#")) {
      setIsActive(true);
    }
  };

  return (
    <a
      href={href}
      className={`relative inline-flex items-center gap-2 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {showUnderline && (
          <motion.div
            className={`absolute -bottom-0.5 left-0 right-0 h-[2px] bg-current ${underlineClassName}`}
            initial={{ scaleX: isActive ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ originX: 0.5 }}
          />
        )}
      </AnimatePresence>
    </a>
  );
}