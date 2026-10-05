import { useEffect, useState, type MouseEvent } from "react";
import { motion, useScroll } from "motion/react";
import { Button } from "@/components/ui/button";
import factory from "@/assets/factory.jpg";
import label from "@/assets/label.jpg";
import cut from "@/assets/cut.jpg";
import pack from "@/assets/pack.jpg";
import tee from "@/assets/tee.jpg";
import hoodie from "@/assets/hoodie.jpg";
import jacket from "@/assets/jacket.jpg";
import fabric from "@/assets/fabric.jpg";

type Open = { onStart: () => void };

export function Nav({ onStart }: Open) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [
    ["Capabilities", "#capabilities"],
    ["Products", "#products"],
    ["Private label", "#capabilities"],
    ["Process", "#process"],
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b bg-background/80 backdrop-blur-md transition-transform duration-500 ${show ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav className="flex h-16 items-center justify-between px-6 md:px-16">
        <a href="#top" className="font-expanded text-xl">Zevrae</a>
        <div className="tech hidden gap-8 md:flex">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="text-muted-foreground transition-colors hover:text-foreground">{l}</a>
          ))}
        </div>
        <Button variant="industrial" size="sm" onClick={onStart}>Start a project</Button>
      </nav>
    </header>
  );
}

export function ScrollThread() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="pointer-events-none fixed right-3 top-0 z-50 h-screen w-px bg-border md:right-6" aria-hidden>
      <motion.div style={{ scaleY: scrollYProgress, originY: 0 }} className="thread-glow h-full w-px bg-thread" />
    </div>
  );
}

