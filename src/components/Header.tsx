"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { nav, site } from "@/content/site";
import Logo from "./Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const solid = scrolled || open || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Actieve sectie markeren in de navigatie
  useEffect(() => {
    const ids = nav.map((n) => n.href.split("#")[1]).concat("contact");
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Mobiel menu: scroll vergrendelen + Escape sluiten
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div
        className={`absolute inset-0 -z-10 border-b transition-all duration-500 ${
          solid
            ? "border-white/[0.07] bg-ink/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-gradient-to-b from-ink/60 to-transparent"
        }`}
      />
      <div className="shell flex h-16 items-center justify-between gap-6 lg:h-20">
        <a href="/#top" className="relative z-10 text-white" aria-label={`${site.name} — naar boven`}>
          <Logo />
        </a>

        <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
          <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
            {nav.map((item) => {
              const id = item.href.split("#")[1];
              const isActive = active === id;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block rounded-full px-4 py-2 text-[0.88rem] font-semibold transition-colors ${
                      isActive ? "text-ink" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.phone.href}
            className="hidden items-center gap-2 px-3 text-sm font-semibold text-white/80 transition-colors hover:text-white xl:flex"
          >
            <PhoneIcon />
            {site.phone.display}
          </a>
          <a href="/#contact" className="btn btn-primary hidden min-h-11 sm:inline-flex">
            Offerte aanvragen
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobiel-menu"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            className="relative z-10 grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-white transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-white transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobiel-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 -z-20 flex flex-col bg-ink pt-[calc(5rem+env(safe-area-inset-top))] lg:hidden"
          >
            <div aria-hidden className="pattern-paving absolute inset-0 opacity-50" />
            <nav aria-label="Mobiele navigatie" className="shell relative flex-1 overflow-y-auto pb-10">
              <ul className="border-t border-white/10">
                {[...nav, { href: "/#contact", label: "Contact" }].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-white/10"
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-5 font-display text-3xl font-extrabold tracking-tight [font-stretch:110%]"
                    >
                      {item.label}
                      <span className="eyebrow text-brune">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 grid gap-3">
                <a href={site.phone.href} className="btn btn-ghost w-full">
                  <PhoneIcon /> {site.phone.display}
                </a>
                <a href={`mailto:${site.email}`} className="btn btn-ghost w-full">
                  {site.email}
                </a>
                <a href="/#contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                  Offerte aanvragen
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
