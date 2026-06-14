"use client";
import { ShoppingCart, Search, Flame, Heart, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import MobileSidebar from "./MobileSidebar";
import Logo from "./Logo";
import UnderlineLink from "./UnderlineLink";

import {
  TOP_BAR_LEFT,
  TOP_BAR_RIGHT,
  CURRENCIES,
  LANGUAGES,
} from "@/constants/data";

interface Category {
  _id: string;
  label: string;
  slug: { current: string };
  parent?: { _id: string; label: string; slug: { current: string } };
}

interface NavbarProps {
  categories?: Category[];
  counts?: Record<string, number>;
}

export default function Navbar({
  categories = [],
  counts = {},
}: NavbarProps) {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith("/category/")
    ? pathname.split("/category/")[1]?.split("/")[0]
    : "";
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount] = useState(1);

  return (
    <div className="w-full">
      {/* ── Top Bar — hidden on mobile ── */}
      <div className="hidden md:block bg-[#303655] text-white px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-6">
            {TOP_BAR_LEFT.map(({ icon: Icon, label, href }) => (
              <UnderlineLink
                key={label}
                href={href}
                active={pathname === href}
                className="text-white text-sm hover:opacity-80 transition-opacity"
                underlineClassName="h-px bg-white"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </UnderlineLink>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {TOP_BAR_RIGHT.map(({ icon: Icon, label, href }) => (
              <UnderlineLink
                key={label}
                href={href}
                active={pathname === href}
                className="text-white text-sm hover:opacity-80 transition-opacity"
                underlineClassName="h-px bg-white"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </UnderlineLink>
            ))}

            <Separator orientation="vertical" className="h-4 bg-white/40" />

            <Select defaultValue={CURRENCIES[0]}>
              <SelectTrigger className="bg-transparent border-none text-white text-sm h-auto p-0 shadow-none focus:ring-0 w-auto gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue={LANGUAGES[0]}>
              <SelectTrigger className="bg-transparent border-none text-white text-sm h-auto p-0 shadow-none focus:ring-0 w-auto gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className="bg-white px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3 md:gap-6">
          {/* Mobile: Hamburger + Drawer */}
          <div className="flex md:hidden shrink-0">
            <MobileSidebar
              categories={categories}
              activeSlug={activeSlug}
              counts={counts}
            />
          </div>

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* Search bar — visible on md+ */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <Input
              type="text"
              placeholder="Search products..."
              className="pr-10 shadow-xs border-xs h-10 rounded-lg"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#303655]" />
            </Button>
          </div>

          {/* Push right on mobile */}
          <div className="flex-1 md:hidden" />

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-5 shrink-0">
            {/* Mobile search toggle */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <Search className="w-5 h-5 text-gray-700" />
              </Button>
            </div>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#303655]">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#303655]">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Auth */}
            <div className="flex items-center gap-2">
              <Show when="signed-out">
                {/* Mobile: plain text link */}
                <SignInButton mode="modal">
                  <button className="flex md:hidden text-sm text-gray-700 underline underline-offset-2 cursor-pointer">
                    Login
                  </button>
                </SignInButton>

                {/* Desktop: full buttons */}
                <SignInButton mode="modal">
                  <button className="hidden md:flex items-center justify-center h-10 px-5 text-sm font-normal text-white bg-[#303655] border-0 rounded-[0.4rem] cursor-pointer shadow-[0_0.5rem_1rem_rgba(143,142,142,0.15)] hover:bg-[#303655]/80 transition-colors">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="hidden md:flex items-center justify-center h-10 px-5 text-sm font-normal text-white bg-[#303655] border-0 rounded-[0.4rem] cursor-pointer shadow-[0_0.5rem_1rem_rgba(143,142,142,0.15)] hover:bg-[#303655]/80 transition-colors">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>

              <div className="px-2">
                <Show when="signed-in">
                  <UserButton
                    appearance={{ elements: { avatarBox: "h-9 w-9" } }}
                  />
                </Show>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile expandable search bar */}
        {searchOpen && (
          <div className="md:hidden mt-3 relative">
            <Input
              type="text"
              placeholder="Search products..."
              className="pr-10 h-10 rounded-lg w-full"
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
              onClick={() => setSearchOpen(false)}
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Category Nav — desktop only ── */}
      {/* Add your CategoryNav here if needed */}
    </div>
  );
}