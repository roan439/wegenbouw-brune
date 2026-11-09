/**
 * Projecten — demo-inhoud voor Construction Redesign.
 *
 * CMS-READY: de vorm van `Project` is bewust plat gehouden zodat hij 1-op-1 te mappen is op
 * een CMS-schema (Sanity, Storyblok, Contentful, WordPress REST/ACF …). Zie `src/lib/cms.ts`:
 * daar wordt `getProjects()` aangeroepen — vervang alleen die functie om een CMS te koppelen.
 *
 * Afbeeldingen verwijzen nu naar de bestaande WordPress-mediabibliotheek. Zet ze bij livegang
 * in uw CMS of in /public/projecten en pas `src` aan.
 */
export type ProjectCategory = "herinrichting" | "straatwerk" | "verkeer" | "parkeren";

export const projectCategories: { id: ProjectCategory | "alle"; label: string }[] = [
  { id: "alle", label: "Alle projecten" },
  { id: "herinrichting", label: "Herinrichting" },
  { id: "straatwerk", label: "Straatwerk" },
  { id: "verkeer", label: "Verkeer & OV" },
  { id: "parkeren", label: "Parkeren" },
];

export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  title: string;
  location: string;
  client?: string;
  categories: ProjectCategory[];
  summary: string;
  description: string[];
  highlights: string[];
  images: ProjectImage[];
};

const WP = "https://www.wegenbouw-brune.nl/wp-content/uploads";

