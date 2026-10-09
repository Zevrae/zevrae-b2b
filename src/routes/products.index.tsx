import { createFileRoute, Link } from "@tanstack/react-router";
import { Catalogue } from "@/components/zevrae/Catalogue";
import { Footer } from "@/components/zevrae/Sections";
export const Route = createFileRoute("/products/")({
 head: () => ({ meta: [{ title: "Product Catalogue — ZEVRAE B2B" }, { name: "description", content: "Explore official ZEVRAE T-Shirts, Oversize T-Shirts, Polo T-Shirts and Hoodies with configurable B2B specifications." }, { property: "og:title", content: "Product Catalogue — ZEVRAE B2B" }, { property: "og:description", content: "Four apparel categories. Official fabrics, sizes, GSM and color references." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: ProductsPage,
});
function ProductsPage() { return <main><header className="border-b px-6 py-6 md:px-16"><Link to="/" className="font-expanded text-2xl">Zevrae</Link></header><Catalogue /><Footer /></main>; }