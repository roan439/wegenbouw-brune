"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FrameCache,
  drawCover,
  prefersLightAssets,
  smoothstep,
  supportsAvif,
  type FrameSource,
} from "./frame-sequence";

const FRAME_COUNT = 124;
const BASE = "/hero/v1";
const AVIF_PROBE =
  "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAAD5bWV0YQAAAAAAAAAvaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAFBpY3R1cmVIYW5kbGVyAAAAAA5waXRtAAAAAAABAAAAHmlsb2MAAAAARAAAAQABAAAAAQAAASEAAAAUAAAAKGlpbmYAAAAAAAEAAAAaaW5mZQIAAAAAAQAAYXYwMUNvbG9yAAAAAGppcHJwAAAAS2lwY28AAAAUaXNwZQAAAAAAAAACAAAAAgAAABBwaXhpAAAAAAMICAgAAAAMYXYxQ4EADAAAAAATY29scm5jbHgAAgACAAIAAAAAF2lwbWEAAAAAAAAAAQABBAECgwQAAAAcbWRhdAoFGAA2wCAyCx/wAABYAAAAAK8w";

/** Scroll-fases van de drie koppen (fractie van de totale sequentie). */
const HEADLINES = [
  { text: "Sterk in wegenbouw.", from: 0, to: 0.31 },
  { text: "Van grondwerk tot perfect straatwerk.", from: 0.35, to: 0.66 },
  { text: "Samen bouwen aan morgen.", from: 0.71, to: 1 },
] as const;
const FADE = 0.065;

/** Bouwfases zoals zichtbaar in de video (op basis van frame-analyse). */
const PHASES = [
  { at: 0, label: "Uitgangssituatie" },
  { at: 0.13, label: "Ontgraven" },
  { at: 0.47, label: "Fundering" },
  { at: 0.71, label: "Bestraten" },
  { at: 0.87, label: "Opgeleverd" },
] as const;

/** Focuspunt voor het uitsnijden: de weg zit in het onderste deel van het beeld. */
const FOCUS_Y = 0.62;

function headlineOpacity(p: number, i: number) {
  const h = HEADLINES[i];
  const fadeIn = i === 0 ? 1 : smoothstep(h.from, h.from + FADE, p);
  const fadeOut = i === HEADLINES.length - 1 ? 1 : 1 - smoothstep(h.to - FADE, h.to, p);
  return fadeIn * fadeOut;
}

export default function HeroSequence() {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reducedMotion) return <HeroStatic />;
  return <HeroScroll />;
}

/* -------------------------------------------------------------------------- */
/*  Scroll-gestuurde variant                                                   */
/* -------------------------------------------------------------------------- */

