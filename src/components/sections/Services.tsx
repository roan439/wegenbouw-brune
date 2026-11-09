"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { services } from "@/content/services";
import ServiceIcon from "@/components/ui/ServiceIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import { selectWorkType } from "@/lib/events";

export default function Services() {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const current = services[active];

  return (
    <section
      id="werkzaamheden"
      aria-labelledby="werkzaamheden-titel"
      className="grain relative overflow-hidden bg-ink py-24 sm:py-32 lg:py-40"
    >
      <div aria-hidden className="pattern-paving absolute inset-0 opacity-40" />
      <div className="shell relative">
        <SectionHeading
          index="02"
          eyebrow="Onze werkzaamheden"
          id="werkzaamheden-titel"
          title={
            <>
              Alles voor de weg. <span className="text-white/35">Boven en onder de grond.</span>
            </>
          }
          intro={
            <p>
              Van het eerste advies tot jarenlang onderhoud: wij voeren het complete traject in eigen beheer uit, met
              eigen mensen en een eigen machinepark.
            </p>
          }
        />

        {/* Desktop: kaarten + detailpaneel */}
        <div className="mt-16 hidden gap-6 lg:grid lg:grid-cols-12">
          <div role="tablist" aria-label="Werkzaamheden" aria-orientation="vertical" className="grid grid-cols-2 gap-3 lg:col-span-7">
            {services.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={isActive}
                  aria-controls="werk-detail"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onKeyDown={(e) => {
                    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                    if (!dir) return;
                    e.preventDefault();
                    const next = (i + dir + services.length) % services.length;
                    setActive(next);
                    document.getElementById(`tab-${services[next].id}`)?.focus();
                  }}
                  className={`group relative flex min-h-[8.5rem] flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-300 ${
                    isActive ? "border-accent/60 bg-white/[0.06]" : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="service-active"
                      aria-hidden
                      className="absolute inset-0 -z-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(255,106,19,0.18),transparent_60%)]"
                      transition={{ type: "spring", stiffness: 300, damping: 34 }}
                    />
                  )}
                  <span className="relative flex items-start justify-between">
                    <ServiceIcon
                      name={s.icon}
                      className={`size-9 transition-colors ${isActive ? "text-accent" : "text-white/50 group-hover:text-white/80"}`}
                    />
                    <span className="eyebrow text-white/35">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="relative mt-6 font-display text-lg font-bold leading-tight tracking-tight">{s.title}</span>
                  <span
                    aria-hidden
                    className={`absolute bottom-0 left-0 h-[3px] bg-accent transition-all duration-500 ${isActive ? "w-full" : "w-0 group-hover:w-1/3"}`}
                  />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-5">
            <div
              id="werk-detail"
              role="tabpanel"
              aria-labelledby={`tab-${current.id}`}
              className="sticky top-28 min-h-[32rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-char p-10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full flex-col"
                >
                  <ServiceIcon name={current.icon} className="size-14 text-accent" />
                  <h3 className="mt-8 font-display text-3xl font-extrabold tracking-tight [font-stretch:108%]">
                    {current.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-white/85">{current.lead}</p>
                  <p className="mt-4 leading-relaxed text-white/60">{current.body}</p>
                  <ul className="mt-8 grid gap-3 border-t border-white/10 pt-6">
                    {current.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-white/80">
                        <span aria-hidden className="h-[2px] w-4 bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/#contact"
                    onClick={() => selectWorkType(current.title)}
                    className="btn btn-primary mt-10 self-start"
                  >
                    Offerte voor {current.title.toLowerCase()}
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobiel/tablet: uitklapbare kaarten */}
        <ul className="mt-12 grid gap-3 lg:hidden">
          {services.map((s, i) => {
            const isOpen = openMobile === i;
            return (
              <li key={s.id} className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? "border-accent/50 bg-white/[0.05]" : "border-white/10 bg-white/[0.02]"}`}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`werk-${s.id}`}
                    onClick={() => setOpenMobile(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    <ServiceIcon name={s.icon} className={`size-8 shrink-0 ${isOpen ? "text-accent" : "text-white/55"}`} />
                    <span className="flex-1 font-display text-lg font-bold tracking-tight">{s.title}</span>
                    <span
                      aria-hidden
                      className={`grid size-8 place-items-center rounded-full border border-white/15 text-lg transition-transform duration-300 ${isOpen ? "rotate-45 bg-accent text-ink" : ""}`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`werk-${s.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-5 pb-6">
                        <p className="text-white/85">{s.lead}</p>
                        <p className="mt-3 text-[0.95rem] leading-relaxed text-white/60">{s.body}</p>
                        <ul className="mt-5 grid gap-2">
                          {s.points.map((p) => (
                            <li key={p} className="flex items-center gap-3 text-sm text-white/80">
                              <span aria-hidden className="h-[2px] w-3 bg-accent" />
                              {p}
                            </li>
                          ))}
                        </ul>
                        <a href="/#contact" onClick={() => selectWorkType(s.title)} className="btn btn-primary mt-6 w-full">
                          Offerte aanvragen
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
