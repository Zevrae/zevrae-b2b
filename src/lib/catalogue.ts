import whiteNormalTshirt from "@/assets/products/white-normal-tshirt.webp";
import blackOversized from "@/assets/products/black-oversized.webp";
import whiteOversized from "@/assets/products/white-oversized.webp";
import blackPoloTshirt from "@/assets/products/black-polo-tshirt.webp";
import whitePoloTshirt from "@/assets/products/white-polo-tshirt.webp";
import blackHoodie from "@/assets/products/black-hoodie.webp";
import whiteHoodie from "@/assets/products/white-hoodie.webp";

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export const FABRICS = ["Dry Fit — 100% Polyester", "Polycotton — Polyester Blend", "100% Cotton"];
export const GSM = ["160 GSM", "170 GSM", "180–200 GSM", "200–220 GSM"];
export const COLORS = ["Black", "White", "Red", "Yellow", "Beige / Cream"];
export type Size = (typeof SIZES)[number];
export type Product = { name: string; slug: string; category: string; description: string; sizes: readonly Size[]; fabrics: string[]; gsm: string[]; exampleColors: string[]; customColorAvailable: boolean; supportedCustomization: string[]; images: { color: string; front: string; back: string }[] };
export const PRODUCTS: Product[] = [
 { name: "T-Shirts", slug: "t-shirts", category: "T-Shirts", description: "A classic crew-neck T-shirt with short sleeves.", sizes: SIZES, fabrics: FABRICS, gsm: GSM, exampleColors: COLORS, customColorAvailable: true, supportedCustomization: [], images: [{ color: "White", front: whiteNormalTshirt, back: whiteNormalTshirt }] },
 { name: "Oversize T-Shirts", slug: "oversize-t-shirts", category: "Oversize T-Shirts", description: "A relaxed, oversized crew-neck silhouette with wider sleeves.", sizes: SIZES, fabrics: FABRICS, gsm: GSM, exampleColors: COLORS, customColorAvailable: true, supportedCustomization: [], images: [{ color: "Black", front: blackOversized, back: blackOversized }, { color: "White", front: whiteOversized, back: whiteOversized }] },
 { name: "Polo T-Shirts", slug: "polo-t-shirts", category: "Polo T-Shirts", description: "A short-sleeve polo with a collar and button placket.", sizes: SIZES, fabrics: FABRICS, gsm: GSM, exampleColors: COLORS, customColorAvailable: true, supportedCustomization: [], images: [{ color: "White", front: whitePoloTshirt, back: whitePoloTshirt }, { color: "Black", front: blackPoloTshirt, back: blackPoloTshirt }] },
 { name: "Hoodies", slug: "hoodies", category: "Hoodies", description: "A pullover hooded silhouette with ribbed cuffs and hem.", sizes: SIZES, fabrics: FABRICS, gsm: GSM, exampleColors: COLORS, customColorAvailable: true, supportedCustomization: [], images: [{ color: "Black", front: blackHoodie, back: blackHoodie }, { color: "White", front: whiteHoodie, back: whiteHoodie }] }
];
export type Configuration = { slug: string; fabric: string; gsm: string; color: string; customColor: string; sizes: Size[]; quantities: Partial<Record<Size, string>> };
export function emptyConfiguration(slug = ""): Configuration { return { slug, fabric: "", gsm: "", color: "", customColor: "", sizes: [], quantities: {} }; }
export type Filters = { category: string; fabric: string; gsm: string; size: string; color: string };
export function filterProducts(filters: Filters) {
 return PRODUCTS.filter(p => (!filters.category || p.category === filters.category) && (!filters.fabric || p.fabrics.includes(filters.fabric)) && (!filters.gsm || p.gsm.includes(filters.gsm)) && (!filters.size || p.sizes.some(s => s === filters.size)) && (!filters.color || (filters.color === "Custom" ? p.customColorAvailable : p.exampleColors.includes(filters.color))));
}
export function validQuantities(c: Configuration) { return c.sizes.length > 0 && c.sizes.every(s => /^\d+$/.test(c.quantities[s] ?? "") && Number(c.quantities[s]) > 0 && Number(c.quantities[s]) <= 1000000); }
