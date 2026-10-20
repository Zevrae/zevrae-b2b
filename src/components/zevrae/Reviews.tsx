import { Star } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  category: string;
  rating: number;
  content: string;
}

// =============================================================================
// CLIENT REVIEWS / TESTIMONIALS DATA
// You can easily add, edit, or replace reviews in this array.
// =============================================================================
export const REVIEWS: ReviewItem[] = [
  {
    id: "1",
    name: "Danish Verma",
    role: "President of student chapter",
    company: "OWASP",
    category: "Heavyweight Oversized Tees (240 GSM)",
    rating: 5,
    content:
      "The fabric weight, collar ribbing, and custom Pantone matching were spot on. Working with Zevrae cut our sampling cycle in half, and the finished bulk run sold out in 48 hours.",
  },
  {
    id: "2",
    name: "Rahul",
    role: "Owner of gaming org",
    company: "Wynasty",
    category: "French Terry Hoodies (320 GSM)",
    rating: 5,
    content:
      "Finding an apparel manufacturer that takes custom GSM, double-needle stitching, and custom private label necktags this seriously is rare. Seamless communication and strict QC.",
  },
  {
    id: "3",
    name: "Vikram Patel",
    role: "Brand Director",
    company: "Raw Craft Co.",
    category: "Polo T-Shirts & Custom Embroidery",
    rating: 5,
    content:
      "Consistent sizing across S through XXL, flawless embroidery placement, and eco-friendly packaging. Zevrae has been our primary manufacturing partner for 3 consecutive seasons.",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="border-t bg-background px-6 py-24 md:px-16 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-12">
        <div>
          <p className="tech text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Client Feedback &bull; Verified Production Runs
          </p>
          <h2 className="font-expanded mt-3 text-4xl md:text-6xl">
            Trusted by modern brands.
          </h2>
        </div>
        <p className="tech text-sm text-muted-foreground">
          B2B Manufacturing / 5.0 Rating
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((review) => (
          <SpotlightCard
            key={review.id}
            className="flex h-full flex-col justify-between border border-border/70 p-6 md:p-8"
            spotlightColor="rgba(255, 255, 255, 0.18)"
            intensity={0.25}
            spotlightSize={280}
            borderGlow={0.65}
            flare={true}
            ambient={false}
          >
            <div>
              {/* Rating Stars */}
              <div className="flex items-center gap-1 text-foreground" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-foreground stroke-foreground" />
                ))}
              </div>

              {/* Review Text */}
              <p className="mt-6 text-base leading-relaxed text-foreground/90 md:text-lg">
                &ldquo;{review.content}&rdquo;
              </p>
            </div>

            {/* Client Info & Product Tag */}
            <div className="mt-8 border-t border-border/50 pt-5">
              <span className="tech mb-3 inline-block bg-accent px-2.5 py-1 text-[11px] text-muted-foreground">
                {review.category}
              </span>
              <div className="font-expanded text-base text-foreground">
                {review.name}
              </div>
              <div className="tech mt-1 text-xs text-muted-foreground">
                {review.role} &bull; <span className="text-foreground">{review.company}</span>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

export default Reviews;
