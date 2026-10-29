import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COLORS,
  FABRICS,
  GSM,
  PRODUCTS,
  SIZES,
  filterProducts,
  type Filters,
} from "@/lib/catalogue";
import CardSwap, { Card } from "@/components/CardSwap";
import normalTshirtGroup from "@/assets/products/normal-tshirt-group-photo.webp";
import oversizedGroup from "@/assets/products/oversized-tshirt-group-photo.webp";
import poloGroup from "@/assets/products/polo-tshirt-group-photo.webp";
import hoodiesGroup from "@/assets/products/hoodies-group-photo.webp";

const PRODUCT_GROUP_IMAGES: Record<string, string> = {
  "t-shirts": normalTshirtGroup,
  "oversize-t-shirts": oversizedGroup,
  "polo-t-shirts": poloGroup,
  hoodies: hoodiesGroup,
};

const INITIAL: Filters = { category: "", fabric: "", gsm: "", size: "", color: "" };

export function Catalogue() {
  const [filters, setFilters] = useState<Filters>(INITIAL);
  const products = filterProducts(filters);
  const options = {
    category: PRODUCTS.map((p) => p.category),
    fabric: FABRICS,
    gsm: GSM,
    size: SIZES,
    color: [...COLORS, "Custom"],
  };

  return (
    <section id="products" className="bg-background px-4 py-16 sm:px-6 sm:py-24 md:px-16 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-8 sm:pb-10">
        <h2 className="font-expanded text-4xl sm:text-5xl md:text-7xl">Catalogue</h2>
        <p className="tech text-xs sm:text-sm text-muted-foreground">Products / 04</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 border-y py-5 sm:py-6">
        {(Object.keys(options) as (keyof Filters)[]).map((key) => (
          <label key={key} className="min-w-0">
            <span className="tech mb-1.5 sm:mb-2 block text-[11px] sm:text-xs">
              {key === "size" ? "Available sizes" : key}
            </span>
            <select
              aria-label={`Filter ${key}`}
              className="catalogue-select"
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
            >
              <option value="">
                All{" "}
                {key === "category"
                  ? "products"
                  : key === "size"
                    ? "sizes"
                    : key === "color"
                      ? "colors"
                      : key === "fabric"
                        ? "fabrics"
                        : "GSM"}
              </option>
              {options[key].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {/* Results count + reset */}
      <div className="my-5 sm:my-6 flex items-center justify-between">
        <p role="status" className="tech text-xs sm:text-sm text-muted-foreground">
          {products.length} / 04 products
        </p>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Reset filters"
          onClick={() => setFilters(INITIAL)}
          title="Reset filters"
          className="text-xs"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No products match these requirements.
        </p>
      ) : (
        <div>
          <div className="h-[460px] sm:h-[520px] md:h-[560px] w-full">
            <CardSwap
              cardDistance={40}
              verticalDistance={50}
              depth={70}
              skewAmount={4}
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
                const matchedColorImage =
                  filters.color && filters.color !== "Custom"
                    ? p.images.find((i) => i.color === filters.color)?.front
                    : null;
                const imageSrc =
                  matchedColorImage ??
                  PRODUCT_GROUP_IMAGES[p.slug] ??
                  (p.slug === "polo-t-shirts"
                    ? (p.images.find((i) => i.color === "White") ?? p.images[0])?.front
                    : (p.images.find((i) => i.color === "Black") ?? p.images[0])?.front);
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
                          src={imageSrc}
                          alt={`${p.name} group showcase`}
                          draggable={false}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      {/* Footer */}
                      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 sm:px-5 py-3 sm:py-4">
                        <div className="min-w-0">
                          <p className="tech text-[10px] sm:text-xs opacity-50">Product / {num}</p>
                          <h3 className="font-expanded mt-0.5 sm:mt-1 truncate text-base sm:text-lg leading-tight">
                            {p.name}
                          </h3>
                        </div>
                        <ArrowUpRight className="size-4 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
                      </div>
                    </Link>
                  </Card>
                );
              })}
            </CardSwap>
          </div>
          <p className="tech mt-3 text-center text-[10px] text-muted-foreground md:hidden">
            Drag cards to explore • Tap to configure
          </p>
        </div>
      )}
    </section>
  );
}
