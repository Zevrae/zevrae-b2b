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
  const [photoColor, setPhotoColor] = useState<string>(product.images[0]?.color ?? "Black");
  const [open, setOpen] = useState(false);

  // Active color: if chosen in config specs, use it; otherwise use photoColor
  const activeColor =
    config.color &&
    config.color !== "Custom" &&
    product.images.some((i) => i.color === config.color)
      ? config.color
      : photoColor;

  const image = product.images.find((i) => i.color === activeColor) ?? product.images[0];
  const photoColors = product.images.map((i) => i.color);

  const handleSelectColor = (color: string) => {
    setPhotoColor(color);
    setConfig((prev) => ({ ...prev, color }));
  };

  const handleBackToCatalogue = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/#products";
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
            hash="products"
            onClick={handleBackToCatalogue}
            className="inline-flex items-center gap-2 text-xs sm:text-sm"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            Catalogue
          </Link>
        </Button>
      </header>
      <div className="grid gap-8 px-4 py-8 sm:px-6 sm:py-12 md:grid-cols-2 md:gap-12 md:px-16 md:py-20">
        <div className="min-w-0">
          <div className="product-photo aspect-[4/5]">
            <img
              src={image?.[side]}
              alt={`${product.name} — ${side} view, ${image?.color}`}
              className="h-full w-full object-contain p-4 sm:p-8 md:p-12 transition-opacity duration-300"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5 sm:gap-3">
            {(["front", "back"] as const).map((s) => (
              <Button
                key={s}
                variant={side === s ? "industrial" : "industrial-ghost"}
                aria-pressed={side === s}
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => setSide(s)}
              >
                {s} view
              </Button>
            ))}
          </div>
          {photoColors.length > 1 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="tech text-xs sm:text-sm text-muted-foreground">Colour preview:</span>
              <div className="flex flex-wrap items-center gap-2">
                {photoColors.map((c) => {
                  const swatchClass = `swatch-${(c.split(" /")[0] ?? "").toLowerCase()}`;
                  const isSelected = activeColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleSelectColor(c)}
                      aria-pressed={isSelected}
                      title={c}
                      className={`relative h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-foreground ring-2 ring-ring ring-offset-2 ring-offset-background scale-110"
                          : "border-muted-foreground/40 opacity-70 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <span className={`block h-full w-full rounded-full ${swatchClass}`} />
                      <span className="sr-only">{c}</span>
                    </button>
                  );
                })}
              </div>
              <span className="tech text-[11px] sm:text-xs text-foreground/80">
                ({activeColor})
              </span>
            </div>
          )}
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
            Official garment reference / {image?.color}
          </p>
        </div>
        <div className="min-w-0">
          <p className="tech text-xs text-muted-foreground">Zevrae / Product specification</p>
          <h1 className="font-expanded mt-3 sm:mt-5 break-words text-3xl sm:text-4xl md:text-6xl leading-tight">
            {product.name}
          </h1>
          <p className="mb-6 sm:mb-10 mt-3 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          <ProductSelectors
            product={product}
            value={config}
            onChange={(newConfig) => {
              setConfig(newConfig);
              if (
                newConfig.color &&
                newConfig.color !== "Custom" &&
                product.images.some((i) => i.color === newConfig.color)
              ) {
                setPhotoColor(newConfig.color);
              }
            }}
          />
          <Button
            variant="industrial"
            size="xl"
            className="mt-8 sm:mt-10 w-full h-12 sm:h-14 text-sm sm:text-base"
            onClick={() => setOpen(true)}
          >
            Request a quote
          </Button>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
            Pricing, quantities and production schedules confirmed on inquiry.
          </p>
        </div>
      </div>
      <Footer />
      <QuoteFlow open={open} onClose={() => setOpen(false)} initial={config} />
    </main>
  );
}
