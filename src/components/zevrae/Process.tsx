import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import fabric from "@/assets/fabric.jpg";
import cut from "@/assets/cut.jpg";
import tee from "@/assets/tee.jpg";
import label from "@/assets/label.jpg";
import pack from "@/assets/pack.jpg";
import factory from "@/assets/factory.jpg";

const STAGES = [
  { n: "01", name: "Fabric", img: fabric, specs: ["Material — 100% Combed cotton", "GSM — 180 / 240 / 320", "Color — Dyed to Pantone", "Quality — Pre-shrunk, bio-washed"] },
  { n: "02", name: "Cut", img: cut, specs: ["Pattern — Graded XS–3XL", "Method — Automated + hand", "Tolerance — ±2mm", "Pieces — Body / Sleeve / Rib"] },
  { n: "03", name: "Print", img: tee, specs: ["DTF", "DTG", "Screen", "Embroidery"] },
  { n: "04", name: "Build", img: tee, specs: ["Sleeves", "Body", "Collar", "Stitching / Labels"] },
  { n: "05", name: "Brand", img: label, specs: ["Custom labels", "Hang tags", "Packaging", "Custom prints"] },
  { n: "06", name: "Pack", img: pack, specs: ["Fold", "Poly / Box", "Barcode", "Dispatch"] },
];

const THREAD =
  "M -50 120 C 200 80, 300 300, 520 260 S 900 80, 1050 300 S 1300 620, 980 700 S 420 520, 360 760 S 700 980, 1500 860";
const TEE =
  "M 620 330 L 680 300 Q 720 330 760 300 L 820 330 L 880 400 L 840 430 L 810 405 L 810 640 L 630 640 L 630 405 L 600 430 L 560 400 Z";

function StageLayer({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const s = i / STAGES.length;
  const e = (i + 1) / STAGES.length;
  const opacity = useTransform(progress, [s - 0.04, s + 0.02, e - 0.02, e + 0.04], [0, 1, 1, 0]);
  const scale = useTransform(progress, [s, e], [1.12, 1]);
  const st = STAGES[i];
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.img
        src={st.img}
        alt={`${st.name} stage`}
        loading="lazy"
        style={{ scale }}
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/70" />
      <div className="absolute bottom-16 left-6 md:left-16">
        <p className="tech text-muted-foreground">Stage {st.n} / 06</p>
        <h2 className="font-expanded mt-3 text-[16vw] md:text-[10vw]">{st.name}</h2>
      </div>
      <ul className="tech absolute right-6 top-28 space-y-3 text-right text-muted-foreground md:right-16">
        <li className="text-foreground">{st.name} / {st.n}</li>
        {st.specs.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const stageProgress = useTransform(scrollYProgress, [0, 0.86], [0, 1]);
  const thread = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const teeDraw = useTransform(scrollYProgress, [0.5, 0.66], [0, 1]);
  const teeOpacity = useTransform(scrollYProgress, [0.33, 0.5, 0.66, 0.7], [0, 1, 1, 0]);
  const printW = useTransform(scrollYProgress, [0.36, 0.48], [0, 1]);
  const reveal = useTransform(scrollYProgress, [0.86, 1], [0, 1]);
  const factoryScale = useTransform(scrollYProgress, [0.86, 1], [2.4, 1]);
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(Math.round(v * 100)));

  return (
    <section id="process" ref={ref} className="relative h-[800vh]">
      <div className="grain sticky top-0 h-screen overflow-hidden">
        {STAGES.map((_, i) => (
          <StageLayer key={i} i={i} progress={stageProgress} />
        ))}

        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <motion.path d={THREAD} fill="none" stroke="var(--thread)" strokeWidth="1.4" className="thread-glow" style={{ pathLength: thread }} />
          <motion.g style={{ opacity: teeOpacity }}>
            <motion.path d={TEE} fill="none" stroke="var(--thread)" strokeWidth="1.2" strokeDasharray="6 5" style={{ pathLength: teeDraw }} />
            <motion.rect x="670" y="440" height="70" width="100" fill="none" stroke="var(--thread)" strokeWidth="1" style={{ scaleX: printW, originX: 0 }} />
            <motion.text x="720" y="484" textAnchor="middle" fill="var(--thread)" style={{ opacity: printW, fontFamily: "var(--font-display)", fontWeight: 800, fontStretch: "125%", fontSize: 18 }}>
              ZEVRAE
            </motion.text>
          </motion.g>
        </svg>

        <motion.div style={{ opacity: reveal }} className="absolute inset-0 bg-background">
          <motion.img src={factory} alt="ZEVRAE production floor" loading="lazy" style={{ scale: factoryScale }} className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
          <p className="tech absolute bottom-10 left-6 text-muted-foreground md:left-16">Facility / 01 — 240 machines / 1.2M units yearly</p>
        </motion.div>

        <div className="tech absolute left-6 top-28 text-muted-foreground md:left-16">
          <span className="text-foreground">{String(pct).padStart(3, "0")}</span> / 100 — Follow the thread
        </div>
      </div>
    </section>
  );
}
