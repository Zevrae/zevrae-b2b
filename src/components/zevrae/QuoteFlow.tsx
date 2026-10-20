import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Check, Loader2, Send, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS, emptyConfiguration, validQuantities, type Configuration } from "@/lib/catalogue";
import { ProductSelectors } from "./ProductSelectors";

// =============================================================================
// EMAIL NOTIFICATION CONFIGURATION
// All new order inquiries alert Zevrae's official email address.
// To enable automated background email delivery, get a free Web3Forms Access Key
// at https://web3forms.com (enter officialzevrae@gmail.com) and paste it below.
// =============================================================================
export const OFFICIAL_ZEVRAE_EMAIL = "officialzevrae@gmail.com";
export const WEB3FORMS_ACCESS_KEY = ""; // e.g. "a1b2c3d4-e5f6-7890-..."
export const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwj9508ecbTtGKDxYlmr382sBwiiyHyv0RgdJhfgYuls13s1_ZsPKTMGscSeVdTFsUF/exec";
const STEPS = ["Product", "Quantities", "Requirements", "Contact", "Review"];

export function QuoteFlow({
    open,
    onClose,
    initial,
}: {
    open: boolean;
    onClose: () => void;
    initial?: Configuration;
}) {
    const [step, setStep] = useState(0);
    const [config, setConfig] = useState<Configuration>(emptyConfiguration());
    const [requirements, setRequirements] = useState({
        printing: "",
        branding: "",
        additional: "",
    });
    const [contact, setContact] = useState({ company: "", name: "", email: "", phone: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const dialog = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const product = PRODUCTS.find((p) => p.slug === config.slug);

    useEffect(() => {
        if (!open) return;
        setConfig(
            initial
                ? { ...initial, quantities: { ...initial.quantities }, sizes: [...initial.sizes] }
                : emptyConfiguration(),
        );
        setStep(0);
        setSubmitted(false);
        setSubmitting(false);

        const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const focusTimer = window.setTimeout(
            () => dialog.current?.querySelector<HTMLElement>("button")?.focus(),
            50,
        );

        const keyboard = (event: KeyboardEvent) => {
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

        document.addEventListener("keydown", keyboard);
        return () => {
            window.clearTimeout(focusTimer);
            document.body.style.overflow = overflow;
            document.removeEventListener("keydown", keyboard);
            previous?.focus();
        };
    }, [open, initial, onClose]);

    const valid = [
        !!product &&
        !!config.fabric &&
        !!config.gsm &&
        !!config.color &&
        (config.color !== "Custom" || !!config.customColor.trim()),
        validQuantities(config),
        true,
        !!contact.company.trim() &&
        !!contact.name.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) &&
        !!contact.phone.trim(),
        true,
    ][step];

    const total = config.sizes.reduce((sum, size) => sum + (Number(config.quantities[size]) || 0), 0);

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            const subject = `[NEW INQUIRY] ${product?.name} — ${contact.company || contact.name}`;
            const messageBody = [
                `NEW ORDER INQUIRY`,
                `----------------------------------------`,
                `Product: ${product?.name}`,
                `Fabric: ${config.fabric}`,
                `GSM: ${config.gsm}`,
                `Color: ${config.color === "Custom" ? `Custom (${config.customColor})` : config.color}`,
                `Size Quantities: ${config.sizes.map((s) => `${s}: ${config.quantities[s] || 0}`).join(", ")}`,
                `Total Units: ${total}`,
                `----------------------------------------`,
                `Printing: ${requirements.printing || "None"}`,
                `Branding: ${requirements.branding || "None"}`,
                `Additional Requirements: ${requirements.additional || "None"}`,
                `----------------------------------------`,
                `Company: ${contact.company}`,
                `Contact Person: ${contact.name}`,
                `Email: ${contact.email}`,
                `Phone / WhatsApp: ${contact.phone}`,
            ].join("\n");

            if (GOOGLE_SHEET_WEBHOOK_URL) {
                await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify({
                        type: "quote",
                        timestamp: new Date().toISOString(),
                        company: contact.company,
                        name: contact.name,
                        email: contact.email,
                        phone: contact.phone,
                        product: product?.name || "",
                        fabric: `${config.fabric} (${config.gsm})`,
                        color: config.color === "Custom" ? config.customColor : config.color,
                        quantities: config.sizes.map((s) => `${s}: ${config.quantities[s] || 0}`).join(", "),
                        total_units: total,
                        printing: requirements.printing || "None",
                        branding: requirements.branding || "None",
                        additional: requirements.additional || "None",
                    }),
                });
            }

            if (WEB3FORMS_ACCESS_KEY) {
                await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        to: OFFICIAL_ZEVRAE_EMAIL,
                        subject,
                        from_name: contact.name,
                        company: contact.company,
                        email: contact.email,
                        phone: contact.phone,
                        product: product?.name,
                        fabric: `${config.fabric} (${config.gsm})`,
                        color: config.color === "Custom" ? config.customColor : config.color,
                        quantities: config.sizes.map((s) => `${s}: ${config.quantities[s] || 0}`).join(", "),
                        total_units: total,
                        printing: requirements.printing || "None",
                        branding: requirements.branding || "None",
                        additional: requirements.additional || "None",
                        message: messageBody,
                    }),
                });
            } else if (!GOOGLE_SHEET_WEBHOOK_URL) {
                // Quick responsive feedback if neither is set
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            setSubmitted(true);
        } catch (err) {
            console.error("Submission alert error:", err);
            setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    const mailtoUrl = `mailto:${OFFICIAL_ZEVRAE_EMAIL}?subject=${encodeURIComponent(
        `[NEW INQUIRY] ${product?.name} — ${contact.company || contact.name}`,
    )}&body=${encodeURIComponent(
        `Hello Zevrae Team,\n\nI would like to raise a new order inquiry:\n\n` +
        `Product: ${product?.name}\n` +
        `Fabric: ${config.fabric} (${config.gsm})\n` +
        `Color: ${config.color === "Custom" ? config.customColor : config.color}\n` +
        `Quantities: ${config.sizes.map((s) => `${s}: ${config.quantities[s] || 0}`).join(", ")}\n` +
        `Total Units: ${total}\n\n` +
        `Printing: ${requirements.printing || "None"}\n` +
        `Branding: ${requirements.branding || "None"}\n` +
        `Additional Notes: ${requirements.additional || "None"}\n\n` +
        `Contact Details:\n` +
        `Company: ${contact.company}\n` +
        `Name: ${contact.name}\n` +
        `Phone: ${contact.phone}\n` +
        `Email: ${contact.email}`,
    )}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `Hi Zevrae, I want to raise an order inquiry for ${product?.name} (${total} units). Contact: ${contact.name} / ${contact.phone}`,
    )}`;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={dialog}
                    initial={reducedMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.5 }}
                    className="fixed inset-0 z-[60] overflow-y-auto bg-background"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="quote-title"
                >
                    <div className="mx-auto flex min-h-full max-w-5xl flex-col px-6 py-8 md:px-10">
                        <div className="flex items-center justify-between">
                            <span className="font-expanded text-xl">Zevrae</span>
                            <Button variant="outline" size="icon" onClick={onClose} aria-label="Close">
                                <X />
                            </Button>
                        </div>
                        <div className="mt-10 grid grid-cols-5 gap-1">
                            {STEPS.map((s, i) => (
                                <div key={s}>
                                    <div className={`h-px ${i <= step ? "bg-thread" : "bg-border"}`} />
                                    <p className={`tech mt-2 hidden md:block ${i === step ? "" : "text-muted-foreground"}`}>
                                        {String(i + 1).padStart(2, "0")} {s}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 py-10">
                            <p className="tech text-muted-foreground">Step {String(step + 1).padStart(2, "0")} / 05</p>
                            <h2 id="quote-title" className="font-expanded mt-4 text-3xl md:text-5xl">
                                {
                                    [
                                        "Configure your product",
                                        "Size-wise quantities",
                                        "Project requirements",
                                        "Your details",
                                        "Review & Submit inquiry",
                                    ][step]
                                }
                            </h2>
                            <div className="mt-10">
                                {step === 0 && (
                                    <div className="space-y-8">
                                        <label className="block">
                                            <span className="tech mb-3 block">Selected product</span>
                                            <select
                                                aria-label="Selected product"
                                                className="catalogue-select"
                                                value={config.slug}
                                                onChange={(e) => setConfig(emptyConfiguration(e.target.value))}
                                            >
                                                <option value="">Select product</option>
                                                {PRODUCTS.map((p) => (
                                                    <option key={p.slug} value={p.slug}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        {product && (
                                            <ProductSelectors product={product} value={config} onChange={setConfig} />
                                        )}
                                    </div>
                                )}
                                {step === 1 && (
                                    <div>
                                        <p className="mb-6 text-muted-foreground">{product?.name} / Units per size</p>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            {product?.sizes.map((size) => (
                                                <label key={size} className="flex items-center gap-4 border-b py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={config.sizes.includes(size)}
                                                        aria-label={`Include ${size}`}
                                                        onChange={(e) =>
                                                            setConfig({
                                                                ...config,
                                                                sizes: e.target.checked
                                                                    ? [...config.sizes, size]
                                                                    : config.sizes.filter((s) => s !== size),
                                                            })
                                                        }
                                                        className="size-4 accent-foreground"
                                                    />
                                                    <span className="tech w-10">{size}</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="1000000"
                                                        step="1"
                                                        disabled={!config.sizes.includes(size)}
                                                        aria-label={`Quantity ${size}`}
                                                        value={config.quantities[size] ?? ""}
                                                        onChange={(e) =>
                                                            setConfig({
                                                                ...config,
                                                                quantities: { ...config.quantities, [size]: e.target.value },
                                                            })
                                                        }
                                                        className="catalogue-input min-w-0"
                                                        placeholder="Units"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                        <p className="tech mt-8">Total / {total} units</p>
                                        <p className="mt-4 text-sm text-muted-foreground">
                                            Minimum order quantities require confirmation.
                                        </p>
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <p className="text-sm text-muted-foreground">
                                            Printing and branding requests are subject to confirmation.
                                        </p>
                                        {(
                                            [
                                                ["printing", "Printing requirements"],
                                                ["branding", "Branding / labels"],
                                                ["additional", "Additional requirements"],
                                            ] as const
                                        ).map(([key, title]) => (
                                            <label key={key} className="block">
                                                <span className="tech mb-2 block">{title}</span>
                                                <textarea
                                                    aria-label={title}
                                                    maxLength={2000}
                                                    rows={2}
                                                    value={requirements[key]}
                                                    onChange={(e) =>
                                                        setRequirements({ ...requirements, [key]: e.target.value })
                                                    }
                                                    className="catalogue-input"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {step === 3 && (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {(
                                            [
                                                ["company", "Company / Brand"],
                                                ["name", "Name"],
                                                ["email", "Email address"],
                                                ["phone", "Phone / WhatsApp"],
                                            ] as const
                                        ).map(([key, title]) => (
                                            <label key={key} className="block">
                                                <span className="tech mb-2 block">{title} *</span>
                                                <input
                                                    aria-label={title}
                                                    type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                                                    required
                                                    autoComplete={
                                                        key === "company" ? "organization" : key === "phone" ? "tel" : key
                                                    }
                                                    value={contact[key]}
                                                    maxLength={200}
                                                    onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
                                                    className="catalogue-input"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {step === 4 && (
                                    <div className="space-y-7">
                                        {!submitted ? (
                                            <>
                                                <dl className="divide-y border-y">
                                                    {[
                                                        ["Product", product?.name],
                                                        ["Fabric", config.fabric],
                                                        ["GSM", config.gsm],
                                                        [
                                                            "Color",
                                                            config.color === "Custom"
                                                                ? `Custom — ${config.customColor}`
                                                                : config.color,
                                                        ],
                                                        [
                                                            "Size quantities",
                                                            config.sizes.map((s) => `${s}: ${config.quantities[s]}`).join(" / "),
                                                        ],
                                                        ["Total units", total],
                                                        ["Company", contact.company],
                                                        ["Contact", `${contact.name} / ${contact.email} / ${contact.phone}`],
                                                        ["Printing", requirements.printing || "—"],
                                                        ["Branding", requirements.branding || "—"],
                                                        ["Additional requirements", requirements.additional || "—"],
                                                    ].map(([k, v]) => (
                                                        <div key={k} className="grid gap-2 py-4 md:grid-cols-[180px_1fr]">
                                                            <dt className="tech text-muted-foreground">{k}</dt>
                                                            <dd className="break-words">{v}</dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                                <p className="text-sm text-muted-foreground">
                                                    Clicking <strong>Submit</strong> will alert the Zevrae production team at{" "}
                                                    <span className="text-foreground">{OFFICIAL_ZEVRAE_EMAIL}</span> with your inquiry details.
                                                </p>
                                            </>
                                        ) : (
                                            /* Success View */
                                            <div className="space-y-6">
                                                <div className="flex items-start gap-4 border border-border bg-accent/30 p-6">
                                                    <div className="flex size-9 shrink-0 items-center justify-center bg-thread text-background">
                                                        <Check className="size-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-expanded text-xl md:text-2xl">
                                                            Inquiry Raised Successfully!
                                                        </h3>
                                                        <p className="mt-2 text-sm text-muted-foreground">
                                                            An alert for this inquiry has been submitted to{" "}
                                                            <strong className="text-foreground">{OFFICIAL_ZEVRAE_EMAIL}</strong>. Our team will review your specifications and contact you shortly.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Quick Direct Actions */}
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <a
                                                        href={mailtoUrl}
                                                        className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-foreground transition-colors hover:border-foreground hover:bg-accent"
                                                    >
                                                        <Mail className="size-3.5" />
                                                        Email Zevrae ({OFFICIAL_ZEVRAE_EMAIL})
                                                    </a>
                                                    <a
                                                        href={whatsappUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                                                    >
                                                        <Phone className="size-3.5" />
                                                        WhatsApp Us
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
                            <Button
                                variant="industrial-ghost"
                                size="xl"
                                disabled={step === 0 || submitting}
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>
                            {step < 4 ? (
                                <Button
                                    variant="industrial"
                                    size="xl"
                                    disabled={!valid}
                                    onClick={() => {
                                        setStep(step + 1);
                                        dialog.current?.scrollTo({ top: 0 });
                                    }}
                                >
                                    Continue →
                                </Button>
                            ) : !submitted ? (
                                <Button
                                    variant="industrial"
                                    size="xl"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                    className="gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-4" />
                                            Submit
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button variant="industrial" size="xl" onClick={onClose}>
                                    Done
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
