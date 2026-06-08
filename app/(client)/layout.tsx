import CategoryNav from "@/components/CategoryNavbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Navbar />
        <CategoryNav />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer/>
    </ClerkProvider>
  );
}