export function Reveal({ onStart }: Open) {
  return (
    <section className="relative border-b px-6 py-32 md:px-16 md:py-48">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
        className="font-expanded text-[12vw] md:text-[8.5vw]"
      >
        Your brand.
        <br />
        <span className="text-muted-foreground">Our production.</span>
      </motion.h2>
      <div className="mt-14 grid gap-10 md:grid-cols-12">
        <p className="text-lg text-muted-foreground md:col-span-5 md:text-xl">
          Custom apparel manufacturing, private label production and bulk apparel solutions for modern brands.
        </p>
        <div className="flex flex-wrap gap-4 md:col-span-7 md:justify-end">
          <Button variant="industrial" size="xl" onClick={onStart}>Start a project</Button>
          <Button variant="industrial-ghost" size="xl" asChild>
            <a href="#products">View catalogue</a>
          </Button>
        </div>
      </div>
      <Stats />
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!go) return;
    let raf = 0;
    const s = performance.now();
    const tick = (n: number) => {
      const p = Math.min(1, (n - s) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, to]);
  return (
    <motion.span onViewportEnter={() => setGo(true)} viewport={{ once: true }}>
      {v.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

function Stats() {
  const s = [
    { n: 50, sfx: "", l: "Minimum order qty" },
    { n: 240, sfx: "", l: "Production machines" },
    { n: 21, sfx: "", l: "Days avg. lead time" },
    { n: 380, sfx: "+", l: "Brands produced" },
  ];
  return (
    <div className="mt-24 grid grid-cols-2 border-t md:grid-cols-4">
      {s.map((x) => (
        <div key={x.l} className="border-b border-r p-6 last:border-r-0 md:border-b-0">
          <p className="font-expanded text-5xl"><Counter to={x.n} suffix={x.sfx} /></p>
          <p className="tech mt-3 text-muted-foreground">{x.l}</p>
        </div>
      ))}
    </div>
  );
}

const CAPS = [
  { n: "01", t: "Bulk apparel", d: "High-volume production for brands, retailers and organizations.", img: factory },
  { n: "02", t: "Private label", d: "Your branding, labels, packaging and specifications.", img: label },
  { n: "03", t: "Custom manufacturing", d: "Turn your designs and requirements into finished products.", img: cut },
  { n: "04", t: "Corporate & events", d: "Bulk apparel and merchandise for companies, colleges and events.", img: pack },
];

export function Capabilities() {
  const [active, setActive] = useState(0);
  return (
    <section id="capabilities" className="px-6 py-32 md:px-16">
      <div className="flex items-end justify-between">
        <h2 className="font-expanded text-[11vw] md:text-[6vw]">What we build</h2>
        <p className="tech hidden text-muted-foreground md:block">Capabilities / 04</p>
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-12">
        <ul className="md:col-span-7">
          {CAPS.map((c, i) => (
            <li
              key={c.t}
              onMouseEnter={() => setActive(i)}
              className="hairline-x group cursor-default border-t py-8 last:border-b"
            >
              <div className="flex items-baseline gap-6">
                <span className="tech text-muted-foreground">{c.n}</span>
                <div>
                  <h3 className={`font-expanded text-3xl transition-all duration-500 md:text-5xl ${active === i ? "translate-x-3" : "text-muted-foreground"}`}>{c.t}</h3>
                  <p className="mt-3 max-w-md text-muted-foreground">{c.d}</p>
                </div>
              </div>
              <img src={c.img} alt={c.t} loading="lazy" className="mt-6 aspect-video w-full object-cover md:hidden" />
            </li>
          ))}
        </ul>
        <div className="relative hidden aspect-[4/5] overflow-hidden md:col-span-5 md:block">
          {CAPS.map((c, i) => (
            <img
              key={c.t}
              src={c.img}
              alt={c.t}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
            />
          ))}
          <span className="tech absolute bottom-4 left-4 bg-background px-2 py-1">{CAPS[active]!.n} / {CAPS[active]!.t}</span>
        </div>
      </div>
    </section>
  );
}

const PRODUCTS = [
  { t: "T-Shirt", img: tee, specs: ["180 GSM", "Combed cotton", "MOQ 100", "Custom print available"] },
  { t: "Oversized T-Shirt", img: tee, specs: ["240 GSM", "Cotton", "MOQ 50", "Custom print available"] },
  { t: "Hoodie", img: hoodie, specs: ["400 GSM", "Brushed fleece", "MOQ 50", "Embroidery available"] },
  { t: "Sweatshirt", img: hoodie, specs: ["340 GSM", "French terry", "MOQ 50", "Custom print available"] },
  { t: "Lower / Track Pants", img: jacket, specs: ["320 GSM", "Cotton / Poly", "MOQ 100", "Custom trims"] },
  { t: "Jacket", img: jacket, specs: ["Nylon shell", "Lined", "MOQ 100", "Custom hardware"] },
  { t: "Custom Apparel", img: fabric, specs: ["Your spec", "Any fabric", "MOQ on request", "Full development"] },
];

function ProductRow({ p, i, onStart }: { p: (typeof PRODUCTS)[number]; i: number; onStart: () => void }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 14, y: ((e.clientY - r.top) / r.height - 0.5) * 14 });
  };
  const flip = i % 2 === 1;
  return (
    <article className="grid items-center gap-10 border-t py-16 md:grid-cols-12">
      <div
        onMouseMove={move}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className={`group relative aspect-[4/5] overflow-hidden bg-card md:col-span-6 ${flip ? "md:order-2 md:col-start-7" : ""}`}
      >
        <img
          src={p.img}
          alt={p.t}
          loading="lazy"
          style={{ transform: `translate(${tilt.x}px, ${tilt.y}px) scale(1.06)` }}
          className="h-full w-full object-cover transition-transform duration-300 ease-out"
        />
        <span className="font-expanded pointer-events-none absolute inset-0 flex items-center justify-center text-4xl text-foreground/0 transition-colors duration-500 group-hover:text-foreground/90 mix-blend-difference">
          Your brand
        </span>
      </div>
      <div className={`md:col-span-5 ${flip ? "md:order-1" : "md:col-start-8"}`}>
        <p className="tech text-muted-foreground">{String(i + 1).padStart(2, "0")} / {p.t}</p>
        <h3 className="font-expanded mt-4 text-4xl md:text-6xl">{p.t}</h3>
        <dl className="tech mt-10 border-t">
          {p.specs.map((s) => (
            <div key={s} className="flex justify-between border-b py-3">
              <dt className="text-muted-foreground">—</dt>
              <dd>{s}</dd>
            </div>
          ))}
        </dl>
        <Button variant="industrial" size="xl" className="mt-10" onClick={onStart}>Request quote</Button>
      </div>
    </article>
  );
}

export function Catalogue({ onStart }: Open) {
  return (
    <section id="products" className="bg-background px-6 py-32 md:px-16">
      <div className="flex items-end justify-between pb-10">
        <h2 className="font-expanded text-[11vw] md:text-[6vw]">Catalogue</h2>
        <p className="tech text-muted-foreground">Blanks / 07</p>
      </div>
      {PRODUCTS.map((p, i) => (
        <ProductRow key={p.t} p={p} i={i} onStart={onStart} />
      ))}
    </section>
  );
}

export function Finale({ onStart }: Open) {
  return (
    <section className="bg-bone px-6 py-32 text-bone-foreground md:px-16 md:py-48">
      <h2 className="font-expanded text-[11vw] md:text-[8vw]">
        You have the idea.
        <br />
        We build the product.
      </h2>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-6">
        <p className="tech">One thread → One garment → One brand → Endless possibilities</p>
        <button
          onClick={onStart}
          className="btn-industrial h-14 rounded-none border-bone-foreground bg-bone-foreground px-8 font-mono text-xs uppercase tracking-[0.2em] text-bone before:bg-bone hover:text-bone-foreground"
        >
          Start a project →
        </button>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="tech flex flex-col justify-between gap-4 border-t px-6 py-10 text-muted-foreground md:flex-row md:px-16">
      <span className="font-expanded text-base text-foreground">Zevrae</span>
      <span>Apparel manufacturing / Private label / B2B</span>
      <span>© {new Date().getFullYear()} Zevrae</span>
    </footer>
  );
}
