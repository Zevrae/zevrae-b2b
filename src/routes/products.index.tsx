import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Catalogue } from "@/components/zevrae/Catalogue";
import { Footer } from "@/components/zevrae/Sections";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Product Catalogue — ZEVRAE B2B" },
      {
        name: "description",
        content:
          "Explore official ZEVRAE T-Shirts, Oversize T-Shirts, Polo T-Shirts and Hoodies with configurable B2B specifications.",
      },
      { property: "og:title", content: "Product Catalogue — ZEVRAE B2B" },
      {
        property: "og:description",
        content: "Four apparel categories. Official fabrics, sizes, GSM and color references.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    }
  };

  return (
    <main>
      <header className="flex items-center justify-between border-b px-4 py-4 sm:px-6 sm:py-6 md:px-16">
        <Link to="/" className="font-expanded text-xl sm:text-2xl">
          Zevrae
        </Link>
        <Button variant="industrial-ghost" size="sm" asChild>
          <Link
            to="/"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            Back to Home
          </Link>
        </Button>
      </header>
      <Catalogue />
      <Footer />
    </main>
  );
}
