import HeroCarousel from "@/components/Hero/HeroCarousel";
import { HeroSlide } from "@/sanity.types";
import { client } from "@/sanity/lib/client";


async function getHeroSlides() {
  try {
    const slides = await client.fetch<HeroSlide[]>(
      `*[_type == "heroSlide" && active == true] | order(order asc)`,
      {},
      { next: { revalidate: 60 } } // Optional: ISR caching
    );
    return slides;
  } catch (error) {
    console.error("Failed to fetch hero slides:", error);
    return [];
  }
}



export default async function Home() {
  const slides = await getHeroSlides();

  return (
    <div >
      <HeroCarousel 
        slides={slides} 
        autoPlayMs={6000} 
      />

      {/* Best Deals */}

      {/* Top Selected Products on the week */}

      {/* Popular Search */}

      {/* Delivery Icons  */}

      {/* Flash Sales */}

      {/* Hot Sales */}

      {/* Recently View */}

      {/* Brands */}
    </div>
  );
}