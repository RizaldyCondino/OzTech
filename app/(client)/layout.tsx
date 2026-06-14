import CategoryNav from "@/components/Categories/CategoryNavbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { client } from "@/sanity/lib/client";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await client.fetch(`
    *[_type == "category"]{
      _id,
      label,
      slug,
      parent->{_id, label, slug}
    }
  `);

  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        elements: {
          footer: "hidden",
          developmentModeNotice: "hidden",
        },
      }}
      unsafe_disableDevelopmentModeConsoleWarning={true}
    >
      <div className="min-h-screen flex flex-col">
        <Navbar categories={categories} />
        <CategoryNav categories={categories} />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer/>
    </ClerkProvider>
  );
}