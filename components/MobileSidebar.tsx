"use client";
import { useState, useEffect } from "react";
import { Search, Flame, X, Menu, ChevronDown, ChevronRight } from "lucide-react";
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
import Link from "next/link";
import { TOP_BAR_LEFT, CURRENCIES, LANGUAGES } from "@/constants/data";
import Logo from "./Logo";

interface Category {
  _id: string;
  label: string;
  slug: { current: string };
  parent?: { _id: string; label: string; slug: { current: string } };
}

interface Props {
  categories?: Category[];
  activeSlug?: string;
  counts?: Record<string, number>;
  basePath?: string;
  /** Total product count shown next to "All Products" */
  totalCount?: number;
}

export default function MobileSidebar({
  categories = [],
  activeSlug = "",
  counts = {},
  basePath = "/category/all",
  totalCount,
}: Props) {
  const mainCategories = categories?.filter((cat) => !cat.parent) ?? [];
  const subCategories  = categories?.filter((cat) =>  cat.parent) ?? [];

  // "all-products" is a virtual slug — nothing in Sanity matches it
  const ALL_SLUG = "all-products";
  const isAllActive = activeSlug === ALL_SLUG || activeSlug === "";

  const getActiveParentId = () =>
    subCategories.find((sub) => sub.slug.current === activeSlug)?.parent?._id;

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const parentId = getActiveParentId();
    return parentId ? { [parentId]: true } : {};
  });

  useEffect(() => {
    const parentId = getActiveParentId();
    if (parentId) {
      setExpanded((prev) => ({ ...prev, [parentId]: true }));
    }
  }, [activeSlug]);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="w-5 h-5 text-gray-700" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        {/* Drawer Header */}
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

          {/* ── All Products ── */}
          <SheetClose asChild>
            <Link
              href={`${basePath}`}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-sm transition-all
                          ${isAllActive
                            ? "text-orange-500 font-semibold bg-orange-50"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#303655] hover:font-semibold"}`}
            >
              All Products
              {totalCount !== undefined && (
                <span className={`text-xs ${isAllActive ? "text-orange-400" : "text-gray-400"}`}>
                  ({totalCount})
                </span>
              )}
            </Link>
          </SheetClose>

          {/* ── Parent categories (with collapsible sub-categories) ── */}
          {mainCategories.map((cat) => {
            const children   = subCategories.filter((sub) => sub.parent?._id === cat._id);
            // Active when this parent slug matches, OR when any of its children is active
            const isActive   =
              cat.slug.current === activeSlug ||
              children.some((sub) => sub.slug.current === activeSlug);
            const isExpanded = expanded[cat._id] ?? false;
            const count      = counts[cat._id];

            return (
              <div key={cat._id}>
                <div className="flex items-center justify-between w-full">
                  <SheetClose asChild>
                    {/*
                      Banner always links to the PARENT category page.
                      Sub-category pages are only accessible from the expanded list below.
                    */}
                    <Link
                      href={`${basePath}/${cat.slug.current}`}
                      className={`flex-1 flex items-center gap-1.5 px-5 py-2.5 text-sm transition-all
                                  ${isActive
                                    ? "text-orange-500 font-semibold bg-orange-50"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-[#303655] hover:font-semibold"}`}
                    >
                      {cat.label}
                      {count !== undefined && (
                        <span className={`text-xs ${isActive ? "text-orange-400" : "text-gray-400"}`}>
                          ({count})
                        </span>
                      )}
                    </Link>
                  </SheetClose>

                  {children.length > 0 && (
                    <button
                      onClick={() => toggleExpand(cat._id)}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                      className="px-3 py-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  )}
                </div>

                {/* Sub-categories — visible only when expanded */}
                {children.length > 0 && isExpanded && (
                  <div className="ml-3 border-l border-gray-100">
                    {children.map((sub) => {
                      const isSubActive = sub.slug.current === activeSlug;
                      const subCount    = counts[sub._id];

                      return (
                        <SheetClose asChild key={sub._id}>
                          <Link
                            href={`${basePath}/${sub.slug.current}`}
                            className={`flex items-center justify-between px-7 py-2 text-sm transition-all
                                        ${isSubActive
                                          ? "text-orange-500 font-medium bg-orange-50"
                                          : "text-gray-500 hover:text-[#303655] hover:bg-gray-50"}`}
                          >
                            <span>{sub.label}</span>
                            {subCount !== undefined && (
                              <span className={`text-xs ${isSubActive ? "text-orange-400" : "text-gray-400"}`}>
                                {subCount}
                              </span>
                            )}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <Separator className="my-2" />

          <SheetClose asChild>
            <Link
              href="#deals"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#303655] hover:bg-orange-50 transition-colors w-full"
            >
              <Flame className="w-4 h-4" />
              HOT DEALS
            </Link>
          </SheetClose>
        </nav>

        {/* Drawer Footer */}
        <div className="border-t px-4 py-4 space-y-3">
          {TOP_BAR_LEFT.map(({ icon: Icon, label, href }) => (
            <SheetClose asChild key={label}>
              <Link
                href={href}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#303655] hover:font-medium transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </Link>
            </SheetClose>
          ))}

          <div className="flex items-center gap-3 pt-1">
            <Select defaultValue={CURRENCIES[0]}>
              <SelectTrigger className="h-8 text-xs flex-1">
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
              <SelectTrigger className="h-8 text-xs w-20">
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
      </SheetContent>
    </Sheet>
  );
}