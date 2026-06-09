// components/Categories/CategorySidebar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Category {
  _id: string;
  label: string;
  slug: { current: string };
  parent?: { _id: string; label: string; slug: { current: string } };
}

interface Props {
  categories: Category[];
  activeSlug: string;
  counts?: Record<string, number>;
}

export default function CategorySidebar({ categories, activeSlug, counts = {} }: Props) {
  const mainCategories = categories.filter(cat => !cat.parent);
  const subCategories = categories.filter(cat => cat.parent);

  // Auto-expand whichever parent contains the active slug
  const activeParentId = subCategories.find(
    sub => sub.slug.current === activeSlug
  )?.parent?._id;

  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    activeParentId ? { [activeParentId]: true } : {}
  );

  const toggleExpand = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="sticky top-24 border rounded-2xl p-6 bg-white shadow-sm">
      <h2 className="font-semibold text-xl mb-5">All Categories</h2>

      <div className="space-y-0.5">
        {mainCategories.map((cat) => {
          const children = subCategories.filter(sub => sub.parent?._id === cat._id);
          const isActive = cat.slug.current === activeSlug;
          const isExpanded = expanded[cat._id] ?? false;
          const count = counts[cat._id];

          return (
            <div key={cat._id}>
              {/* Main category row */}
              <button
                onClick={() => {
                  if (children.length > 0) {
                    toggleExpand(cat._id);
                  } else {
                    window.location.href = `/category/${cat.slug.current}`;
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                            text-sm transition-all text-left
                            ${isActive
                              ? 'text-orange-500 font-semibold'
                              : 'text-gray-800 font-medium hover:bg-gray-50'}`}
              >
                <span className="flex items-center gap-1.5">
                  {cat.label}
                  {count !== undefined && (
                    <span className={`text-xs ${isActive ? 'text-orange-400' : 'text-gray-400'}`}>
                      ({count})
                    </span>
                  )}
                </span>

                {children.length > 0 && (
                  <span className="text-gray-400 shrink-0">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </button>

              {/* Children */}
              {children.length > 0 && isExpanded && (
                <div className="ml-3 mt-0.5 mb-1 space-y-0.5 border-l border-gray-100 pl-3">
                  {children.map((sub) => {
                    const isSubActive = sub.slug.current === activeSlug;
                    const subCount = counts[sub._id];

                    return (
                      <Link
                        key={sub._id}
                        href={`/category/${sub.slug.current}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg
                                    text-sm transition-all
                                    ${isSubActive
                                      ? 'text-orange-500 font-medium'
                                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                      >
                        <span>{sub.label}</span>
                        {subCount !== undefined && (
                          <span className={`text-xs ${isSubActive ? 'text-orange-400' : 'text-gray-400'}`}>
                            {subCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}