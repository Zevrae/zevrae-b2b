import asset0_0_front from "@/assets/catalogue/t-shirts-red-front.jpg.asset.json";
import asset0_0_back from "@/assets/catalogue/t-shirts-red-back.jpg.asset.json";
import asset0_1_front from "@/assets/catalogue/t-shirts-yellow-front.jpg.asset.json";
import asset0_1_back from "@/assets/catalogue/t-shirts-yellow-back.jpg.asset.json";
import asset0_2_front from "@/assets/catalogue/t-shirts-beige-front.jpg.asset.json";
import asset0_2_back from "@/assets/catalogue/t-shirts-beige-back.jpg.asset.json";
import asset0_3_front from "@/assets/catalogue/t-shirts-white-front.jpg.asset.json";
import asset0_3_back from "@/assets/catalogue/t-shirts-white-back.jpg.asset.json";
import asset0_4_front from "@/assets/catalogue/t-shirts-black-front.jpg.asset.json";
import asset0_4_back from "@/assets/catalogue/t-shirts-black-back.jpg.asset.json";
import asset1_0_front from "@/assets/catalogue/oversize-t-shirts-red-front.jpg.asset.json";
import asset1_0_back from "@/assets/catalogue/oversize-t-shirts-red-back.jpg.asset.json";
import asset1_1_front from "@/assets/catalogue/oversize-t-shirts-yellow-front.jpg.asset.json";
import asset1_1_back from "@/assets/catalogue/oversize-t-shirts-yellow-back.jpg.asset.json";
import asset1_2_front from "@/assets/catalogue/oversize-t-shirts-beige-front.jpg.asset.json";
import asset1_2_back from "@/assets/catalogue/oversize-t-shirts-beige-back.jpg.asset.json";
import asset1_3_front from "@/assets/catalogue/oversize-t-shirts-black-front.jpg.asset.json";
import asset1_3_back from "@/assets/catalogue/oversize-t-shirts-black-back.jpg.asset.json";
import asset1_4_front from "@/assets/catalogue/oversize-t-shirts-white-front.jpg.asset.json";
import asset1_4_back from "@/assets/catalogue/oversize-t-shirts-white-back.jpg.asset.json";
import asset2_0_front from "@/assets/catalogue/polo-t-shirts-beige-front.jpg.asset.json";
import asset2_0_back from "@/assets/catalogue/polo-t-shirts-beige-back.jpg.asset.json";
import asset2_1_front from "@/assets/catalogue/polo-t-shirts-red-front.jpg.asset.json";
import asset2_1_back from "@/assets/catalogue/polo-t-shirts-red-back.jpg.asset.json";
import asset2_2_front from "@/assets/catalogue/polo-t-shirts-yellow-front.jpg.asset.json";
import asset2_2_back from "@/assets/catalogue/polo-t-shirts-yellow-back.jpg.asset.json";
import asset2_3_front from "@/assets/catalogue/polo-t-shirts-black-front.jpg.asset.json";
import asset2_3_back from "@/assets/catalogue/polo-t-shirts-black-back.jpg.asset.json";
import asset2_4_front from "@/assets/catalogue/polo-t-shirts-white-front.jpg.asset.json";
import asset2_4_back from "@/assets/catalogue/polo-t-shirts-white-back.jpg.asset.json";
import asset3_0_front from "@/assets/catalogue/hoodies-yellow-front.jpg.asset.json";
import asset3_0_back from "@/assets/catalogue/hoodies-yellow-back.jpg.asset.json";
import asset3_1_front from "@/assets/catalogue/hoodies-red-front.jpg.asset.json";
import asset3_1_back from "@/assets/catalogue/hoodies-red-back.jpg.asset.json";
import asset3_2_front from "@/assets/catalogue/hoodies-beige-front.jpg.asset.json";
import asset3_2_back from "@/assets/catalogue/hoodies-beige-back.jpg.asset.json";
import asset3_3_front from "@/assets/catalogue/hoodies-black-front.jpg.asset.json";
import asset3_3_back from "@/assets/catalogue/hoodies-black-back.jpg.asset.json";
import asset3_4_front from "@/assets/catalogue/hoodies-white-front.jpg.asset.json";
import asset3_4_back from "@/assets/catalogue/hoodies-white-back.jpg.asset.json";

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export const FABRICS = ["Dry Fit — 100% Polyester", "Polycotton — Polyester Blend", "100% Cotton"];
export const GSM = ["160 GSM", "170 GSM", "180–200 GSM", "200–220 GSM"];
export const COLORS = ["Black", "White", "Red", "Yellow", "Beige / Cream"];
export type Size = (typeof SIZES)[number];
export type Product = { name: string; slug: string; category: string; description: string; sizes: readonly Size[]; fabrics: string[]; gsm: string[]; exampleColors: string[]; customColorAvailable: boolean; supportedCustomization: string[]; images: { color: string; front: string; back: string }[] };
export const PRODUCTS: Product[] = [
{ name: "T-Shirts", slug: "t-shirts", category: "T-Shirts", description: "A classic crew-neck T-shirt with short sleeves.", sizes: SIZES, fabrics: FABRICS, gsm: GSM, exampleColors: COLORS, customColorAvailable: true, supportedCustomization: [], images: [{ color: "Red", front: asset0_0_front.url, back: asset0_0_back.url }, { color: "Yellow", front: asset0_1_front.url, back: asset0_1_back.url }, { color: "Beige / Cream", front: asset0_2_front.url, back: asset0_2_back.url }, { color: "White", front: asset0_3_front.url, back: asset0_3_back.url }, { color: "Black", front: asset0_4_front.url, back: asset0_4_back.url }] },
{ name: "Oversize T-Shirts", slug: "oversize-t-shirts", category: "Oversize T-Shirts", description: "A relaxed, oversized crew-neck silhouette with wider sleeves.", sizes: SIZES, fabrics: FABRICS, gsm: GSM, exampleColors: COLORS, customColorAvailable: true, supportedCustomization: [], images: [{ color: "Red", front: asset1_0_front.url, back: asset1_0_back.url }, { color: "Yellow", front: asset1_1_front.url, back: asset1_1_back.url }, { color: "Beige / Cream", front: asset1_2_front.url, back: asset1_2_back.url }, { color: "Black", front: asset1_3_front.url, back: asset1_3_back.url }, { color: "White", front: asset1_4_front.url, back: asset1_4_back.url }] },
{ name: "Polo T-Shirts", slug: "polo-t-shirts", category: "Polo T-Shirts", description: "A short-sleeve polo with a collar and button placket.", sizes: SIZES, fabrics: FABRICS, gsm: GSM, exampleColors: COLORS, customColorAvailable: true, supportedCustomization: [], images: [{ color: "Beige / Cream", front: asset2_0_front.url, back: asset2_0_back.url }, { color: "Red", front: asset2_1_front.url, back: asset2_1_back.url }, { color: "Yellow", front: asset2_2_front.url, back: asset2_2_back.url }, { color: "Black", front: asset2_3_front.url, back: asset2_3_back.url }, { color: "White", front: asset2_4_front.url, back: asset2_4_back.url }] },
{ name: "Hoodies", slug: "hoodies", category: "Hoodies", description: "A pullover hooded silhouette with ribbed cuffs and hem.", sizes: SIZES, fabrics: FABRICS, gsm: GSM, exampleColors: COLORS, customColorAvailable: true, supportedCustomization: [], images: [{ color: "Yellow", front: asset3_0_front.url, back: asset3_0_back.url }, { color: "Red", front: asset3_1_front.url, back: asset3_1_back.url }, { color: "Beige / Cream", front: asset3_2_front.url, back: asset3_2_back.url }, { color: "Black", front: asset3_3_front.url, back: asset3_3_back.url }, { color: "White", front: asset3_4_front.url, back: asset3_4_back.url }] }
];
export type Configuration = { slug: string; fabric: string; gsm: string; color: string; customColor: string; sizes: Size[]; quantities: Partial<Record<Size, string>> };
export function emptyConfiguration(slug = ""): Configuration { return { slug, fabric: "", gsm: "", color: "", customColor: "", sizes: [], quantities: {} }; }
export type Filters = { category: string; fabric: string; gsm: string; size: string; color: string };
export function filterProducts(filters: Filters) {
 return PRODUCTS.filter(p => (!filters.category || p.category === filters.category) && (!filters.fabric || p.fabrics.includes(filters.fabric)) && (!filters.gsm || p.gsm.includes(filters.gsm)) && (!filters.size || p.sizes.some(s => s === filters.size)) && (!filters.color || (filters.color === "Custom" ? p.customColorAvailable : p.exampleColors.includes(filters.color))));
}
export function validQuantities(c: Configuration) { return c.sizes.length > 0 && c.sizes.every(s => /^\d+$/.test(c.quantities[s] ?? "") && Number(c.quantities[s]) > 0 && Number(c.quantities[s]) <= 1000000); }
