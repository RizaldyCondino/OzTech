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

export default function CategoryBanner({
  category,
}: CategoryBannerProps) {
  const imageUrl = category.image?.asset
    ? urlFor(category.image)
        .width(1400)
        .height(700)
        .fit('crop')
        .crop('center')
        .url()
    : null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative w-full bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col lg:flex-row min-h-[420px]">
        {/* Image + Content */}
        <div className="flex-1 relative">
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

          <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {category.label}
            </h1>
            {category.description && (
              <p className="mt-6 text-white/90 max-w-md text-lg leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}