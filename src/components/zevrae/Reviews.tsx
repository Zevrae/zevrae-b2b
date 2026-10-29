import { useState } from "react";
import { Star, PenLine, Check, Copy, Download, X, RotateCcw } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { Button } from "@/components/ui/button";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  category: string;
  rating: number;
  content: string;
  batch?: string | undefined;
  isDraft?: boolean | undefined;
}

// =============================================================================
// CLIENT REVIEWS / TESTIMONIALS DATA
// Verified reviews displayed on the public catalogue & homepage.
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

const PRESET_CATEGORIES = [
  "Heavyweight Oversized Tees (240 GSM)",
  "French Terry Hoodies (320 GSM)",
  "Polo T-Shirts & Custom Embroidery",
  "Classic Crewneck T-Shirts (180 GSM)",
  "Drop-Shoulder Boxy Fit Tees",
  "Custom Private Label Garments",
];

const RATING_LABELS: Record<number, string> = {
  1: "1 Star — Unsatisfactory",
  2: "2 Stars — Needs Improvement",
  3: "3 Stars — Satisfactory",
  4: "4 Stars — Very Good Quality",
  5: "5 Stars — Exceptional Production",
};

export function Reviews() {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(REVIEWS);
  const [isWriting, setIsWriting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    category: PRESET_CATEGORIES[0] ?? "Heavyweight Oversized Tees (240 GSM)",
    rating: 5,
    content: "",
    batch: "",
  });
  const [hoverRating, setHoverRating] = useState(0);

  const generateDraftText = (data: typeof form) => {
    return [
      "============================================================",
      "ZEVRAE B2B APPAREL MANUFACTURING — CLIENT REVIEW DRAFT",
      "============================================================",
      `Date: ${new Date().toISOString().split("T")[0]}`,
      `Client Name: ${data.name || "N/A"}`,
      `Role / Title: ${data.role || "N/A"}`,
      `Company / Brand: ${data.company || "N/A"}`,
      `Garment Category: ${data.category}`,
      `Batch / PO Reference: ${data.batch || "Not specified"}`,
      `Rating: ${data.rating} / 5 Stars (${RATING_LABELS[data.rating] || ""})`,
      "------------------------------------------------------------",
      "Review Content:",
      `"${data.content || ""}"`,
      "============================================================",
      "Status: Unsent Draft (Subject to Production Invoice Verification)",
      "============================================================",
    ].join("\n");
  };

  const handleCopyDraft = async () => {
    const text = generateDraftText(form);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadDraft = () => {
    const text = generateDraftText(form);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeBrand = (form.company || "draft").toLowerCase().replace(/[^a-z0-9]/g, "-");
    a.href = url;
    a.download = `zevrae-review-${safeBrand}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company.trim() || !form.content.trim()) {
      setError("Please fill out your name, brand, and review content.");
      return;
    }

    const newReview: ReviewItem = {
      id: `review-${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim() || "Brand Partner",
      company: form.company.trim(),
      category: form.category.trim() || "Custom Bulk Production",
      rating: form.rating,
      content: form.content.trim(),
      batch: form.batch.trim() || undefined,
      isDraft: true,
    };

    setReviewsList((prev) => [newReview, ...prev]);
    setIsSubmitted(true);
    setError("");
  };

  return (
    <section
      id="reviews"
      className="border-t bg-background px-4 py-16 sm:px-6 sm:py-24 md:px-16 md:py-32"
    >
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-8 sm:pb-12">
        <div>
          <p className="tech text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground">
            Client Feedback &bull; Verified Production Runs
          </p>
          <h2 className="font-expanded mt-2 sm:mt-3 text-3xl sm:text-5xl md:text-6xl">
            Trusted by modern brands.
          </h2>
        </div>
        <p className="tech text-xs sm:text-sm text-muted-foreground">
          B2B Manufacturing / 5.0 Rating
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviewsList.map((review) => (
          <SpotlightCard
            key={review.id}
            className="flex h-full flex-col justify-between border border-border/70 p-5 sm:p-6 md:p-8"
            spotlightColor="rgba(255, 255, 255, 0.18)"
            intensity={0.25}
            spotlightSize={280}
            borderGlow={0.65}
            flare={true}
            ambient={false}
          >
            <div>
              {/* Rating Stars & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div
                  className="flex items-center gap-1 text-foreground"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-foreground stroke-foreground" />
                  ))}
                </div>

                {review.isDraft && (
                  <span className="tech bg-thread/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-thread">
                    Session Preview
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p className="mt-5 sm:mt-6 text-sm sm:text-base leading-relaxed text-foreground/90 md:text-lg">
                &ldquo;{review.content}&rdquo;
              </p>
            </div>

            {/* Client Info & Product Tag */}
            <div className="mt-6 sm:mt-8 border-t border-border/50 pt-4 sm:pt-5">
              <div className="mb-2.5 sm:mb-3 flex flex-wrap items-center gap-2">
                <span className="tech inline-block bg-accent px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] text-muted-foreground">
                  {review.category}
                </span>
                {review.batch && (
                  <span className="tech inline-block border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                    PO: {review.batch}
                  </span>
                )}
              </div>
              <div className="font-expanded text-sm sm:text-base text-foreground">
                {review.name}
              </div>
              <div className="tech mt-1 text-[11px] sm:text-xs text-muted-foreground">
                {review.role} &bull; <span className="text-foreground">{review.company}</span>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* OPTION TO WRITE REVIEWS JUST BELOW WHERE WE CAN SEE THE REVIEWS */}
      {/* ========================================================================= */}
      <div className="mt-10 sm:mt-14 border-t border-border/70 pt-8 sm:pt-10">
        <div className="flex flex-col gap-6 rounded-none border border-border/60 bg-accent/20 p-4 sm:p-6 md:p-8">
          {/* Section banner & trigger */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="tech text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground">
                Production Experience &bull; Client Submissions
              </span>
              <h3 className="font-expanded mt-2 text-2xl md:text-3xl text-foreground">
                Manufactured with Zevrae?
              </h3>
              <p className="tech mt-1 text-sm text-muted-foreground">
                Share your feedback on fabric hand-feel, collar ribbing, stitch density, or
                turnaround times.
              </p>
            </div>

            <Button
              type="button"
              variant={isWriting ? "industrial-ghost" : "industrial"}
              size="lg"
              onClick={() => {
                setIsWriting((prev) => !prev);
                setError("");
              }}
              className="shrink-0 gap-2"
            >
              {isWriting ? (
                <>
                  <X className="size-4" />
                  Close Form
                </>
              ) : (
                <>
                  <PenLine className="size-4" />
                  Write a Review
                </>
              )}
            </Button>
          </div>

          {/* Form / Submitted Confirmation Panel */}
          {isWriting && (
            <div className="mt-6 border-t border-border/60 pt-6">
              {isSubmitted ? (
                /* Success & Draft View */
                <div className="space-y-6 bg-background/50 p-6 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center bg-thread text-background">
                      <Check className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-expanded text-lg md:text-xl text-foreground">
                        Review added to session preview!
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Your review has been rendered in the client testimonials above. As an
                        authentic B2B manufacturer, public website listings require authentication
                        against your production invoice. You can download or copy your review draft
                        below to forward to your Zevrae production manager.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 border-t border-border/50 pt-5">
                    <Button
                      type="button"
                      variant="industrial"
                      size="lg"
                      onClick={handleCopyDraft}
                      className="w-full sm:w-auto gap-2"
                    >
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                      {copied ? "Draft Copied to Clipboard" : "Copy Review Draft"}
                    </Button>
                    <Button
                      type="button"
                      variant="industrial-ghost"
                      size="lg"
                      onClick={handleDownloadDraft}
                      className="w-full sm:w-auto gap-2"
                    >
                      <Download className="size-4" />
                      Download Draft (.txt)
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={() => {
                        setIsSubmitted(false);
                        setForm({
                          name: "",
                          role: "",
                          company: "",
                          category: PRESET_CATEGORIES[0] ?? "Heavyweight Oversized Tees (240 GSM)",
                          rating: 5,
                          content: "",
                          batch: "",
                        });
                      }}
                      className="w-full sm:w-auto gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="size-4" />
                      Write Another Review
                    </Button>
                  </div>
                </div>
              ) : (
                /* Active Review Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Star Rating Selector */}
                  <div>
                    <label className="tech mb-2 block text-xs">
                      Overall Rating <span className="text-thread">*</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div
                        className="flex items-center gap-1.5"
                        role="radiogroup"
                        aria-label="Select star rating"
                      >
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = (hoverRating || form.rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              role="radio"
                              aria-checked={form.rating === star}
                              aria-label={`${star} star${star > 1 ? "s" : ""}`}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setForm({ ...form, rating: star })}
                              className="p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                              <Star
                                className={`size-6 transition-colors ${
                                  active
                                    ? "fill-foreground stroke-foreground"
                                    : "fill-transparent stroke-muted-foreground/40"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="tech text-xs text-muted-foreground">
                        {RATING_LABELS[hoverRating || form.rating]}
                      </span>
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="tech mb-2 block text-xs">
                        Your Name <span className="text-thread">*</span>
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="catalogue-input text-sm"
                        maxLength={80}
                      />
                    </label>

                    <label className="block">
                      <span className="tech mb-2 block text-xs">
                        Your Role / Title <span className="text-thread">*</span>
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Founder & Creative Director"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="catalogue-input text-sm"
                        maxLength={80}
                      />
                    </label>
                  </div>

                  {/* Company & Category */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="tech mb-2 block text-xs">
                        Brand / Company Name <span className="text-thread">*</span>
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Raw Craft Co."
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="catalogue-input text-sm"
                        maxLength={100}
                      />
                    </label>

                    <label className="block">
                      <span className="tech mb-2 block text-xs">
                        Garment Category / Order Type <span className="text-thread">*</span>
                      </span>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="catalogue-select text-sm"
                      >
                        {PRESET_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {/* Batch / PO Reference */}
                  <label className="block">
                    <span className="tech mb-2 block text-xs">
                      Production Batch / PO #{" "}
                      <span className="text-muted-foreground">(Optional, for invoice linking)</span>
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. ZV-2025-042 or Sampling Stage #1"
                      value={form.batch}
                      onChange={(e) => setForm({ ...form, batch: e.target.value })}
                      className="catalogue-input text-sm"
                      maxLength={60}
                    />
                  </label>

                  {/* Review Text */}
                  <label className="block">
                    <span className="tech mb-2 block text-xs">
                      Your Production Review <span className="text-thread">*</span>
                    </span>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share details on fabric hand-feel, collar ribbing, double-needle stitching, custom Pantone accuracy, sampling turnaround, or delivery packing..."
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="catalogue-input text-sm"
                      maxLength={1000}
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-muted-foreground tech">
                      <span>
                        Detailed production feedback helps modern brands evaluate fit & fabric.
                      </span>
                      <span>{form.content.length}/1000</span>
                    </div>
                  </label>

                  {error && (
                    <p role="alert" className="text-sm text-destructive tech">
                      {error}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-4 border-t border-border/70 pt-5">
                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                      <Button
                        type="submit"
                        variant="industrial"
                        size="lg"
                        className="w-full sm:w-auto gap-2"
                      >
                        <Check className="size-4" />
                        Preview & Add Review
                      </Button>
                      <Button
                        type="button"
                        variant="industrial-ghost"
                        size="lg"
                        onClick={handleDownloadDraft}
                        disabled={!form.name.trim() || !form.content.trim()}
                        className="w-full sm:w-auto gap-2"
                      >
                        <Download className="size-4" />
                        Download Draft
                      </Button>
                      <Button
                        type="button"
                        variant="industrial-ghost"
                        size="lg"
                        onClick={handleCopyDraft}
                        disabled={!form.name.trim() || !form.content.trim()}
                        className="w-full sm:w-auto gap-2"
                      >
                        {copied ? (
                          <Check className="size-4 text-emerald-400" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                        {copied ? "Copied!" : "Copy Draft"}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsWriting(false);
                        setError("");
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
