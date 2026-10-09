import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Upload, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS, emptyConfiguration, validQuantities, type Configuration } from "@/lib/catalogue";
import { ProductSelectors } from "./ProductSelectors";

const STEPS = ["Product", "Quantities", "Requirements", "Contact", "Review"];
export function QuoteFlow({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Configuration }) {
 const [step, setStep] = useState(0);
 const [config, setConfig] = useState<Configuration>(emptyConfiguration());
 const [requirements, setRequirements] = useState({ printing: "", embroidery: "", branding: "", additional: "" });
 const [contact, setContact] = useState({ company: "", name: "", email: "", phone: "" });
 const [files, setFiles] = useState<File[]>([]);
 const [fileError, setFileError] = useState("");
 const [downloaded, setDownloaded] = useState(false);
 const dialog = useRef<HTMLDivElement>(null);
 const reducedMotion = useReducedMotion();
 const product = PRODUCTS.find(p => p.slug === config.slug);
 useEffect(() => {
  if (!open) return;
  setConfig(initial ? { ...initial, quantities: { ...initial.quantities }, sizes: [...initial.sizes] } : emptyConfiguration());
  setStep(0); setDownloaded(false); setFiles([]); setFileError("");
  const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const overflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  const focusTimer = window.setTimeout(() => dialog.current?.querySelector<HTMLElement>("button")?.focus(), 50);
  const keyboard = (event: KeyboardEvent) => {
   if (event.key === "Escape") { event.preventDefault(); onClose(); }
   if (event.key !== "Tab") return;
   const nodes = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select, textarea, a[href]');
   const focusable = Array.from(nodes ?? []).filter(el => el.getClientRects().length > 0);
   const first = focusable[0]; const last = focusable.at(-1);
   if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
   else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  document.addEventListener("keydown", keyboard);
  return () => { window.clearTimeout(focusTimer); document.body.style.overflow = overflow; document.removeEventListener("keydown", keyboard); previous?.focus(); };
 }, [open]);
 const valid = [!!product && !!config.fabric && !!config.gsm && !!config.color && (config.color !== "Custom" || !!config.customColor.trim()), validQuantities(config), !fileError, !!contact.company.trim() && !!contact.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) && !!contact.phone.trim(), true][step];
 const total = config.sizes.reduce((sum, size) => sum + (Number(config.quantities[size]) || 0), 0);
 const chooseFiles = (incoming: File[]) => {
  if (incoming.length > 10 || incoming.some(f => f.size > 20 * 1024 * 1024 || !/\.(pdf|png|jpe?g|ai)$/i.test(f.name))) { setFileError("Choose up to 10 AI, PDF, PNG or JPG files, each under 20 MB."); return; }
  setFileError(""); setFiles(incoming);
 };
 const download = () => {
  const text = ["ZEVRAE B2B — INQUIRY DRAFT (NOT SENT)", `Product: ${product?.name}`, `Fabric: ${config.fabric}`, `GSM: ${config.gsm}`, `Color: ${config.color}`, `Custom color: ${config.customColor || "—"}`, "SIZE REQUIREMENTS", ...config.sizes.map(s => `${s}: ${config.quantities[s]} units`), `Total: ${total} units`, "CUSTOMIZATION (AVAILABILITY TO BE CONFIRMED)", `Printing: ${requirements.printing || "—"}`, `Embroidery: ${requirements.embroidery || "—"}`, `Branding: ${requirements.branding || "—"}`, `Additional requirements: ${requirements.additional || "—"}`, "CONTACT", `Company / Brand: ${contact.company}`, `Contact: ${contact.name}`, `Email: ${contact.email}`, `Phone / WhatsApp: ${contact.phone}`, "REFERENCE FILES (ATTACH SEPARATELY)", ...files.map(f => f.name), "This draft has not been sent to ZEVRAE."].join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = `zevrae-${config.slug}-inquiry.txt`; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); setDownloaded(true);
 };
 return <AnimatePresence>{open && <motion.div ref={dialog} initial={reducedMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.5 }} className="fixed inset-0 z-[60] overflow-y-auto bg-background" role="dialog" aria-modal="true" aria-labelledby="quote-title">
  <div className="mx-auto flex min-h-full max-w-5xl flex-col px-6 py-8 md:px-10">
   <div className="flex items-center justify-between"><span className="font-expanded text-xl">Zevrae</span><Button variant="outline" size="icon" onClick={onClose} aria-label="Close"><X /></Button></div>
   <div className="mt-10 grid grid-cols-5 gap-1">{STEPS.map((s, i) => <div key={s}><div className={`h-px ${i <= step ? "bg-thread" : "bg-border"}`} /><p className={`tech mt-2 hidden md:block ${i === step ? "" : "text-muted-foreground"}`}>{String(i + 1).padStart(2, "0")} {s}</p></div>)}</div>
   <div className="flex-1 py-10"><p className="tech text-muted-foreground">Step {String(step + 1).padStart(2, "0")} / 05</p><h2 id="quote-title" className="font-expanded mt-4 text-3xl md:text-5xl">{["Configure your product", "Size-wise quantities", "Project requirements", "Your details", "Review inquiry"][step]}</h2>
   <div className="mt-10">
    {step === 0 && <div className="space-y-8"><label className="block"><span className="tech mb-3 block">Selected product</span><select aria-label="Selected product" className="catalogue-select" value={config.slug} onChange={e => setConfig(emptyConfiguration(e.target.value))}><option value="">Select product</option>{PRODUCTS.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>{product && <ProductSelectors product={product} value={config} onChange={setConfig} />}</div>}
    {step === 1 && <div><p className="mb-6 text-muted-foreground">{product?.name} / Units per size</p><div className="grid gap-5 sm:grid-cols-2">{product?.sizes.map(size => <label key={size} className="flex items-center gap-4 border-b py-3"><input type="checkbox" checked={config.sizes.includes(size)} aria-label={`Include ${size}`} onChange={e => setConfig({ ...config, sizes: e.target.checked ? [...config.sizes, size] : config.sizes.filter(s => s !== size) })} className="size-4 accent-foreground" /><span className="tech w-10">{size}</span><input type="number" min="1" max="1000000" step="1" disabled={!config.sizes.includes(size)} aria-label={`Quantity ${size}`} value={config.quantities[size] ?? ""} onChange={e => setConfig({ ...config, quantities: { ...config.quantities, [size]: e.target.value } })} className="catalogue-input min-w-0" placeholder="Units" /></label>)}</div><p className="tech mt-8">Total / {total} units</p><p className="mt-4 text-sm text-muted-foreground">Minimum order quantities require confirmation.</p></div>}
    {step === 2 && <div className="space-y-6"><p className="text-sm text-muted-foreground">Printing, embroidery and branding requests are subject to confirmation.</p>{([['printing', 'Printing requirements'], ['embroidery', 'Embroidery requirements'], ['branding', 'Branding / labels / packaging'], ['additional', 'Additional requirements']] as const).map(([key, title]) => <label key={key} className="block"><span className="tech mb-2 block">{title}</span><textarea aria-label={title} maxLength={2000} rows={2} value={requirements[key]} onChange={e => setRequirements({ ...requirements, [key]: e.target.value })} className="catalogue-input" /></label>)}<label onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); chooseFiles(Array.from(e.dataTransfer.files)); }} className="flex cursor-pointer flex-col items-center gap-4 border border-dashed p-8 text-center"><Upload className="size-6" /><span className="tech">Design / Reference files — optional</span><span className="text-sm text-muted-foreground">AI, PDF, PNG, JPG / up to 10 files, 20 MB each</span><input type="file" multiple accept=".ai,.pdf,.png,.jpg,.jpeg" aria-label="Design reference files" className="sr-only" onChange={e => chooseFiles(Array.from(e.target.files ?? []))} />{files.length > 0 && <ul className="w-full space-y-1 text-sm">{files.map((f, i) => <li key={`${f.name}-${i}`} className="break-all">{f.name}</li>)}</ul>}</label>{fileError && <p role="alert" className="text-destructive">{fileError}</p>}</div>}
    {step === 3 && <div className="grid gap-6 md:grid-cols-2">{([['company', 'Company / Brand'], ['name', 'Contact person'], ['email', 'Email address'], ['phone', 'Phone / WhatsApp']] as const).map(([key, title]) => <label key={key} className="block"><span className="tech mb-2 block">{title} *</span><input aria-label={title} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} required autoComplete={key === 'company' ? 'organization' : key === 'phone' ? 'tel' : key} value={contact[key]} maxLength={200} onChange={e => setContact({ ...contact, [key]: e.target.value })} className="catalogue-input" /></label>)}</div>}
    {step === 4 && <div className="space-y-7"><dl className="divide-y border-y">{[['Product', product?.name], ['Fabric', config.fabric], ['GSM', config.gsm], ['Color', config.color === 'Custom' ? `Custom — ${config.customColor}` : config.color], ['Size quantities', config.sizes.map(s => `${s}: ${config.quantities[s]}`).join(' / ')], ['Total units', total], ['Company', contact.company], ['Contact', `${contact.name} / ${contact.email} / ${contact.phone}`], ['Printing', requirements.printing || '—'], ['Embroidery', requirements.embroidery || '—'], ['Branding', requirements.branding || '—'], ['Additional requirements', requirements.additional || '—'], ['Reference files', files.map(f => f.name).join(', ') || 'None']].map(([k,v]) => <div key={k} className="grid gap-2 py-4 md:grid-cols-[180px_1fr]"><dt className="tech text-muted-foreground">{k}</dt><dd className="break-words">{v}</dd></div>)}</dl><p className="text-muted-foreground">Online submission is not connected. Download this inquiry draft; it has not been sent to ZEVRAE. Reference files must be attached separately.</p>{downloaded && <div role="status" className="flex items-start gap-3 border-t pt-5"><Check className="size-5 shrink-0" /><p>Inquiry draft downloaded — not sent to ZEVRAE.</p></div>}</div>}
   </div></div>
   <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6"><Button variant="industrial-ghost" size="xl" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>{step < 4 ? <Button variant="industrial" size="xl" disabled={!valid} onClick={() => { setStep(step + 1); dialog.current?.scrollTo({ top: 0 }); }}>Continue →</Button> : <Button variant="industrial" size="xl" onClick={download}><Download />Download inquiry</Button>}</div>
  </div>
 </motion.div>}</AnimatePresence>;
}
