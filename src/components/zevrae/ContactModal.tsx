import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Check, MessageSquare, ArrowRight, Loader2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  orderTopic: string;
}

// =============================================================================
// GOOGLE SHEETS INTEGRATION CONFIGURATION
// When you're ready to connect Google Sheets, deploy a Google Apps Script as a
// Web App (or use a webhook service like SheetDB / Make / Zapier) and paste the
// endpoint URL below.
// =============================================================================
export const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyyAaeDAOxXi1KxwrgnvEo3mT_ZxZZwRmj6MuqaVTmvcOp9-R8PaReSKy9N5g-WMPM7ew/exec"; 

export function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    orderTopic: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const dialog = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Reset form when opened
  useEffect(() => {
    if (!open) return;
    setForm({ name: "", phone: "", email: "", orderTopic: "" });
    setSubmitting(false);
    setSubmitted(false);
    setError("");

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(
      () => dialog.current?.querySelector<HTMLElement>("input, button")?.focus(),
      50,
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;

      const nodes = dialog.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select, textarea, a[href]',
      );
      const focusable = Array.from(nodes ?? []).filter((el) => el.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKeyDown);
      previous?.focus();
    };
  }, [open, onClose]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidPhone = (phone: string) => /^[+0-9\s\-()]{7,20}$/.test(phone.trim());

  const canSubmit =
    form.name.trim().length >= 2 &&
    isValidPhone(form.phone) &&
    isValidEmail(form.email) &&
    form.orderTopic.trim().length >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      if (GOOGLE_SHEET_WEBHOOK_URL) {
        // Send to configured Google Sheets Webhook / Apps Script
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            orderTopic: form.orderTopic.trim(),
          }),
        });
      } else {
        // Simulated network delay for UI responsiveness while Google Sheets is not yet hooked up
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Unable to submit right now. Please try again or reach out directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const cleanPhone = form.phone.replace(/[^0-9+]/g, "");
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hi Zevrae, I am ${form.name}. Regarding my order: ${form.orderTopic}. My contact: ${form.phone} / ${form.email}`,
  )}`;
  const mailtoUrl = `mailto:contact@zevrae.com?subject=${encodeURIComponent(
    `Order Discussion — ${form.name}`,
  )}&body=${encodeURIComponent(
    `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nRegarding the order:\n${form.orderTopic}`,
  )}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialog}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-background/90 p-4 backdrop-blur-md md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <div className="relative w-full max-w-2xl border border-border bg-card p-6 shadow-2xl md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-6">
              <div>
                <span className="tech text-muted-foreground">ZEVRAE / INQUIRY DESK</span>
                <h2 id="contact-modal-title" className="font-expanded mt-2 text-2xl md:text-4xl">
                  Contact Us
                </h2>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-none border-border hover:bg-accent"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Content Body */}
            <div className="py-8">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Share your requirements with our production team. Tell us about your project, target quantities, or any questions about your order.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Full Name */}
                    <label className="block">
                      <span className="tech mb-2 block">
                        Your Name <span className="text-thread">*</span>
                      </span>
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Alex Morgan"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="catalogue-input"
                        maxLength={100}
                      />
                    </label>

                    {/* Mobile Number */}
                    <label className="block">
                      <span className="tech mb-2 block">
                        Mobile Number <span className="text-thread">*</span>
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="catalogue-input"
                        maxLength={25}
                      />
                    </label>
                  </div>

                  {/* Email */}
                  <label className="block">
                    <span className="tech mb-2 block">
                      Email Address <span className="text-thread">*</span>
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="alex@yourbrand.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="catalogue-input"
                      maxLength={120}
                    />
                  </label>

                  {/* Order Topic / Requirement */}
                  <label className="block">
                    <span className="tech mb-2 block">
                      Regarding What You Need To Discuss <span className="text-thread">*</span>
                    </span>
                    <textarea
                      required
                      rows={4}
                      placeholder="Specify your order details: garment type, estimated units, custom branding, fabrics, or delivery timelines..."
                      value={form.orderTopic}
                      onChange={(e) => setForm({ ...form, orderTopic: e.target.value })}
                      className="catalogue-input"
                      maxLength={1500}
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>Please include estimated quantities or deadlines if available.</span>
                      <span>{form.orderTopic.length}/1500</span>
                    </div>
                  </label>

                  {error && (
                    <p role="alert" className="text-sm text-destructive">
                      {error}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                    <Button
                      type="button"
                      variant="industrial-ghost"
                      size="xl"
                      onClick={onClose}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="industrial"
                      size="xl"
                      disabled={!canSubmit || submitting}
                      className="gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                /* Success View */
                <div className="space-y-6">
                  <div className="flex items-start gap-4 border border-border bg-accent/30 p-5">
                    <div className="flex size-9 shrink-0 items-center justify-center bg-thread text-background">
                      <Check className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-expanded text-lg md:text-xl">
                        Inquiry Received, {form.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Thank you for reaching out. We have logged your details and our team will get in touch with you shortly.
                      </p>
                    </div>
                  </div>

                  {/* Summary of details */}
                  <div className="space-y-3 border-y border-border py-4">
                    <span className="tech text-muted-foreground">Submission Summary</span>
                    <dl className="grid gap-2 text-sm md:grid-cols-2">
                      <div>
                        <dt className="tech text-muted-foreground">Contact</dt>
                        <dd className="font-medium text-foreground">{form.name}</dd>
                      </div>
                      <div>
                        <dt className="tech text-muted-foreground">Phone</dt>
                        <dd className="font-medium text-foreground">{form.phone}</dd>
                      </div>
                      <div className="md:col-span-2">
                        <dt className="tech text-muted-foreground">Email</dt>
                        <dd className="font-medium text-foreground">{form.email}</dd>
                      </div>
                      <div className="md:col-span-2">
                        <dt className="tech text-muted-foreground">Regarding Order</dt>
                        <dd className="whitespace-pre-wrap font-medium text-foreground">{form.orderTopic}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Instant contact shortcuts */}
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      <Phone className="size-3.5" />
                      Open WhatsApp
                    </a>
                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      <Mail className="size-3.5" />
                      Open Email
                    </a>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-border pt-6">
                    <Button
                      variant="industrial-ghost"
                      size="lg"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", phone: "", email: "", orderTopic: "" });
                      }}
                    >
                      Submit Another
                    </Button>
                    <Button variant="industrial" size="lg" onClick={onClose}>
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
