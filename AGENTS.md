<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Catalogue architecture
- Keep verified product content and filtering/quantity validation in `src/lib/catalogue.ts`; catalogue, detail pages and inquiry share it to prevent divergent specifications.
- Use flat `products.index.tsx` and `products.$slug.tsx` leaf routes for shareable catalogue pages while preserving the scroll-driven homepage.
- Use shared specification/color selectors and a single QuoteFlow; transfer configuration into size-wise inquiries without duplicate product models.
- Until a real submission service is configured, offer an explicitly unsent downloadable inquiry draft; never show a sent/received confirmation.
- Reference extracted garment media through checked-in asset pointers; keep original PDF page layouts out of website imagery.
