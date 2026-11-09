"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { processSteps } from "@/content/process";
import SectionHeading from "@/components/ui/SectionHeading";

const EASE = [0.22, 1, 0.36, 1] as const;

const LAYERS = [
  { from: 3, label: "Elementenverharding", color: "#9aa0a6" },
  { from: 3, label: "Straatlaag", color: "#c8b78e" },
  { from: 2, label: "Funderingslaag", color: "#7c7d79" },
  { from: 2, label: "Zandbed", color: "#d9c08a" },
  { from: 2, label: "Riolering (PVC)", color: "#e9e6df" },
];

export default function Process() {
  const [step, setStep] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step));
        });
      },
      // Op mobiel staat de doorsnede sticky bovenin: activeer stappen lager in beeld.
      { rootMargin: window.matchMedia("(min-width: 1024px)").matches ? "-48% 0px -48% 0px" : "-62% 0px -34% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="werkwijze" aria-labelledby="werkwijze-titel" className="relative bg-ink py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Onze werkwijze"
          id="werkwijze-titel"
          title={
            <>
              Laag voor laag <span className="text-accent">naar een weg die blijft.</span>
            </>
          }
          intro={
            <p>
              Een goede weg zie je aan de bovenkant, maar maak je aan de onderkant. Scroll door de vijf stappen waarmee
              wij elk project opbouwen.
            </p>
          }
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Doorsnede */}
          <div className="sticky top-[4.5rem] z-20 -mx-5 self-start bg-ink/90 px-5 pb-4 pt-2 backdrop-blur sm:mx-0 sm:px-0 lg:top-28 lg:col-span-7 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-char">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <span className="eyebrow hidden text-white/50 sm:inline">Doorsnede</span>
                <span className="eyebrow text-accent">
                  Stap {processSteps[step].number} — {processSteps[step].title}
                </span>
              </div>
              <CrossSection step={step} />
              <ul className="hidden flex-wrap gap-2 border-t border-white/10 px-5 py-4 sm:flex" aria-label="Opbouw van de weg">
                {LAYERS.map((l) => {
                  const on = step >= l.from;
                  return (
                    <li
                      key={l.label}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-500 ${
                        on ? "border-white/20 text-white/85" : "border-white/5 text-white/25"
                      }`}
                    >
                      <span className="size-2.5 rounded-sm" style={{ background: on ? l.color : "rgba(255,255,255,0.1)" }} />
                      {l.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Stappen */}
          <ol className="relative lg:col-span-5">
            <div aria-hidden className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-white/10">
              <motion.div
                className="w-full origin-top bg-accent"
                style={{ height: "100%" }}
                animate={{ scaleY: (step + 1) / processSteps.length }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
            {processSteps.map((s, i) => {
              const isActive = i === step;
              return (
                <li
                  key={s.id}
                  data-step={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className="relative flex min-h-[48vh] gap-6 py-8 lg:min-h-[62vh] lg:items-center"
                >
                  <span
                    className={`relative z-10 grid size-[2.35rem] shrink-0 place-items-center rounded-full border font-mono text-xs transition-all duration-500 ${
                      i <= step ? "border-accent bg-accent text-ink" : "border-white/20 bg-ink text-white/50"
                    }`}
                  >
                    {s.number}
                  </span>
                  <div className={`transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-40"}`}>
                    <p className="eyebrow text-accent">{s.kicker}</p>
                    <h3 className="mt-2 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-none tracking-tight [font-stretch:110%]">
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-white/70">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Geanimeerde doorsnede van de wegopbouw                                     */
/* -------------------------------------------------------------------------- */

function CrossSection({ step }: { step: number }) {
  const reduce = useReducedMotion();
  const t = (delay = 0) => (reduce ? { duration: 0 } : { duration: 0.7, delay, ease: EASE });
  const stones = Array.from({ length: 15 }, (_, i) => 126 + i * 36.5);

  return (
    <svg viewBox="0 0 800 400" className="block h-auto w-full" role="img" aria-label={`Doorsnede van de weg tijdens stap: ${processSteps[step].title}`}>
      <defs>
        <pattern id="soil" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#4a3a2b" />
          <circle cx="3" cy="4" r="1" fill="#5d4a37" />
          <circle cx="10" cy="10" r="1.2" fill="#3d2f22" />
        </pattern>
        <pattern id="gravel" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#7c7d79" />
          <circle cx="3" cy="3" r="1.6" fill="#94958f" />
          <circle cx="8" cy="7" r="1.3" fill="#686964" />
        </pattern>
        <pattern id="sand" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#d9c08a" />
          <circle cx="2" cy="2" r="0.7" fill="#c4a96f" />
          <circle cx="6" cy="6" r="0.6" fill="#e6d3a5" />
        </pattern>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1e22" />
          <stop offset="1" stopColor="#26292e" />
        </linearGradient>
      </defs>

      {/* Lucht en maatlijnen */}
      <rect width="800" height="190" fill="url(#sky)" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="190" stroke="rgba(255,255,255,0.035)" />
      ))}
      <motion.circle
        cx="660"
        cy="70"
        r="26"
        fill="#ff6a13"
        initial={false}
        animate={{ opacity: step === 4 ? 0.9 : 0.12, cy: step === 4 ? 60 : 90 }}
        transition={t()}
      />

      {/* Grond */}
      <rect y="190" width="800" height="210" fill="url(#soil)" />

      {/* Uitgegraven sleuf */}
      <motion.rect
        x="100" y="190" width="600" height="170" fill="#21180f"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={t()}
      />
      <motion.rect
        x="100" y="190" width="600" height="170" fill="url(#soil)"
        style={{ originY: 1 }}
        initial={false}
        animate={{ scaleY: step >= 1 ? 0 : 1 }}
        transition={t(0.1)}
      />

      {/* Oude, gescheurde verharding */}
      <motion.g initial={false} animate={{ opacity: step === 0 ? 1 : 0, y: step === 0 ? 0 : -10 }} transition={t()}>
        <rect x="60" y="178" width="680" height="12" fill="#55585c" />
        <path d="M180 178l8 6-5 6M330 178l-6 5 9 7M470 178l5 7-7 5M610 178l-4 6 6 6" stroke="#2b2d30" strokeWidth="2" fill="none" />
      </motion.g>

      {/* Stap 1: uitzetten */}
      <motion.g initial={false} animate={{ opacity: step === 0 ? 1 : 0 }} transition={t()}>
        <line x1="100" y1="120" x2="100" y2="190" stroke="#e9e6df" strokeWidth="3" />
        <rect x="95" y="112" width="10" height="12" fill="#ff6a13" />
        <line x1="700" y1="120" x2="700" y2="190" stroke="#e9e6df" strokeWidth="3" />
        <rect x="695" y="112" width="10" height="12" fill="#ff6a13" />
        <line x1="100" y1="132" x2="700" y2="132" stroke="#ff6a13" strokeWidth="1.5" strokeDasharray="8 6" />
        <text x="400" y="122" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="13" fontFamily="var(--font-plex-mono)" letterSpacing="2">
          UITZETTEN &amp; VOORONDERZOEK
        </text>
      </motion.g>

      {/* Stap 3: riool, zandbed, fundering */}
      <motion.rect x="100" y="290" width="600" height="70" fill="url(#sand)"
        initial={false} animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 30 }} transition={t(0.05)} />
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.6 }} transition={t(0)}>
        <circle cx="400" cy="325" r="24" fill="#3a3f45" stroke="#e9e6df" strokeWidth="5" />
        <circle cx="400" cy="325" r="12" fill="#1b1e22" />
      </motion.g>
      <motion.rect x="100" y="246" width="600" height="44" fill="url(#gravel)"
        initial={false} animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 30 }} transition={t(0.2)} />
      {/* verdichting-indicator */}
      <motion.g initial={false} animate={{ opacity: step === 2 ? 1 : 0 }} transition={t(0.3)}>
        {[180, 300, 500, 620].map((x) => (
          <path key={x} d={`M${x} 214v20m-6-6 6 6 6-6`} stroke="#ff6a13" strokeWidth="2" fill="none" strokeLinecap="round" />
        ))}
      </motion.g>

      {/* Stap 4: banden, straatlaag, stenen */}
      <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -24 }} transition={t()}>
        <rect x="100" y="198" width="24" height="64" fill="#d6d4ce" />
        <rect x="676" y="198" width="24" height="64" fill="#d6d4ce" />
      </motion.g>
      <motion.rect x="124" y="234" width="552" height="12" fill="#c8b78e"
        initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={t(0.1)} />
      {stones.map((x, i) => (
        <motion.rect
          key={x}
          x={x}
          y="206"
          width="34"
          height="27"
          rx="2"
          fill={i % 2 ? "#8f959b" : "#9aa0a6"}
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -30 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: step >= 3 ? 0.15 + i * 0.035 : 0, ease: EASE }}
        />
      ))}

      {/* Stap 5: oplevering */}
      <motion.g initial={false} animate={{ opacity: step === 4 ? 1 : 0 }} transition={t(0.2)}>
        <line x1="745" y1="190" x2="745" y2="96" stroke="#d6d4ce" strokeWidth="4" />
        <path d="M745 96h-22" stroke="#d6d4ce" strokeWidth="4" strokeLinecap="round" />
        <rect x="712" y="96" width="16" height="6" rx="2" fill="#ffb07f" />
        <circle cx="50" cy="150" r="30" fill="#2f4a33" />
        <rect x="47" y="160" width="6" height="30" fill="#4a3a2b" />
        <g transform="translate(400 150)">
          <rect x="-70" y="-18" width="140" height="36" rx="18" fill="#ff6a13" />
          <text x="0" y="5" textAnchor="middle" fill="#0d0e0f" fontSize="14" fontWeight="700" fontFamily="var(--font-archivo)">
            ✓ Opgeleverd
          </text>
        </g>
      </motion.g>

      {/* Machine tijdens ontgraven */}
      <motion.g
        initial={false}
        animate={{ opacity: step === 1 ? 1 : 0, x: step === 1 ? 0 : 60 }}
        transition={t()}
      >
        <rect x="560" y="140" width="90" height="34" rx="4" fill="#f2b705" />
        <rect x="600" y="112" width="40" height="30" rx="3" fill="#f2b705" />
        <rect x="606" y="118" width="26" height="18" rx="2" fill="#1b1e22" />
        <rect x="552" y="174" width="106" height="14" rx="7" fill="#2b2d30" />
        <path d="M570 146 500 110 460 160" stroke="#f2b705" strokeWidth="9" fill="none" strokeLinejoin="round" />
        <path d="M452 152h22l-6 18h-14z" fill="#d9a404" />
      </motion.g>
    </svg>
  );
}
