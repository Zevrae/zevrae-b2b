# ZEVRAE B2B

Custom apparel manufacturing, private label and bulk production for modern brands.

## Catalogue architecture

- Keep verified product content and filtering/quantity validation in `src/lib/catalogue.ts`; catalogue, detail pages and inquiry share it to prevent divergent specifications.
- Use flat `products.index.tsx` and `products.$slug.tsx` leaf routes for shareable catalogue pages while preserving the scroll-driven homepage.
- Use shared specification/color selectors and a single QuoteFlow; transfer configuration into size-wise inquiries without duplicate product models.
- Until a real submission service is configured, offer an explicitly unsent downloadable inquiry draft; never show a sent/received confirmation.
- Reference extracted garment media through checked-in asset pointers; keep original PDF page layouts out of website imagery.
