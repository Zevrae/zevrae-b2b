import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import factory from "@/assets/factory.jpg";
import label from "@/assets/label.jpg";
import cut from "@/assets/cut.jpg";
import pack from "@/assets/pack.jpg";

type Open = { onStart: () => void };

export function Nav({ onStart }: Open) {
  const [show, setShow] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const links = [
    ["Capabilities", "#capabilities"],
    ["Products", "/products"],
    ["Private label", "#capabilities"],
    ["Process", "#process"],
    ["Reviews", "#reviews"],
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b bg-background/85 backdrop-blur-md transition-transform duration-500 ${show ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav className="flex h-16 items-center justify-between px-4 sm:px-6 md:px-16">
        <a href="#top" className="font-expanded text-xl tracking-tight">
          Zevrae
        </a>

        {/* Desktop nav links */}
        <div className="tech hidden gap-8 md:flex">
          {links.map(([l, h]) =>
            h === "/products" ? (
              <Link
                key={l}
                to="/products"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {l}
              </Link>
            ) : (
              <a
                key={l}
                href={h}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {l}
              </a>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="industrial" size="sm" onClick={onStart} className="text-xs">
            Start a project
          </Button>

          {/* Mobile hamburger menu button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-accent md:hidden"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b bg-background/95 px-4 py-5 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col gap-4">
              {links.map(([l, h]) =>
                h === "/products" ? (
                  <Link
                    key={l}
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-expanded text-lg text-foreground/90 transition-colors hover:text-foreground"
                  >
                    {l}
                  </Link>
                ) : (
                  <a
                    key={l}
                    href={h}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-expanded text-lg text-foreground/90 transition-colors hover:text-foreground"
                  >
                    {l}
                  </a>
                ),
              )}
              <div className="pt-2">
                <Button
                  variant="industrial"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onStart();
                  }}
                >
                  Start a project →
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function ScrollThread() {
  const { scrollYProgress } = useScroll();
  return (
    <div
      className="pointer-events-none fixed right-2 top-0 z-50 h-screen w-px bg-border sm:right-3 md:right-6"
      aria-hidden
    >
      <motion.div
        style={{ scaleY: scrollYProgress, originY: 0 }}
        className="thread-glow h-full w-px bg-thread"
      />
    </div>
  );
}

export function Reveal({ onStart }: Open) {
  return (
    <section className="relative border-b px-4 py-16 sm:px-6 sm:py-24 md:px-16 md:py-48">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
        className="font-expanded text-5xl sm:text-7xl md:text-[8.5vw] leading-[0.92]"
      >
        Your brand.
        <br />
        <span className="text-muted-foreground">Our production.</span>
      </motion.h2>
      <div className="mt-10 sm:mt-14 grid gap-8 md:grid-cols-12">
        <p className="text-base text-muted-foreground sm:text-lg md:col-span-5 md:text-xl">
          Custom apparel manufacturing, private label production and bulk apparel solutions for
          modern brands.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:col-span-7 md:justify-end">
          <Button variant="industrial" size="xl" className="w-full sm:w-auto" onClick={onStart}>
            Start a project
          </Button>
          <Button variant="industrial-ghost" size="xl" className="w-full sm:w-auto" asChild>
            <Link to="/products">View catalogue</Link>
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
    { n: 4, sfx: "", l: "Product categories" },
    { n: 5, sfx: "", l: "Available sizes" },
    { n: 3, sfx: "", l: "Fabric options" },
    { n: 4, sfx: "", l: "GSM options" },
  ];
  return (
    <div className="mt-14 sm:mt-20 md:mt-24 grid grid-cols-2 border-t md:grid-cols-4">
      {s.map((x, i) => (
        <div
          key={x.l}
          className={`p-4 sm:p-6 ${
            i % 2 === 0 ? "border-r" : ""
          } ${i < 2 ? "border-b md:border-b-0" : ""} md:border-r md:last:border-r-0`}
        >
          <p className="font-expanded text-4xl sm:text-5xl">
            <Counter to={x.n} suffix={x.sfx} />
          </p>
          <p className="tech mt-2 sm:mt-3 text-[11px] sm:text-xs text-muted-foreground">{x.l}</p>
        </div>
      ))}
    </div>
  );
}

const CAPS = [
  {
    n: "01",
    t: "Bulk apparel",
    d: "High-volume production for brands, retailers and organizations.",
    img: factory,
  },
  {
    n: "02",
    t: "Private label",
    d: "Your branding, labels, packaging and specifications.",
    img: label,
  },
  {
    n: "03",
    t: "Custom manufacturing",
    d: "Turn your designs and requirements into finished products.",
    img: cut,
  },
  {
    n: "04",
    t: "Corporate & events",
    d: "Bulk apparel and merchandise for companies, colleges and events.",
    img: pack,
  },
];

export function Capabilities() {
  const [active, setActive] = useState(0);
  return (
    <section id="capabilities" className="px-4 py-16 sm:px-6 sm:py-24 md:px-16 md:py-32">
      <div className="flex items-end justify-between">
        <h2 className="font-expanded text-4xl sm:text-6xl md:text-[6vw]">What we build</h2>
        <p className="tech hidden text-muted-foreground md:block">Capabilities / 04</p>
      </div>
      <div className="mt-10 sm:mt-16 grid gap-10 md:grid-cols-12">
        <ul className="md:col-span-7">
          {CAPS.map((c, i) => (
            <li
              key={c.t}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className="hairline-x group cursor-pointer border-t py-6 sm:py-8 last:border-b"
            >
              <div className="flex items-baseline gap-4 sm:gap-6">
                <span className="tech text-muted-foreground">{c.n}</span>
                <div>
                  <h3
                    className={`font-expanded text-2xl transition-all duration-300 sm:text-3xl md:text-5xl ${
                      active === i
                        ? "text-foreground translate-x-2 sm:translate-x-3"
                        : "text-muted-foreground"
                    }`}
                  >
                    {c.t}
                  </h3>
                  <p className="mt-2 sm:mt-3 max-w-md text-sm sm:text-base text-muted-foreground">
                    {c.d}
                  </p>
                </div>
              </div>
              <img
                src={c.img}
                alt={c.t}
                loading="lazy"
                className={`mt-4 aspect-video w-full object-cover transition-opacity duration-300 md:hidden ${
                  active === i ? "opacity-100" : "opacity-60"
                }`}
              />
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
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            />
          ))}
          <span className="tech absolute bottom-4 left-4 bg-background px-2 py-1">
            {CAPS[active]?.n} / {CAPS[active]?.t}
          </span>
        </div>
      </div>
    </section>
  );
}

type FinaleProps = {
  onContact?: () => void;
  onStart?: () => void;
};

export function Finale({ onContact, onStart }: FinaleProps) {
  return (
    <section className="bg-bone px-4 py-16 sm:px-6 sm:py-24 text-bone-foreground md:px-16 md:py-48">
      <h2 className="font-expanded text-4xl sm:text-6xl md:text-[8vw] leading-tight">
        You have the idea.
        <br />
        We build the product.
      </h2>
      <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <p className="tech text-xs sm:text-sm">
          One thread → One garment → One brand → Endless possibilities
        </p>
        <button
          onClick={onContact ?? onStart}
          className="btn-industrial h-12 sm:h-14 w-full sm:w-auto rounded-none border-bone-foreground bg-bone-foreground px-8 font-mono text-xs uppercase tracking-[0.2em] text-bone before:bg-bone hover:text-bone-foreground"
        >
          Contact Us →
        </button>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="tech flex flex-col justify-between gap-4 border-t px-4 py-8 text-muted-foreground sm:px-6 md:flex-row md:px-16 md:py-10">
      <span className="font-expanded text-base text-foreground">Zevrae</span>
      <span>Apparel manufacturing / Private label / B2B</span>
      <span>© {new Date().getFullYear()} Zevrae</span>
    </footer>
  );
}
