import Logo from "@/components/Logo";
import { nav, site } from "@/content/site";
import { services } from "@/content/services";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="footer" className="relative overflow-hidden border-t border-white/10 bg-ink pb-28 pt-20 lg:pb-12">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo className="text-white" />
            <p className="mt-6 max-w-sm leading-relaxed text-white/60">
              {site.tagline}. Vakmanschap in wegenbouw, straatwerk en infrastructuur voor gemeenten en bedrijven in{" "}
              {site.region}.
            </p>
            <address className="mt-6 not-italic leading-relaxed text-white/80">
              {site.name}
              <br />
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </address>
          </div>

          <nav aria-label="Footer: navigatie" className="lg:col-span-2">
            <p className="eyebrow text-white/40">Navigatie</p>
            <ul className="mt-5 grid gap-3">
              {[...nav, { href: "/#contact", label: "Contact" }].map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-white/75 transition-colors hover:text-accent">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer: werkzaamheden" className="lg:col-span-3">
            <p className="eyebrow text-white/40">Werkzaamheden</p>
            <ul className="mt-5 grid gap-3">
              {services.map((s) => (
                <li key={s.id}>
                  <a href="/#werkzaamheden" className="text-white/75 transition-colors hover:text-accent">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow text-white/40">Contact</p>
            <ul className="mt-5 grid gap-3">
              <li>
                <a href={site.phone.href} className="text-lg font-semibold text-white hover:text-accent">
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-white/75 hover:text-accent">
                  {site.email}
                </a>
              </li>
            </ul>
            <dl className="mt-8 grid gap-1 text-sm text-white/45">
              <div className="flex gap-2">
                <dt>KvK</dt>
                <dd>{site.kvk}</dd>
              </div>
              <div className="flex gap-2">
                <dt>BTW</dt>
                <dd>{site.btw}</dd>
              </div>
            </dl>
          </div>
        </div>

        <p
          aria-hidden
          className="display pointer-events-none mt-20 select-none text-center text-[17vw] leading-[0.8] text-white/[0.04] lg:text-[15vw]"
        >
          REDESIGN
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {site.name}. Alle rechten voorbehouden.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href="/privacyverklaring" className="hover:text-white">
                Privacyverklaring
              </a>
            </li>
            <li>
              <a href="/algemene-voorwaarden" className="hover:text-white">
                Algemene voorwaarden
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
