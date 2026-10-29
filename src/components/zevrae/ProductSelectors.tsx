import { Button } from "@/components/ui/button";
import { type Configuration, type Product, type Size } from "@/lib/catalogue";

export function ColorSwatches({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {product.exampleColors.map((color) => (
        <Button
          key={color}
          type="button"
          variant="outline"
          size="icon"
          title={color}
          aria-label={color}
          aria-pressed={value === color}
          onClick={() => onChange(color)}
          className={`rounded-none p-1 ${value === color ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}
        >
          <span className={`size-full swatch-${(color.split(" /")[0] ?? "").toLowerCase()}`} />
        </Button>
      ))}
      {product.customColorAvailable && (
        <Button
          type="button"
          variant={value === "Custom" ? "industrial" : "industrial-ghost"}
          onClick={() => onChange("Custom")}
          aria-pressed={value === "Custom"}
        >
          Custom color
        </Button>
      )}
    </div>
  );
}

export function ProductSelectors({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: Configuration;
  onChange: (value: Configuration) => void;
}) {
  const update = (changes: Partial<Configuration>) => onChange({ ...value, ...changes });
  const toggleSize = (size: Size) =>
    update({
      sizes: value.sizes.includes(size)
        ? value.sizes.filter((s) => s !== size)
        : [...value.sizes, size],
    });
  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="tech mb-3">Size requirements</legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={value.sizes.includes(size) ? "industrial" : "industrial-ghost"}
              aria-pressed={value.sizes.includes(size)}
              onClick={() => toggleSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="tech mb-3 block">Fabric specification</span>
        <select
          aria-label="Fabric preference"
          value={value.fabric}
          onChange={(e) => update({ fabric: e.target.value })}
          className="catalogue-select"
        >
          <option value="">Select fabric</option>
          {product.fabrics.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="tech mb-3 block">GSM preference</span>
        <select
          aria-label="GSM preference"
          value={value.gsm}
          onChange={(e) => update({ gsm: e.target.value })}
          className="catalogue-select"
        >
          <option value="">Select GSM</option>
          {product.gsm.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend className="tech mb-4">Color / {value.color || "Select preference"}</legend>
        <ColorSwatches
          product={product}
          value={value.color}
          onChange={(color) => update({ color })}
        />
        <p className="mt-3 text-sm text-muted-foreground">
          Example colors. Other colors available on request.
        </p>
      </fieldset>
      {value.color === "Custom" && (
        <label className="block">
          <span className="tech mb-3 block">Custom color details</span>
          <input
            aria-label="Custom color details"
            value={value.customColor}
            onChange={(e) => update({ customColor: e.target.value })}
            placeholder="Color name or reference"
            maxLength={200}
            className="catalogue-input"
          />
        </label>
      )}
      <p className="text-sm text-muted-foreground">
        Fabric blend percentages, exact measurements and customization availability require
        confirmation.
      </p>
    </div>
  );
}
