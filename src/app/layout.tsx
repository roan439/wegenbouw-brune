import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { services } from "@/content/services";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import MobileCTA from "@/components/MobileCTA";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const title = "Construction Redesign | Wegenbouw, straatwerk & grondwerk in Zuid-Limburg";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Construction Redesign" },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "wegenbouw Zuid-Limburg",
    "straatwerk Limburg",
    "stratenmaker Limburg",
    "grondwerk Zuid-Limburg",
    "riolering",
    "asfaltering",
    "herinrichting openbare ruimte",
    "vloeistofdichte verharding",
    "infrastructuur gemeente",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, email: true, address: true },
  other: { "geo.region": "NL-LI", "geo.placename": "Zuid-Limburg" },
};

export const viewport: Viewport = {
  themeColor: "#0d0e0f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${site.url}/#organisatie`,
  name: site.name,
  url: site.url,
  image: `${site.url}/opengraph-image`,
  description: site.description,
  slogan: site.tagline,
  telephone: site.phone.intl,
  email: site.email,
  vatID: site.btw,
  identifier: { "@type": "PropertyValue", propertyID: "KvK", value: site.kvk },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressRegion: site.address.province,
    addressCountry: site.address.country,
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Zuid-Limburg" },
  ],
  knowsAbout: services.map((s) => s.title),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Werkzaamheden",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.lead },
    })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-ink text-paper">
        <a
          href="#inhoud"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-bold focus:text-ink"
        >
          Direct naar de inhoud
        </a>
        <Header />
        {children}
        <Footer />
        <MobileCTA />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
