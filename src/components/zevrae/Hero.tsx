import { useEffect, useRef, useState } from "react";
import fittedHero from "@/assets/fitted-hero.webp";
import hoodiesHero from "@/assets/hoodies-hero.webp";
import oversizedHero from "@/assets/oversized-hero.webp";
import poloHero from "@/assets/polo-hero.webp";

const HERO_IMAGES = [fittedHero, hoodiesHero, oversizedHero, poloHero];
const CYCLE_MS = 4500;

export function Hero() {
  const pathRef = useRef<SVGPathElement>(null);
  const shadowRef = useRef<SVGPathElement>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Auto-cycle images
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setImgIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  // Thread animation
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 720, y: 520, tx: 720, ty: 520 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 1440;
      mouse.ty = (e.clientY / window.innerHeight) * 900;
    };
    window.addEventListener("pointermove", onMove);
    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const t = (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const pts: string[] = [];
      for (let i = 0; i <= 60; i++) {
        const x = -40 + (i / 60) * 1520;
        const base = 600 + Math.sin(i * 0.11 + t * 0.5) * 38 + Math.sin(i * 0.05 - t * 0.3) * 60;
        const d = Math.exp(-((x - mouse.x) ** 2) / 60000);
        const y = base + (mouse.y - base) * d * 0.18;
        pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
      }
      const d = pts.join(" ");
      pathRef.current?.setAttribute("d", d);
      shadowRef.current?.setAttribute("d", d);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section className="grain relative h-screen w-full overflow-hidden bg-black">
      {/* ── Campaign image background – auto-cycling ── */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{
            opacity: visible && i === imgIndex ? 1 : 0,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            /* dark overlay + bottom-fade so wordmark stays crisp */
            /* layer: image at 22% opacity, then gradient to black at top/bottom */
          }}
        />
      ))}

      {/* ── Multi-layer overlay: preserves text legibility ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom,
              rgba(0,0,0,0.72) 0%,
              rgba(0,0,0,0.48) 35%,
              rgba(0,0,0,0.42) 60%,
              rgba(0,0,0,0.82) 100%
            )
          `,
        }}
      />
      {/* Image opacity clamp — applied via mix-blend on the images above */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.56)", mixBlendMode: "multiply" }}
      />

      {/* ── Thread SVG — sits above overlays, below text ── */}
      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="threadFade" x1="0" x2="1">
            <stop offset="0" stopColor="var(--thread)" stopOpacity="0" />
            <stop offset="0.25" stopColor="var(--thread)" stopOpacity="1" />
            <stop offset="0.8" stopColor="var(--thread)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--thread)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          ref={shadowRef}
          fill="none"
          stroke="var(--thread)"
          strokeOpacity="0.07"
          strokeWidth="9"
          transform="translate(0 26)"
          style={{ filter: "blur(6px)" }}
        />
        <path
          ref={pathRef}
          fill="none"
          stroke="url(#threadFade)"
          strokeWidth="1.3"
          className="thread-glow"
        />
      </svg>

      {/* ── Hero text ── */}
      <div
        className="relative z-20 flex h-full flex-col justify-center px-4 sm:px-6 md:px-16 animate-fade-in [animation-duration:1.6s]"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease" }}
      >
        <h1 className="font-expanded text-[17vw] sm:text-[15vw] md:text-[13vw] leading-none">
          Zevrae
        </h1>
        <p className="tech mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
          Apparel manufacturing / Private label / B2B
        </p>
        <p className="mt-6 sm:mt-10 font-display text-base sm:text-xl md:text-2xl font-semibold uppercase leading-tight tracking-wide">
          One thread.
          <br />
          Endless possibilities.
        </p>
      </div>

      {/* ── Bottom labels ── */}
      <div className="tech absolute bottom-12 sm:bottom-8 left-4 right-4 sm:left-6 sm:right-6 md:left-16 md:right-16 z-20 flex justify-between text-muted-foreground">
        <span className="text-[11px] sm:text-xs">Follow the thread ↓</span>
        <span className="hidden md:inline">EST. MFG / 00</span>
      </div>

      {/* ── Image cycle indicator dots ── */}
      <div
        className="absolute bottom-5 sm:bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2"
        aria-hidden
      >
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setImgIndex(i)}
            aria-label={`Hero image ${i + 1}`}
            className="h-1 sm:h-px transition-all duration-500 rounded-full"
            style={{
              width: i === imgIndex ? "1.75rem" : "0.5rem",
              background: i === imgIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
