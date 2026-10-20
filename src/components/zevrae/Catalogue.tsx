import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COLORS, FABRICS, GSM, PRODUCTS, SIZES, filterProducts, type Filters } from "@/lib/catalogue";
import CardSwap, { Card } from "@/components/cardswap";

const INITIAL: Filters = { category: "", fabric: "", gsm: "", size: "", color: "" };

export function Catalogue() {
  const [filters, setFilters] = useState<Filters>(INITIAL);
  const products = filterProducts(filters);
  const options = { category: PRODUCTS.map(p => p.category), fabric: FABRICS, gsm: GSM, size: SIZES, color: [...COLORS, "Custom"] };

  return (
    <section id="products" className="bg-background px-6 py-24 md:px-16 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-5 pb-10">
        <h2 className="font-expanded text-5xl md:text-7xl">Catalogue</h2>
        <p className="tech text-muted-foreground">Products / 04</p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 border-y py-6 sm:grid-cols-2 lg:grid-cols-5">
        {(Object.keys(options) as (keyof Filters)[]).map(key => (
          <label key={key} className="min-w-0">
            <span className="tech mb-2 block">{key === "size" ? "Available sizes" : key}</span>
            <select
              aria-label={`Filter ${key}`}
              className="catalogue-select"
              value={filters[key]}
              onChange={e => setFilters({ ...filters, [key]: e.target.value })}
            >
              <option value="">
                All {key === "category" ? "products" : key === "size" ? "sizes" : key === "color" ? "colors" : key === "fabric" ? "fabrics" : "GSM"}
              </option>
              {options[key].map(o => <option key={o}>{o}</option>)}
            </select>
          </label>
        ))}
      </div>

      {/* Results count + reset */}
      <div className="my-6 flex items-center justify-between">
        <p role="status" className="tech text-muted-foreground">{products.length} / 04 products</p>
        <Button variant="ghost" aria-label="Reset filters" onClick={() => setFilters(INITIAL)} title="Reset filters">
          <RotateCcw />Reset
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">No products match these requirements.</p>
      ) : (
        <div style={{ height: 560 }}>
          <CardSwap
            cardDistance={55}
            verticalDistance={65}
            depth={80}
            skewAmount={5}
            visibleCards={Math.min(products.length, 4)}
            delay={5000}
            speed={0.45}
            bounce={0.2}
            parallax={0.4}
            hoverSpread={0.1}
            dim={0.55}
            cardRadius={16}
            autoplay
            pauseOnHover
            draggable
          >
            {products.map((p) => {
              const image =
                p.slug === "polo-t-shirts"
                  ? (p.images.find(i => i.color === "White") ?? p.images[0])
                  : (p.images.find(i => i.color === "Black") ?? p.images[0]);
              const num = String(PRODUCTS.indexOf(p) + 1).padStart(3, "0");
              return (
                <Card key={p.slug}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="group flex h-full w-full flex-col overflow-hidden"
                  >
                    {/* Image area */}
                    <div className="relative flex-1 overflow-hidden bg-background">
                      <img
                        src={image?.front}
                        alt={`${p.name} — front view, ${image?.color}`}
                        draggable={false}
                        className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
                      <div className="min-w-0">
                        <p className="tech text-xs opacity-50">Product / {num}</p>
                        <h3 className="font-expanded mt-1 truncate text-lg leading-tight">{p.name}</h3>
                      </div>
                      <ArrowUpRight className="size-4 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                </Card>
              );
            })}
          </CardSwap>
        </div>
      )}
    </section>
  );
}