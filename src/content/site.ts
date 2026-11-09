/**
 * Bedrijfsgegevens van de demo/portfolio-site "Construction Redesign".
 * Adres, telefoon, e-mail, KvK en BTW zijn PLACEHOLDERS — vervang ze per klant.
 * Pas hier aan; alle componenten, JSON-LD en de footer lezen uit dit bestand.
 */
export const site = {
  name: "Construction Redesign",
  shortName: "Construction Redesign",
  tagline: "Advies, uitvoering en onderhoud",
  description:
    "Construction Redesign: vakmanschap in wegenbouw, straatwerk, grondwerk, riolering, asfaltering en infrastructuur voor gemeenten en bedrijven in Zuid-Limburg.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://construction-redesign.vercel.app",
  region: "Zuid-Limburg",
  address: {
    street: "Voorbeeldstraat 1",
    postalCode: "1234 AB",
    city: "Voorbeeldstad",
    province: "Limburg",
    country: "NL",
  },
  phone: { display: "012 345 67 89", href: "tel:+31123456789", intl: "+31 12 345 67 89" },
  email: "info@example.com",
  kvk: "12345678",
  btw: "NL000000000B01",
  certifications: ["ISO 9001", "VCA"],
} as const;

/** Typen opdrachtgevers (demo — geen echte referenties). */
export const clients = [
  "Gemeenten",
  "Waterschappen",
  "Woningcorporaties",
  "Bedrijventerreinen",
  "Zorginstellingen",
  "Projectontwikkelaars",
  "Aannemers",
  "Particulieren",
] as const;

export const nav = [
  { href: "/#over-ons", label: "Over ons" },
  { href: "/#werkzaamheden", label: "Werkzaamheden" },
  { href: "/#projecten", label: "Projecten" },
  { href: "/#werkwijze", label: "Werkwijze" },
  { href: "/#waarom-ons", label: "Waarom wij" },
] as const;
