import ProjectImage from "@/components/ui/ProjectImage";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/content/site";

const history = [
  { year: "Fase 1", text: "Opgericht als klein GWW-bedrijf; gestaag gegroeid in grond-, weg- en waterbouw." },
  { year: "Fase 2", text: "Uitbreiding met een eigen wagen- en machinepark en een vaste ploeg vakmensen." },
  { year: "Fase 3", text: "Een eigen bedrijfspand met centrale ligging in de regio." },
  { year: "Vandaag", text: "Een allround infrapartner voor gemeenten, bedrijven en particulieren." },
];

export default function About() {
  return (
    <section id="over-ons" aria-labelledby="over-ons-titel" className="relative bg-paper text-ink">
      <div className="shell py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-ink/55">
                <span className="text-accent-deep">01</span>
                <span className="inline-block h-px w-10 bg-ink/15" />
                Over ons
              </p>
              <h2 id="over-ons-titel" className="display mt-5 text-[clamp(2.3rem,5.6vw,5rem)]">
                Vakmanschap in wegenbouw, straatwerk en <span className="text-accent-deep">infrastructuur.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 grid gap-6 text-[1.08rem] leading-relaxed text-ink/75 sm:grid-cols-2">
                <p>
                  {site.name} is een allround infrabedrijf, actief in heel {site.region}. Voor
                  gemeenten, bedrijven en particulieren verzorgen wij <strong className="text-ink">advies, uitvoering en
                  onderhoud</strong> — van riolering en grondwerk tot straatwerk, asfalt en betonwerken.
                </p>
                <p>
                  Onze missie: kwalitatieve boven- en ondergrondse infrastructuur creëren die de mobiliteit verbetert,
                  gemeenschappen verbindt en de economie stimuleert. Met jarenlange ervaring, een eigen wagen- en
                  machinepark en een eigen verkeersafdeling voor verkeersmaatregelen.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-10 flex flex-wrap gap-2.5" aria-label="Certificeringen en kenmerken">
                {[...site.certifications.map((c) => `${c} gecertificeerd`), "Eigen machinepark", `Actief in ${site.region}`].map(
                  (t) => (
                    <li
                      key={t}
                      className="rounded-full border border-ink/12 bg-white px-4 py-2 text-sm font-semibold text-ink/80"
                    >
                      {t}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-graphite">
                <ProjectImage
                  src="https://www.wegenbouw-brune.nl/wp-content/uploads/img-20250430-wa0019-1024x768.jpg"
                  alt="Nieuw aangelegde bestrating in een woonwijk"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-5 bottom-5 text-white">
                  <span className="eyebrow text-accent-soft">Project</span>
                  <span className="mt-1 block font-display text-lg font-bold">Herinrichting Componistenbuurt, Nuth</span>
                </figcaption>
              </div>
              <div
                aria-hidden
                className="absolute -left-4 -top-4 -z-0 hidden size-24 rounded-2xl border-2 border-accent lg:block"
              />
            </figure>
          </Reveal>
        </div>

        {/* Geschiedenis als wegverloop */}
        <div className="mt-24 lg:mt-32">
          <Reveal>
            <p className="eyebrow text-ink/55">Onze route</p>
          </Reveal>
          <div role="list" className="relative mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div aria-hidden className="road-dash absolute inset-x-0 top-[0.55rem] hidden text-ink/20 lg:block" />
            {history.map((h, i) => (
              <Reveal key={h.year} delay={i * 0.08} className="relative" role="listitem">
                <span className="relative z-10 block size-[1.1rem] rounded-full border-[3px] border-paper bg-accent shadow-[0_0_0_1px_rgba(13,14,15,0.15)]" />
                <p className="mt-5 font-display text-2xl font-extrabold tracking-tight [font-stretch:110%]">{h.year}</p>
                <p className="mt-2 max-w-xs leading-relaxed text-ink/70">{h.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