function HeroScroll() {
  const trackRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const headlineRefs = useRef<(HTMLElement | null)[]>([]);
  const phaseLabelRef = useRef<HTMLSpanElement>(null);
  const phaseNumRef = useRef<HTMLSpanElement>(null);
  const segmentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!track || !canvas || !bgCanvas) return;

    gsap.registerPlugin(ScrollTrigger);
    // Adresbalk op mobiel in/uit laten klappen mag geen herberekening (= sprong) veroorzaken.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = canvas.getContext("2d", { alpha: false });
    const bgCtx = bgCanvas.getContext("2d", { alpha: false });
    if (!ctx || !bgCtx) return;

    let cache: FrameCache | null = null;
    let disposed = false;
    let raf = 0;
    let target = 0; // doel-frame (float) volgens scrollpositie
    let current = 0; // weergegeven frame (float), volgt target vloeiend
    let lastImg: HTMLImageElement | undefined;
    let needsResize = true;
    let lastPhase = -1;
    const opacityCache = [-1, -1, -1];

    const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

    // --- Canvas afmetingen (device pixels, max 2× voor prestaties) ----------------
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // Achtergrond wordt via CSS-blur opgeschaald: kleine interne resolutie volstaat.
      if (bgCanvas.width !== 96) {
        bgCanvas.width = 96;
        bgCanvas.height = 54;
      }
      needsResize = false;
      lastImg = undefined; // forceer hertekenen
    };

    const draw = (img: HTMLImageElement) => {
      if (needsResize) resize();
      if (img === lastImg) return;
      lastImg = img;
      drawCover(ctx, img, canvas.width, canvas.height, 0.5, FOCUS_Y);
      if (bgCanvas.offsetWidth > 0) drawCover(bgCtx, img, bgCanvas.width, bgCanvas.height, 0.5, 0.5);
      if (posterRef.current && posterRef.current.style.opacity !== "0") posterRef.current.style.opacity = "0";
    };

    // --- Overlays (koppen, fase-HUD) direct via style: geen React re-renders ----------
    const updateOverlays = (p: number) => {
      for (let i = 0; i < HEADLINES.length; i++) {
        const el = headlineRefs.current[i];
        if (!el) continue;
        const o = Math.round(headlineOpacity(p, i) * 1000) / 1000;
        if (o === opacityCache[i]) continue;
        opacityCache[i] = o;
        const before = p < HEADLINES[i].from + FADE; // nog aan het binnenkomen
        const y = (1 - o) * (before ? 28 : -28);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        el.style.filter = o > 0.98 ? "none" : `blur(${((1 - o) * 10).toFixed(1)}px)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      }

      let phase = 0;
      for (let i = 0; i < PHASES.length; i++) if (p >= PHASES[i].at) phase = i;
      if (phase !== lastPhase) {
        lastPhase = phase;
        if (phaseLabelRef.current) phaseLabelRef.current.textContent = PHASES[phase].label;
        if (phaseNumRef.current) phaseNumRef.current.textContent = String(phase + 1).padStart(2, "0");
        segmentRefs.current.forEach((s, i) => s?.setAttribute("data-on", String(i <= phase)));
      }
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (hintRef.current) hintRef.current.style.opacity = String(1 - smoothstep(0.005, 0.04, p));
    };

    // --- Render-loop: draait alleen zolang er beweging is --------------------------
    const tick = () => {
      raf = 0;
      if (disposed || !cache) return;
      const delta = target - current;
      // Vloeiend volgen; bij kleine afstand direct vastklikken (voorkomt eindeloos naderen).
      current = Math.abs(delta) < 0.05 ? target : current + delta * 0.22;
      const img = cache.get(current);
      if (img) draw(img);
      updateOverlays(current / (FRAME_COUNT - 1));
      // Blijf tekenen tot we op het doel staan én het exacte frame geladen is.
      if (current !== target || !cache.isReady(Math.round(current))) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // --- Setup -------------------------------------------------------------------
    const ro = new ResizeObserver(() => {
      needsResize = true;
      lastImg = undefined;
      kick();
    });
    ro.observe(canvas);

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self: { progress: number }) => {
        target = self.progress * (FRAME_COUNT - 1);
        cache?.prioritize(target);
        kick();
      },
    });
    target = st.progress * (FRAME_COUNT - 1);
    current = target;
    updateOverlays(st.progress);

    (async () => {
      const avif = await supportsAvif(AVIF_PROBE);
      // Frames pas na het load-event ophalen: de poster is al zichtbaar en zo blijven
      // LCP en het load-event van de pagina zelf snel.
      if (document.readyState !== "complete") {
        await new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
      }
      if (disposed) return;
      const light = prefersLightAssets();
      const desktop = isDesktop() || window.innerWidth >= 768;
      const src: FrameSource = {
        dir: `${BASE}/${desktop && !light ? "d" : "m"}${avif ? "" : "w"}`,
        count: FRAME_COUNT,
        format: avif ? "avif" : "webp",
        stride: light ? 2 : 1,
      };
      cache = new FrameCache(src, light ? 3 : 6);
      cache.onFrame = (i) => {
        // Alleen hertekenen als het nieuwe frame dichter bij de huidige positie ligt.
        if (Math.abs(i - Math.round(current)) <= 2 || !lastImg) kick();
      };
      cache.onProgress = (r) => {
        const el = loaderRef.current;
        if (!el) return;
        el.textContent = r >= 1 ? "" : `Laden ${Math.round(r * 100)}%`;
      };
      cache.start();
      kick();
    })();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      st.kill();
      cache?.destroy();
    };
  }, []);

  return (
    <section
      ref={trackRef}
      id="top"
      aria-label="Introductie: van beschadigde straat tot nieuw straatwerk"
      className="hero-track relative bg-ink"
    >
      <div className="hero-stage sticky top-0 overflow-hidden">
        {/* Desktop: vervaagde full-bleed achtergrond uit hetzelfde frame */}
        <canvas
          ref={bgCanvasRef}
          aria-hidden
          className="absolute inset-[-8%] hidden h-[116%] w-[116%] opacity-70 blur-[40px] brightness-[0.38] saturate-[1.15] lg:block"
        />
        <div aria-hidden className="pattern-paving absolute inset-0 hidden opacity-60 lg:block" />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_70%_50%,transparent_0%,rgba(13,14,15,0.55)_55%,rgba(13,14,15,0.95)_100%)] lg:block"
        />

        {/* Het filmpaneel: full-screen op mobiel, ingelijst op desktop */}
        <div className="absolute inset-0 overflow-hidden lg:inset-auto lg:top-24 lg:right-10 lg:bottom-8 lg:w-[min(44vw,48rem)] lg:rounded-[1.75rem] lg:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] lg:ring-1 lg:ring-white/10 xl:right-16">
          <div ref={posterRef} className="absolute inset-0 transition-opacity duration-500">
            <picture>
              <source srcSet={`${BASE}/poster.avif`} type="image/avif" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/poster.jpg`}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ objectPosition: `50% ${FOCUS_Y * 100}%` }}
              />
            </picture>
          </div>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Een oude, beschadigde woonstraat wordt stap voor stap opnieuw aangelegd met nieuwe bestrating."
            className="absolute inset-0 h-full w-full"
          />

          {/* Leesbaarheid op mobiel: verloop bovenin (tekst) en onderin (HUD) */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-ink/85 via-ink/45 to-transparent lg:hidden" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/80 to-transparent" />

          {/* Fase-HUD */}
          <div className="absolute inset-x-4 bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+100lvh-100svh)] flex items-end justify-between gap-4 sm:inset-x-6 lg:bottom-6">
            <div className="min-w-0">
              <p className="eyebrow flex items-center gap-2 text-white/60">
                <span className="text-brune">Fase</span>
                <span ref={phaseNumRef}>01</span>
                <span className="text-white/30">/ 05</span>
              </p>
              <p className="mt-1 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                <span ref={phaseLabelRef}>{PHASES[0].label}</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span ref={loaderRef} className="eyebrow text-[0.62rem] text-white/45" aria-hidden />
              <div className="flex gap-1.5" aria-hidden>
                {PHASES.map((p, i) => (
                  <span
                    key={p.label}
                    ref={(el) => {
                      segmentRefs.current[i] = el;
                    }}
                    data-on={i === 0}
                    className="h-1 w-6 rounded-full bg-white/20 transition-colors duration-500 data-[on=true]:bg-brune sm:w-8"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Koppen */}
        <div className="pointer-events-none relative z-10 h-full">
          <div className="shell flex h-full flex-col pt-[calc(5.5rem+env(safe-area-inset-top))] lg:justify-center lg:pt-16">
            <div className="lg:max-w-[46vw] xl:max-w-[44vw]">
              <p className="eyebrow mb-4 flex items-center gap-3 text-white/70 lg:mb-6">
                <span className="inline-block h-px w-8 shrink-0 bg-brune" />
                <span>
                  Wegenbouw<span className="hidden sm:inline"> · Straatwerk · Infrastructuur</span> — Zuid-Limburg
                </span>
              </p>
              <div className="grid">
                {HEADLINES.map((h, i) => {
                  const words = h.text.split(" ");
                  const content = words.map((w, wi) => (
                    <span key={wi} className={wi === words.length - 1 ? "text-brune" : undefined}>
                      {w}
                      {wi < words.length - 1 ? " " : ""}
                    </span>
                  ));
                  const setRef = (el: HTMLElement | null) => {
                    headlineRefs.current[i] = el;
                  };
                  const cls =
                    "display [grid-area:1/1] text-[clamp(2.6rem,11.5vw,4.2rem)] text-white will-change-[opacity,transform] sm:text-[clamp(3.2rem,8vw,5rem)] lg:text-[clamp(3.6rem,5.6vw,7rem)]";
                  return i === 0 ? (
                    <h1 key={h.text} ref={setRef} className={cls}>
                      {content}
                      <span className="sr-only"> — Wegenbouw Brune B.V. uit Geleen</span>
                    </h1>
                  ) : (
                    <p key={h.text} ref={setRef} className={cls} style={{ opacity: 0, visibility: "hidden" }}>
                      {content}
                    </p>
                  );
                })}
              </div>

              <div className="pointer-events-auto mt-8 hidden flex-wrap gap-3 lg:flex">
                <a href="#contact" className="btn btn-primary">
                  Vraag een offerte aan
                  <Arrow />
                </a>
                <a href="#projecten" className="btn btn-ghost">
                  Bekijk projecten
                </a>
              </div>
            </div>
          </div>

          {/* Scroll-hint */}
          <div
            ref={hintRef}
            className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/60 lg:bottom-10 lg:left-16 lg:flex lg:translate-x-0 lg:flex-row xl:left-24"
          >
            <span className="relative block h-10 w-6 rounded-full border border-white/30">
              <span className="absolute left-1/2 top-2 h-2 w-0.5 -translate-x-1/2 animate-bounce rounded-full bg-brune" />
            </span>
            <span className="eyebrow">Scroll en zie de straat veranderen</span>
          </div>
        </div>

        {/* Totale voortgang */}
        <div aria-hidden className="absolute inset-x-0 top-0 z-20 h-[2px] bg-white/5">
          <div ref={progressRef} className="h-full origin-left scale-x-0 bg-brune" />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Variant voor prefers-reduced-motion: statisch, alle koppen leesbaar        */
/* -------------------------------------------------------------------------- */

function HeroStatic() {
  return (
    <section id="top" aria-label="Introductie" className="relative overflow-hidden bg-ink">
      <div className="relative min-h-[100svh] lg:grid lg:grid-cols-2">
        <picture>
          <source srcSet={`${BASE}/final.avif`} type="image/avif" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/final.jpg`}
            alt="Een volledig vernieuwde woonstraat met nieuwe bestrating."
            className="absolute inset-0 h-full w-full object-cover lg:relative lg:order-2 lg:h-[100svh]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/50 to-ink/30 lg:hidden" />
        <div className="shell relative flex min-h-[100svh] flex-col justify-center py-28 lg:order-1">
          <p className="eyebrow mb-6 text-white/70">Wegenbouw · Straatwerk · Infrastructuur — Zuid-Limburg</p>
          <h1 className="display text-[clamp(2.6rem,6vw,6rem)]">
            Sterk in <span className="text-brune">wegenbouw.</span>
            <span className="sr-only"> — Wegenbouw Brune B.V. uit Geleen</span>
          </h1>
          <p className="display mt-6 text-[clamp(1.6rem,3vw,2.8rem)] text-white/80">
            Van grondwerk tot perfect straatwerk.
          </p>
          <p className="display mt-3 text-[clamp(1.6rem,3vw,2.8rem)] text-white/80">Samen bouwen aan morgen.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#contact" className="btn btn-primary">
              Vraag een offerte aan
            </a>
            <a href="#projecten" className="btn btn-ghost">
              Bekijk projecten
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
