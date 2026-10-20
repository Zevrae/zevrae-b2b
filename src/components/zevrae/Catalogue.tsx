import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COLORS, FABRICS, GSM, PRODUCTS, SIZES, filterProducts, type Filters } from "@/lib/catalogue";

const INITIAL: Filters = { category: "", fabric: "", gsm: "", size: "", color: "" };
export function Catalogue() {
 const [filters, setFilters] = useState<Filters>(INITIAL);
 const products = filterProducts(filters);
 const options = { category: PRODUCTS.map(p => p.category), fabric: FABRICS, gsm: GSM, size: SIZES, color: [...COLORS, "Custom"] };
 return <section id="products" className="bg-background px-6 py-24 md:px-16 md:py-32">
  <div className="flex flex-wrap items-end justify-between gap-5 pb-10"><h2 className="font-expanded text-5xl md:text-7xl">Catalogue</h2><p className="tech text-muted-foreground">Products / 04</p></div>
  <div className="grid gap-4 border-y py-6 sm:grid-cols-2 lg:grid-cols-5">{(Object.keys(options) as (keyof Filters)[]).map(key => <label key={key} className="min-w-0"><span className="tech mb-2 block">{key === "size" ? "Available sizes" : key}</span><select aria-label={`Filter ${key}`} className="catalogue-select" value={filters[key]} onChange={e => setFilters({ ...filters, [key]: e.target.value })}><option value="">All {key === "category" ? "products" : key === "size" ? "sizes" : key === "color" ? "colors" : key === "fabric" ? "fabrics" : "GSM"}</option>{options[key].map(o => <option key={o}>{o}</option>)}</select></label>)}</div>
  <div className="my-6 flex items-center justify-between"><p role="status" className="tech text-muted-foreground">{products.length} / 04 products</p><Button variant="ghost" aria-label="Reset filters" onClick={() => setFilters(INITIAL)} title="Reset filters"><RotateCcw />Reset</Button></div>
  <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">{products.map(p => { const image = p.slug === "polo-t-shirts" ? (p.images.find(i => i.color === "White") ?? p.images[0]) : (p.images.find(i => i.color === "Black") ?? p.images[0]); return <article key={p.slug} className="min-w-0"><Link to="/products/$slug" params={{ slug: p.slug }} className="group block"><div className="product-photo aspect-[4/5] overflow-hidden"><img src={image?.front} alt={`${p.name} — front view, ${image?.color}`} loading="lazy" className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105 md:p-12" /></div><div className="mt-6 flex items-start justify-between gap-4"><div><p className="tech text-muted-foreground">Product / {String(PRODUCTS.indexOf(p) + 1).padStart(3, "0")}</p><h3 className="font-expanded mt-3 text-3xl md:text-4xl">{p.name}</h3></div><ArrowUpRight className="mt-6 size-6 shrink-0" /></div></Link><p className="mt-4 text-muted-foreground">{p.description}</p><Button asChild variant="industrial-ghost" className="mt-6"><Link to="/products/$slug" params={{ slug: p.slug }}>Configure / Request a quote</Link></Button></article>; })}</div>
  {products.length === 0 && <p className="py-20 text-center text-muted-foreground">No products match these requirements.</p>}
 </section>;
}