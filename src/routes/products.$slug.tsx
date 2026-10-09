import { createFileRoute, notFound } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/catalogue";
import { ProductDetail } from "@/components/zevrae/ProductDetail";
export const Route = createFileRoute("/products/$slug")({
 loader: ({ params }) => { const product = PRODUCTS.find(p => p.slug === params.slug); if (!product) throw notFound(); return product; },
 head: ({ loaderData }) => { const title = loaderData ? `${loaderData.name} — ZEVRAE B2B` : "Product Not Found — ZEVRAE"; const description = loaderData ? `${loaderData.description} Configure official sizes, fabrics, GSM and color preferences for a B2B inquiry.` : "This ZEVRAE product could not be found."; const image = loaderData?.images.find(i => i.color === "Black")?.front; return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, ...(image?.startsWith("https://") ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : [])] }; },
 component: ProductPage,
});
function ProductPage() { const product = Route.useLoaderData(); return <ProductDetail key={product.slug} product={product} />; }