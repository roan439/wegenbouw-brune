/**
 * Geverifieerde bedrijfsgegevens — bron: www.wegenbouw-brune.nl (home, over ons, contact).
 * Pas hier aan; alle componenten, JSON-LD en de footer lezen uit dit bestand.
 */
export const site = {
  name: "Wegenbouw Brune B.V.",
  shortName: "Brune",
  tagline: "Advies, uitvoering en onderhoud",
  description:
    "Wegenbouw Brune B.V. uit Geleen: vakmanschap in wegenbouw, straatwerk, grondwerk, riolering, asfaltering en infrastructuur voor gemeenten en bedrijven in Zuid-Limburg.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.wegenbouw-brune.nl",
  region: "Zuid-Limburg",
  address: {
    street: "Transportlaan 80",
    postalCode: "6163 CX",
    city: "Geleen",
    province: "Limburg",
    country: "NL",
  },
  phone: { display: "045 404 20 43", href: "tel:+31454042043", intl: "+31 45 404 20 43" },
  email: "info@wegenbouw-brune.nl",
  kvk: "140.946.46",
  btw: "NL 8179.38.8754.B01",
  social: {
    facebook: "https://www.facebook.com/wegenbouwbrune/",
  },
  certifications: ["ISO 9001", "VCA"],
  sisterCompanies: ["Traffic Management", "Traffic Controllers"],
  documents: {
    privacy: "https://www.wegenbouw-brune.nl/wp-content/uploads/privacyverklaring.pdf",
    beleidsverklaring:
      "https://www.wegenbouw-brune.nl/wp-content/uploads/beleidsverklaring-2026-wegenbouw-brune.pdf",
    inkoopvoorwaarden:
      "https://www.wegenbouw-brune.nl/wp-content/uploads/def-algemene-inkoop-en-onderaannemingsvoorwaarden-brune-wegenbouw-2026.pdf",
    verkoopvoorwaarden:
      "https://www.wegenbouw-brune.nl/wp-content/uploads/def-algemene-verkoop-en-leveringsvoorwaarden-brune-wegenbouw-2026.pdf",
  },
} as const;

/** Opdrachtgevers zoals vermeld op de bestaande website (referenties). */
export const clients = [
  "Gemeente Beekdaelen",
  "Gemeente Beek",
  "Zuyderland",
  "Katoen Natie",
  "Boels",
  "Kasteelpark Born",
  "Laudy Bouw",
  "Sfeervol Meerssen",
] as const;

export const nav = [
  { href: "/#over-ons", label: "Over ons" },
  { href: "/#werkzaamheden", label: "Werkzaamheden" },
  { href: "/#projecten", label: "Projecten" },
  { href: "/#werkwijze", label: "Werkwijze" },
  { href: "/#waarom-brune", label: "Waarom Brune" },
] as const;
