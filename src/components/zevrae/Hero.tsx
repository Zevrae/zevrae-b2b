import { useEffect, useRef } from "react";

export function Hero() {
  const pathRef = useRef<SVGPathElement>(null);
  const shadowRef = useRef<SVGPathElement>(null);

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
    <section className="grain relative h-screen w-full overflow-hidden bg-background">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
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
        <path ref={shadowRef} fill="none" stroke="var(--thread)" strokeOpacity="0.07" strokeWidth="9" transform="translate(0 26)" style={{ filter: "blur(6px)" }} />
        <path ref={pathRef} fill="none" stroke="url(#threadFade)" strokeWidth="1.3" className="thread-glow" />
      </svg>

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16 animate-fade-in [animation-duration:1.6s]">
        <h1 className="font-expanded text-[19vw] md:text-[13vw]">Zevrae</h1>
        <p className="tech mt-6 text-muted-foreground">Apparel manufacturing / Private label / B2B</p>
        <p className="mt-10 font-display text-lg font-semibold uppercase leading-tight tracking-wide md:text-2xl">
          One thread.
          <br />
          Endless possibilities.
        </p>
      </div>

      <div className="tech absolute bottom-8 left-6 right-6 z-10 flex justify-between text-muted-foreground md:left-16 md:right-16">
        <span>Follow the thread ↓</span>
        <span className="hidden md:inline">EST. MFG / 00</span>
      </div>
    </section>
  );
}
