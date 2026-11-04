"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/content/site";
import { PhoneIcon } from "./Header";

/**
 * Vaste contactbalk op mobiel/tablet. Verschijnt pas ná de hero (zodat de weg vrij blijft)
 * en verdwijnt zodra het contactformulier in beeld is.
 */
export default function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let contactInView = false;
    const update = () => setVisible(pastHero && !contactInView);

    const hero = document.getElementById("top");
    const onScroll = () => {
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight * 0.6 : 400;
      const next = window.scrollY > heroEnd;
      if (next !== pastHero) {
        pastHero = next;
        update();
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const targets = ["contact", "footer"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting));
      contactInView = [...seen.values()].some(Boolean);
      update();
    });
    targets.forEach((t) => io.observe(t));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ type: "spring", stiffness: 420, damping: 38 }}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden"
        >
          <div className="flex gap-2 rounded-full border border-white/10 bg-char/85 p-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <a href={site.phone.href} className="btn btn-ghost min-h-12 flex-1 border-transparent px-3 text-sm">
              <PhoneIcon />
              Bel direct
            </a>
            <a href="/#contact" className="btn btn-primary min-h-12 flex-[1.4] px-3 text-sm">
              Offerte aanvragen
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
