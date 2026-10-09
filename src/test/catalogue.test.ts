import { describe, expect, it } from "vitest";
import { COLORS, FABRICS, GSM, PRODUCTS, SIZES, emptyConfiguration, filterProducts, validQuantities } from "@/lib/catalogue";

describe("Official ZEVRAE catalogue", () => {
 it("contains only the four official categories with shared verified specifications", () => {
  expect(PRODUCTS.map(p => p.name)).toEqual(["T-Shirts", "Oversize T-Shirts", "Polo T-Shirts", "Hoodies"]);
  for (const p of PRODUCTS) {
   expect(p.sizes).toEqual(SIZES); expect(p.fabrics).toEqual(FABRICS); expect(p.gsm).toEqual(GSM); expect(p.exampleColors).toEqual(COLORS);
   expect(p.customColorAvailable).toBe(true); expect(p.images).toHaveLength(5);
   expect(p.images.every(i => i.front.startsWith("https://") && i.back.startsWith("https://"))).toBe(true);
   expect(p.supportedCustomization).toEqual([]);
  }
 });
 it("filters actual availability rather than fabricating differences", () => {
  const initial = { category: "", fabric: "", gsm: "", size: "", color: "" };
  expect(filterProducts(initial)).toHaveLength(4);
  expect(filterProducts({ ...initial, category: "Polo T-Shirts" }).map(p => p.slug)).toEqual(["polo-t-shirts"]);
  for (const fabric of FABRICS) expect(filterProducts({ ...initial, fabric })).toHaveLength(4);
  for (const gsm of GSM) expect(filterProducts({ ...initial, gsm })).toHaveLength(4);
  for (const size of SIZES) expect(filterProducts({ ...initial, size })).toHaveLength(4);
  for (const color of [...COLORS, "Custom"]) expect(filterProducts({ ...initial, color })).toHaveLength(4);
  expect(filterProducts({ ...initial, gsm: "400 GSM" })).toHaveLength(0);
 });
 it("validates positive whole unit quantities for every selected size", () => {
  const config = emptyConfiguration("t-shirts"); expect(validQuantities(config)).toBe(false);
  config.sizes = ["S", "M"]; config.quantities = { S: "20", M: "40" }; expect(validQuantities(config)).toBe(true);
  for (const value of ["", "0", "-1", "1.5", "1000001", "NaN"]) { config.quantities.M = value; expect(validQuantities(config)).toBe(false); }
 });
});