import { HeroSlide } from "@/sanity.types";
import clsx from "clsx";

interface PaginationDotsProps {
  slides: HeroSlide[];
  current: number;
  onGoTo: (index: number) => void;
  accentColor: string;
}

export function PaginationDots({ slides, current, onGoTo, accentColor }: PaginationDotsProps) {
  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Slide navigation">
      {slides.map((s, i) => (
        <button
          key={s._id || i}
          role="tab"
          aria-selected={i === current}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onGoTo(i)}
          className={clsx(
            "rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            i === current ? "w-6 h-2.5" : "w-2.5 h-2.5 hover:opacity-80"
          )}
          style={{
            backgroundColor: i === current ? accentColor : "rgba(0,0,0,0.18)",
            outlineColor: accentColor,
          }}
        />
      ))}
    </div>
  );
}
