import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { HeroSlide } from "@/sanity.types";

const builder = imageUrlBuilder(client);

interface HeroBackgroundProps {
  slide: HeroSlide;
}

export function HeroBackground({ slide }: HeroBackgroundProps) {
  const imageUrl = slide.image
    ? builder.image(slide.image).width(1920).format("webp").quality(85).url()
    : "";

  // Local variable — NOT slide.bgColor
  const bgColor = slide.accentColor ? `${slide.accentColor}18` : "#f8f8f8";

  return (
    <div className="absolute inset-0" style={{ backgroundColor: bgColor }}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={slide.image?.alt || ""}
          className="absolute right-0 top-0 h-full w-3/5 object-cover object-left"
          draggable={false}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${bgColor} 30%, ${bgColor}cc 55%, transparent 75%)`,
        }}
      />
    </div>
  );
}
