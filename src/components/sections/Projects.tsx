"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project, ProjectCategory } from "@/content/projects";
import { projectCategories } from "@/content/projects";
import ProjectImage from "@/components/ui/ProjectImage";
import SectionHeading from "@/components/ui/SectionHeading";

const catLabel = (id: ProjectCategory) => projectCategories.find((c) => c.id === id)?.label ?? id;

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "alle">("alle");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (filter === "alle" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects],
  );
  const counts = useMemo(() => {
    const m = new Map<string, number>([["alle", projects.length]]);
    projects.forEach((p) => p.categories.forEach((c) => m.set(c, (m.get(c) ?? 0) + 1)));
    return m;
  }, [projects]);
  const open = projects.find((p) => p.slug === openSlug) ?? null;
  const close = useCallback(() => setOpenSlug(null), []);

  return (
    <section id="projecten" aria-labelledby="projecten-titel" className="relative bg-char py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Onze projecten"
          id="projecten-titel"
          title={
            <>
              Gerealiseerd in <span className="text-brune">Zuid-Limburg.</span>
            </>
          }
          intro={
            <p>
              Een selectie van recente projecten voor gemeenten en opdrachtgevers in de regio — van complete
              herinrichtingen tot toegankelijke entrees en nachtwerk aan drukke wegen.
            </p>
          }
        />

        {/* Filters */}
        <div
          role="toolbar"
          aria-label="Filter projecten op categorie"
          className="no-scrollbar -mx-5 mt-14 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {projectCategories
            .filter((c) => (counts.get(c.id) ?? 0) > 0)
            .map((c) => {
              const isActive = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(c.id)}
                  className={`relative shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive ? "border-brune text-ink" : "border-white/15 text-white/75 hover:border-white/35 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-brune"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {c.label} <span className={isActive ? "text-ink/60" : "text-white/40"}>{counts.get(c.id)}</span>
                  </span>
                </button>
              );
            })}
        </div>

        {/* Grid */}
        <motion.ul layout={!reduce} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={i === 0 && filter === "alle" ? "sm:col-span-2 lg:row-span-2" : ""}
              >
                <ProjectCard project={p} featured={i === 0 && filter === "alle"} onOpen={() => setOpenSlug(p.slug)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <p className="mt-10 text-sm text-white/45">
          Benieuwd naar ons werk in uw gemeente of op uw terrein?{" "}
          <a href="/#contact" className="font-semibold text-white underline decoration-brune underline-offset-4 hover:text-brune">
            Neem contact op
          </a>
          .
        </p>
      </div>

      <ProjectDialog project={open} onClose={close} />
    </section>
  );
}

function ProjectCard({ project: p, featured, onOpen }: { project: Project; featured: boolean; onOpen: () => void }) {
  const cover = p.images[0];
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group relative block h-full w-full overflow-hidden rounded-[1.5rem] bg-graphite text-left"
    >
      <div className={`relative w-full ${featured ? "aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[36rem]" : "aspect-[4/5]"}`}>
        {cover && (
          <ProjectImage
            src={cover.src}
            alt={cover.alt}
            fill
            sizes={featured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90" />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-5">
          {p.categories.map((c) => (
            <span key={c} className="rounded-full bg-ink/60 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur">
              {catLabel(c)}
            </span>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="eyebrow flex items-center gap-2 text-brune-soft">
            <PinIcon /> {p.location}
          </p>
          <h3 className={`mt-2 font-display font-extrabold leading-[1.05] tracking-tight text-white ${featured ? "text-[clamp(1.6rem,3vw,2.6rem)]" : "text-xl"}`}>
            {p.title}
          </h3>
          <p className={`mt-2 text-white/70 ${featured ? "max-w-lg" : "line-clamp-2 text-sm"}`}>{p.summary}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
            Bekijk project
            <span className="grid size-7 place-items-center rounded-full bg-brune text-ink transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </button>
  );
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Eenvoudige focus-trap
        const root = document.getElementById("project-dialog");
        if (!root) return;
        const f = root.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button aria-label="Sluiten" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
          <motion.div
            id="project-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-titel"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[92svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-char ring-1 ring-white/10 sm:rounded-[1.75rem]"
          >
            <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto p-2">
              {project.images.map((img) => (
                <div key={img.src} className="relative aspect-[4/3] w-[88%] shrink-0 snap-center overflow-hidden rounded-[1.25rem] bg-graphite sm:w-[70%]">
                  <ProjectImage src={img.src} alt={img.alt} fill sizes="(min-width: 640px) 70vw, 88vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="eyebrow flex items-center gap-2 text-brune">
                  <PinIcon /> {project.location}
                </p>
                <h3 id="project-dialog-titel" className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {project.title}
                </h3>
                <div className="mt-6 grid gap-4 leading-relaxed text-white/75">
                  {project.description.map((d) => (
                    <p key={d}>{d}</p>
                  ))}
                </div>
              </div>
              <aside className="lg:col-span-4">
                <dl className="grid gap-5 rounded-2xl border border-white/10 p-6">
                  {project.client && (
                    <div>
                      <dt className="eyebrow text-white/45">Opdrachtgever</dt>
                      <dd className="mt-1 font-semibold">{project.client}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="eyebrow text-white/45">Categorie</dt>
                    <dd className="mt-1 font-semibold">{project.categories.map(catLabel).join(" · ")}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-white/45">Kenmerken</dt>
                    <dd className="mt-2">
                      <ul className="grid gap-2">
                        {project.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2.5 text-sm text-white/80">
                            <span aria-hidden className="mt-2 h-[2px] w-3 shrink-0 bg-brune" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
                <a href="/#contact" onClick={onClose} className="btn btn-primary mt-4 w-full">
                  Vergelijkbaar project bespreken
                </a>
              </aside>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Project sluiten"
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-ink/70 text-xl text-white backdrop-blur hover:bg-ink"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
    </svg>
  );
}
