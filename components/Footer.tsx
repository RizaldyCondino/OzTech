"use client"
// ─── Sub-components ────────────────────────────────────────
import { 
  QUICK_LINKS, 
  CUSTOMER_LINKS, 
  SOCIAL_LINKS, 
  PAYMENT_METHODS,
  Headphones 
} from "@/constants/data";

import { Separator } from "./ui/separator";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "./ui/tooltip";
import Logo from "./Logo";

function BrandColumn() {
  return (
    <div className="flex flex-col gap-5">
      {/* Logo */}
      <div className="flex items-center gap-1.5">
        <Logo/>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>

      {/* Socials */}
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <a
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}

function LinksColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-900">
        {title}
      </p>
      <ul className="flex flex-col gap-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactColumn() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-900">
        Contact
      </p>

      <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut
      </p>

      {/* Phone + Live Chat */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 shrink-0">
          <Headphones className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Have any question?</span>
          <span className="text-sm font-medium text-[#f97316]">
            + 123 456 789
          </span>
        </div>
        <a
          href="#chat"
          className="ml-auto text-xs font-semibold uppercase tracking-wider text-gray-800 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          Live Chat
        </a>
      </div>

      {/* App Store Buttons */}
      <div className="flex items-center gap-2 mt-1">
        <a
          href="#appstore"
          className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-3.5 py-2 hover:bg-gray-700 transition-colors"
        >
          {/* Apple icon */}
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-white/60">Download on the</span>
            <span className="text-sm font-medium">App Store</span>
          </div>
        </a>

        <a
          href="#googleplay"
          className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-3.5 py-2 hover:bg-gray-700 transition-colors"
        >
          {/* Google Play icon */}
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-white/60">Get it on</span>
            <span className="text-sm font-medium">Google Play</span>
          </div>
        </a>
      </div>
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.6fr]">
        <BrandColumn />
        <LinksColumn title="Quick Links" links={QUICK_LINKS} />
        <LinksColumn title="Customer Area" links={CUSTOMER_LINKS} />
        <ContactColumn />
      </div>

      <Separator />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-gray-400">
          OzTech · © 2020 All Rights Reserved
        </span>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>Payment</span>
          {PAYMENT_METHODS.map(({ label, color }) => (
            <span key={label} className="text-xs font-semibold" style={{ color }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}