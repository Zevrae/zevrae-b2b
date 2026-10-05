import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const TYPES = ["Bulk apparel", "Private label", "Custom manufacturing", "Corporate / Event"];
const PRODUCTS = ["T-Shirt", "Oversized T-Shirt", "Hoodie", "Sweatshirt", "Track Pants", "Jacket", "Custom"];
const QTY = ["50–100", "100–500", "500–2,000", "2,000+"];
const CUSTOM = ["Print", "Embroidery", "Custom label", "Packaging"];
const STEPS = ["Type", "Products", "Quantity", "Customization", "Files", "Contact"];

function Choice({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center justify-between border p-5 text-left transition-colors duration-300 ${on ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}
    >
      <span className="font-display text-lg font-bold uppercase [font-stretch:115%]">{label}</span>
      <span className={`flex size-5 items-center justify-center border ${on ? "border-background" : ""}`}>{on && <Check className="size-3" />}</span>
    </button>
  );
}

export function QuoteFlow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");
  const [products, setProducts] = useState<string[]>([]);
  const [qty, setQty] = useState("");
  const [custom, setCustom] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [contact, setContact] = useState({ name: "", company: "", email: "", phone: "", notes: "" });

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const valid = [!!type, products.length > 0, !!qty, true, true, !!contact.name && /\S+@\S+\.\S+/.test(contact.email)][step];

  const reset = () => {
    setStep(0); setType(""); setProducts([]); setQty(""); setCustom([]); setFiles([]);
    setContact({ name: "", company: "", email: "", phone: "", notes: "" });
  };

  const submit = () => {
    toast.success("Quote request received", { description: "Our production team will reply within 24 hours." });
    reset();
    onClose();
  };

  const input = "w-full border-b bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          className="grain fixed inset-0 z-[60] overflow-y-auto bg-background"
          role="dialog"
          aria-label="Start a project"
        >
          <div className="mx-auto flex min-h-full max-w-5xl flex-col px-6 py-8 md:px-10">
            <div className="flex items-center justify-between">
              <span className="font-expanded text-xl">Zevrae</span>
              <button onClick={onClose} aria-label="Close" className="border p-2 transition-colors hover:bg-foreground hover:text-background">
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-10 grid grid-cols-6 gap-1">
              {STEPS.map((s, i) => (
                <div key={s}>
                  <div className="h-px w-full bg-border">
                    <div className={`thread-glow h-px bg-thread transition-all duration-500 ${i <= step ? "w-full" : "w-0"}`} />
                  </div>
                  <p className={`tech mt-2 hidden md:block ${i === step ? "" : "text-muted-foreground"}`}>{String(i + 1).padStart(2, "0")} {s}</p>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="flex-1 py-12"
              >
                <p className="tech text-muted-foreground">Step {String(step + 1).padStart(2, "0")} / 06</p>
                <h2 className="font-expanded mt-4 text-4xl md:text-6xl">
                  {["What are you looking for?", "Select products", "Quantity", "Customization", "Upload files", "Your details"][step]}
                </h2>
                <div className="mt-10">
                  {step === 0 && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {TYPES.map((t) => <Choice key={t} label={t} on={type === t} onClick={() => setType(t)} />)}
                    </div>
                  )}
                  {step === 1 && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {PRODUCTS.map((t) => <Choice key={t} label={t} on={products.includes(t)} onClick={() => toggle(products, setProducts, t)} />)}
                    </div>
                  )}
                  {step === 2 && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {QTY.map((t) => <Choice key={t} label={`${t} units`} on={qty === t} onClick={() => setQty(t)} />)}
                    </div>
                  )}
                  {step === 3 && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {CUSTOM.map((t) => <Choice key={t} label={t} on={custom.includes(t)} onClick={() => toggle(custom, setCustom, t)} />)}
                    </div>
                  )}
                  {step === 4 && (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-4 border border-dashed p-16 text-center transition-colors hover:border-foreground">
                      <Upload className="size-6" />
                      <span className="tech">Drop design / reference files or click to browse</span>
                      <span className="text-sm text-muted-foreground">AI, PDF, PNG, JPG — optional</span>
                      <input type="file" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
                      {files.length > 0 && (
                        <ul className="tech mt-4 space-y-1">{files.map((f) => <li key={f.name}>{f.name}</li>)}</ul>
                      )}
                    </label>
                  )}
                  {step === 5 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {([["name", "Full name *"], ["company", "Company / Brand"], ["email", "Email *"], ["phone", "Phone"]] as const).map(([k, p]) => (
                        <input key={k} placeholder={p} value={contact[k]} maxLength={120} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} className={input} />
                      ))}
                      <textarea placeholder="Project notes" rows={3} maxLength={1000} value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} className={`${input} md:col-span-2`} />
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between border-t pt-6">
              <Button variant="industrial-ghost" size="xl" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
              {step < 5 ? (
                <Button variant="industrial" size="xl" disabled={!valid} onClick={() => setStep(step + 1)}>Continue →</Button>
              ) : (
                <Button variant="industrial" size="xl" disabled={!valid} onClick={submit}>Request a quote</Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
