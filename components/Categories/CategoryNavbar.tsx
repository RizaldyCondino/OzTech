// components/CategoryNav.tsx
"use client";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UnderlineLink from "../UnderlineLink";
import { CATEGORIES } from "@/constants/data";

export default function CategoryNav() {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const isAllCategory = pathname.startsWith("/category/all");

  useEffect(() => {
    if (isAllCategory) return;
    const handleScroll = () => setIsSticky(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAllCategory]);

  if (isAllCategory) return null;

  return (
    <div
      className={`hidden md:block px-5 py-3 transition-colors duration-300 ${
        isSticky
          ? "sticky top-0 z-50 bg-[#303655] shadow-md"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map(({ label, href }) => (
          <UnderlineLink
            key={label}
            href={href}
            active={pathname === href}
            className={`text-sm transition-colors whitespace-nowrap px-3 py-1 ${
              isSticky
                ? "text-white/80 hover:text-white"
                : "text-gray-700 hover:text-[#303655]"
            }`}
            underlineClassName={`h-0.5 ${isSticky ? "bg-white" : "bg-[#303655]"}`}
          >
            {label}
          </UnderlineLink>
        ))}

        <Separator
          orientation="vertical"
          className={`h-5 mt-1 mx-2 shrink-0 ${isSticky ? "bg-white/20" : ""}`}
        />

        <Button
          variant="ghost"
          className={`cursor-pointer font-semibold text-sm gap-1.5 px-2 whitespace-nowrap ${
            isSticky
              ? "text-orange-300 hover:bg-white/10 hover:text-orange-200"
              : "text-[#303655] hover:bg-orange-50"
          }`}
        >
          <Flame className="w-4 h-4" />
          HOT DEALS
        </Button>
      </div>
    </div>
  );
}