export const projects: Project[] = [
  {
    slug: "herinrichting-componistenbuurt-nuth",
    title: "Herinrichting Componistenbuurt",
    location: "Nuth",
    categories: ["herinrichting", "straatwerk"],
    summary: "Herinrichting van rijbaan, boomvakken en trottoirs in de Componistenbuurt.",
    description: [
      "Op de Valkenburgerweg, Bachlaan, Mozartlaan en Beethovenlaan herinrichten wij de rijbaan, de boomvakken en de trottoirs. De rijbaan wordt deels circa 1,5 meter versmald, het asfalt wordt vervangen en alle bestrating wordt vernieuwd.",
      "Er worden nieuwe boomvakken aangelegd, de drempels Bachlaan–Donatusstraat krijgen betonstraatstenen en op de kruising Mozartlaan–Donatusstraat komt een drempel. Het werk wordt in drie fasen uitgevoerd, met omleidingstekening en bewonersbrief.",
    ],
    highlights: ["Rijbaan deels ca. 1,5 m versmald", "Asfalt en bestrating vernieuwd", "Uitvoering in 3 fasen"],
    images: [
      { src: `${WP}/img-20250430-wa0019-1024x768.jpg`, alt: "Vernieuwde bestrating in de Bachlaan, Nuth", width: 1024, height: 768 },
      { src: `${WP}/img-20250430-wa0020-1024x768.jpg`, alt: "Werkzaamheden Componistenbuurt Nuth", width: 1024, height: 768 },
      { src: `${WP}/img-20250430-wa0021-1024x768.jpg`, alt: "Trottoir en rijbaan in uitvoering, Nuth", width: 1024, height: 768 },
    ],
  },
  {
    slug: "nieuwe-bushalte-en-voetpad-nuth",
    title: "Nieuwe bushaltes en voetpad",
    location: "Nuth",
    categories: ["verkeer", "straatwerk"],
    summary: "Twee nieuwe bushaltes en ruim 700 meter voetpad, in nachtwerk aangelegd.",
    description: [
      "Op een van de drukste en belangrijkste ontsluitingswegen van de gemeente Beekdaelen hebben wij twee nieuwe bushaltes en ruim 700 meter voetpad aangelegd.",
      "Het werk werd ’s nachts en onder enige tijdsdruk uitgevoerd — volledig conform planning. Samen met onze eigen verkeersafdeling werkten we veilig in de nachtelijke uren.",
    ],
    highlights: ["2 bushaltes", "Ruim 700 m voetpad", "Nachtwerk conform planning"],
    images: [
      { src: `${WP}/afbeelding-van-whatsapp-op-2025-10-14-om-15.56.09_d0a53951.jpg`, alt: "Nieuwe bushalte langs de ontsluitingsweg in Nuth", width: 1600, height: 1200 },
      { src: `${WP}/afbeelding-van-whatsapp-op-2025-10-14-om-15.56.09_40aaccbb-1024x768.jpg`, alt: "Aanleg voetpad in Nuth", width: 1024, height: 768 },
      { src: `${WP}/afbeelding-van-whatsapp-op-2025-10-14-om-15.56.09_2fcb51d6-1024x768.jpg`, alt: "Opgeleverd voetpad en bushalte, Nuth", width: 1024, height: 768 },
    ],
  },
  {
    slug: "2e-fase-gijselaar-amstenrade",
    title: "2e fase De Gijselaar",
    location: "Amstenrade",
    categories: ["herinrichting"],
    summary: "Tweede fase van het herinrichtingsproject in gebiedsontwikkeling De Gijselaar.",
    description: [
      "Na de oplevering van fase 1 in maart 2025 zijn wij in oktober gestart met de tweede fase van het herinrichtingsproject binnen gebiedsontwikkeling De Gijselaar in Amstenrade.",
    ],
    highlights: ["Fase 1 opgeleverd maart 2025", "Fase 2 gestart in oktober"],
    images: [
      { src: `${WP}/img-20251126-wa0020.jpg`, alt: "Werkzaamheden tweede fase De Gijselaar, Amstenrade", width: 1600, height: 1200 },
      { src: `${WP}/img-20251126-wa0030-1024x768.jpg`, alt: "Herinrichting De Gijselaar in uitvoering", width: 1024, height: 768 },
      { src: `${WP}/img-20251126-wa0028-1024x768.jpg`, alt: "Bestrating De Gijselaar, Amstenrade", width: 1024, height: 768 },
    ],
  },
  {
    slug: "parkeerplaats-de-gijselaar-amstenrade",
    title: "Parkeerplaats De Gijselaar",
    location: "Amstenrade",
    categories: ["parkeren", "herinrichting"],
    summary: "Eerste fase van de parkeervoorziening voor nieuwbouwwijk De Gijselaar.",
    description: [
      "In opdracht van de gemeente Beekdaelen realiseren wij de eerste fase van het parkeerterrein voor de nieuwe woonwijk De Gijselaar, gelegen tussen het clubhuis van de voetbalvereniging en de basisschool.",
      "Het project omvat ook voorbereidende werkzaamheden voor de naastgelegen nieuwbouw, waaronder een vergrote buffercapaciteit — een absolute meerwaarde voor de omgeving.",
    ],
    highlights: ["Opdrachtgever: Gemeente Beekdaelen", "Vergrote buffercapaciteit", "Voorbereiding nieuwbouw"],
    images: [
      { src: `${WP}/afbeelding-van-whatsapp-op-2024-12-17-om-15.22.02_dfcdde67.jpg`, alt: "Parkeerplaats De Gijselaar in Amstenrade", width: 1600, height: 1200 },
    ],
  },
  {
    slug: "rotonde-elementen-jos-klijnenlaan",
    title: "Rotonde-elementen Jos Klijnenlaan",
    location: "Jos Klijnenlaan",
    categories: ["verkeer"],
    summary: "Rotonde geschikt gemaakt voor vrachtverkeer met prefab elementen.",
    description: [
      "Om de rotonde beter geschikt te maken voor vrachtverkeer vervangen wij de rammelstrook en de rotondeblokken door prefab elementen van Leicon.",
      "De uitvoering gebeurt in twee fasen, zodat de doorstroming gegarandeerd blijft — samen met onze eigen verkeersafdeling (verkeersmaatregelen en verkeersregelaars).",
    ],
    highlights: ["Prefab elementen Leicon", "Uitvoering in 2 fasen", "Doorstroming gegarandeerd"],
    images: [
      { src: `${WP}/afbeelding-van-whatsapp-op-2025-10-14-om-15.51.53_45006dc5.jpg`, alt: "Rotonde Jos Klijnenlaan met nieuwe prefab elementen", width: 1600, height: 1200 },
      { src: `${WP}/afbeelding-van-whatsapp-op-2025-10-14-om-15.51.53_31c4fb31-1024x768.jpg`, alt: "Plaatsen van rotonde-elementen", width: 1024, height: 768 },
    ],
  },
  {
    slug: "synagoge-meerssen",
    title: "Toegankelijke entree Synagoge",
    location: "Meerssen",
    categories: ["straatwerk"],
    summary: "Rolstoeltoegankelijke entree met hellingbaan en lift, in stijl van het gebouw.",
    description: [
      "Voor de Synagoge te Meerssen maken wij de entree rolstoeltoegankelijk: een hellingbaan, een lift voor mindervaliden en diverse andere aanpassingen.",
      "Het werk wordt uitgevoerd in stijl met het gebouw, met natuursteen, veldbrand en gebakken straatbakstenen.",
    ],
    highlights: ["Hellingbaan en lift", "Natuursteen en veldbrand", "Gebakken straatbakstenen"],
    images: [
      { src: `${WP}/impressie-bestrating-bruin-rood-1024x585.jpg`, alt: "Impressie bestrating entree Synagoge Meerssen", width: 1024, height: 585 },
      { src: `${WP}/afbeelding-van-whatsapp-op-2025-12-02-om-12.29.03_d2b7a7c4-1-1024x576.jpg`, alt: "Werkzaamheden entree Synagoge Meerssen", width: 1024, height: 576 },
    ],
  },
];
