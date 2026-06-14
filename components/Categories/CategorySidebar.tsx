"use client";
import { useState, useEffect } from "react";
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
  basePath?: string;
}

export default function CategorySidebar({
  categories,
  activeSlug,
  counts = {},
  basePath = "/category",
}: Props) {
  const mainCategories = categories.filter((cat) => !cat.parent);
  const subCategories  = categories.filter((cat) =>  cat.parent);

  const getActiveParentId = () =>
    subCategories.find((sub) => sub.slug.current === activeSlug)?.parent?._id;

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const parentId = getActiveParentId();
    return parentId ? { [parentId]: true } : {};
  });

  // Re-expand the correct parent whenever activeSlug changes (navigation)
  useEffect(() => {
    const parentId = getActiveParentId();
    if (parentId) {
      setExpanded((prev) => ({ ...prev, [parentId]: true }));
    }
  }, [activeSlug]);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
   <div className="border rounded-2xl p-6 bg-white shadow-sm">
      <h2 className="font-semibold text-xl mb-5">All Categories</h2>

      <div className="space-y-0.5">
        {mainCategories.map((cat) => {
          const children   = subCategories.filter((sub) => sub.parent?._id === cat._id);
          const isActive   = cat.slug.current === activeSlug;
          const isExpanded = expanded[cat._id] ?? false;
          const count      = counts[cat._id];

          return (
            <div key={cat._id}>
              <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl
                            text-sm transition-all
                            ${isActive
                              ? "text-orange-500 font-semibold bg-orange-50"
                              : "text-gray-800 font-medium hover:bg-gray-50"}`}
              >
                <Link
                  href={`${basePath}/${cat.slug.current}`}
                  className="flex items-center gap-1.5 flex-1"
                >
                  {cat.label}
                  {count !== undefined && (
                    <span className={`text-xs ${isActive ? "text-orange-400" : "text-gray-400"}`}>
                      ({count})
                    </span>
                  )}
                </Link>

                {children.length > 0 && (
                  <button
                    onClick={() => toggleExpand(cat._id)}
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    className="text-gray-400 shrink-0 p-1 hover:text-gray-600"
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                )}
              </div>

              {children.length > 0 && isExpanded && (
                <div className="ml-3 mt-0.5 mb-1 space-y-0.5 border-l border-gray-100 pl-3">
                  {children.map((sub) => {
                    const isSubActive = sub.slug.current === activeSlug;
                    const subCount    = counts[sub._id];

                    return (
                      <Link
                        key={sub._id}
                        href={`${basePath}/${sub.slug.current}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg
                                    text-sm transition-all
                                    ${isSubActive
                                      ? "text-orange-500 font-medium bg-orange-50"
                                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
                      >
                        <span>{sub.label}</span>
                        {subCount !== undefined && (
                          <span className={`text-xs ${isSubActive ? "text-orange-400" : "text-gray-400"}`}>
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