import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { emptyConfiguration, type Product } from "@/lib/catalogue";
import { ProductSelectors } from "./ProductSelectors";
import { QuoteFlow } from "./QuoteFlow";
import { Footer } from "./Sections";

export function ProductDetail({ product }: { product: Product }) {
 const [config, setConfig] = useState(() => emptyConfiguration(product.slug));
 const [side, setSide] = useState<"front" | "back">("front");
 const [open, setOpen] = useState(false);
 const image = product.images.find(i => i.color === config.color) ?? product.images.find(i => i.color === "Black") ?? product.images[0];
 return <main><header className="flex items-center justify-between border-b px-6 py-6 md:px-16"><Link to="/" className="font-expanded text-2xl">Zevrae</Link><Button variant="industrial-ghost" asChild><Link to="/products"><ArrowLeft />Catalogue</Link></Button></header>
  <div className="grid gap-12 px-6 py-12 md:grid-cols-2 md:px-16 md:py-20"><div className="min-w-0"><div className="product-photo aspect-[4/5]"><img src={image?.[side]} alt={`${product.name} — ${side} view, ${image?.color}`} className="h-full w-full object-contain p-6 md:p-12" /></div><div className="mt-4 flex gap-3">{(["front", "back"] as const).map(s => <Button key={s} variant={side === s ? "industrial" : "industrial-ghost"} aria-pressed={side === s} onClick={() => setSide(s)}>{s} view</Button>)}</div><p className="mt-4 text-sm text-muted-foreground">Official garment reference / {image?.color}{config.color && config.color !== image?.color ? " — requested color not pictured" : ""}</p></div>
  <div className="min-w-0"><p className="tech text-muted-foreground">Zevrae / Product specification</p><h1 className="font-expanded mt-5 break-words text-4xl md:text-6xl">{product.name}</h1><p className="mb-10 mt-6 text-lg text-muted-foreground">{product.description}</p><ProductSelectors product={product} value={config} onChange={setConfig} /><Button variant="industrial" size="xl" className="mt-10 w-full" onClick={() => setOpen(true)}>Request a quote</Button><p className="mt-4 text-sm text-muted-foreground">Pricing, quantities and production schedules confirmed on inquiry.</p></div></div>
  <Footer /><QuoteFlow open={open} onClose={() => setOpen(false)} initial={config} />
 </main>;
}