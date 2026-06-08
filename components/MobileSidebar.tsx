"use client";
import { Search, Flame, X, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TOP_BAR_LEFT, CATEGORIES, CURRENCIES, LANGUAGES } from "@/constants/data";
import Logo from "./Logo";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="w-5 h-5 text-gray-700" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        {/* Drawer Header with Title */}
        <SheetHeader className="bg-[#303655] text-white px-5 py-4 border-b">
          <div className="flex items-center justify-between w-full">
            <SheetTitle className="text-white text-lg font-semibold">
              <Logo className="text-white" />
            </SheetTitle>
            <SheetClose asChild>
              <button aria-label="Close">
                <X className="w-5 h-5 cursor-pointer text-white/80 hover:text-white" />
              </button>
            </SheetClose>
          </div>
        </SheetHeader>

        {/* Drawer Search */}
        <div className="px-4 py-3 border-b">
          <div className="relative">
            <Input
              placeholder="Search products..."
              className="pr-9 h-9 text-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#303655]" />
          </div>
        </div>

        {/* Categories */}
        <nav className="flex-1 overflow-y-auto py-2">
          <p className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Categories
          </p>

          {CATEGORIES.map(({ label, href }) => (
            <SheetClose asChild key={label}>
              <a
                href={href}
                className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#303655] hover:font-semibold transition-all w-full"
              >
                {label}
              </a>
            </SheetClose>
          ))}

          <Separator className="my-2" />

          <SheetClose asChild>
            <a
              href="#deals"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#303655] hover:bg-orange-50 transition-colors w-full"
            >
              <Flame className="w-4 h-4" />
              HOT DEALS
            </a>
          </SheetClose>
        </nav>

        {/* Drawer Footer */}
        <div className="border-t px-4 py-4 space-y-3">
          {TOP_BAR_LEFT.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#303655] hover:font-medium transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </a>
          ))}

          <div className="flex gap-2 pt-1">
            <Button size="default" className="flex-1 h-9 bg-[#303655] hover:bg-[#303655]/80 text-white text-xs">
              Login
            </Button>
            <Button size="default" className="flex-1 h-9 bg-[#303655] hover:bg-[#303655]/80 text-white text-xs">
              Sign up
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Select defaultValue={CURRENCIES[0]}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue={LANGUAGES[0]}>
              <SelectTrigger className="h-8 text-xs w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}