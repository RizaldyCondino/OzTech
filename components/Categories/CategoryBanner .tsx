// components/CategoryBanner.tsx
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import CountdownTimer from './CountdownTimer';
import { Category } from '@/sanity.types';

interface CategoryBannerProps {
  category: Category;
  salePercentage?: number;
  countdownEndDate?: Date;
}

export default function CategoryBanner({ category }: CategoryBannerProps) {
  const imageUrl = category.image?.asset
    ? urlFor(category.image).width(1000).height(400).fit('crop').crop('center').url()
    : null;

  return (
    <div className="relative w-full bg-white rounded-2xl overflow-hidden shadow-sm min-h-[300px]">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={category.label || 'Category'}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
          {category.label}
        </h1>
        {category.description && (
          <p className="mt-2 text-white/90 max-w-md text-sm leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
}