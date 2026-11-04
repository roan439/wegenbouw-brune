# Wegenbouw Brune B.V. — website

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · GSAP ScrollTrigger · Framer Motion.
Klaar voor Vercel.

## Snel starten

```bash
npm install
cp .env.example .env.local   # vul de waarden in
npm run dev                  # http://localhost:3000
npm run build && npm start   # productie lokaal
```

## Deploy op Vercel

1. Push de map naar GitHub en importeer het project in Vercel (framework wordt automatisch herkend).
2. Zet de environment variables uit `.env.example` in Vercel → Settings → Environment Variables:
   - `NEXT_PUBLIC_SITE_URL` — bijv. `https://www.wegenbouw-brune.nl`
   - `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` — e-mailverzending (zie hieronder)
   - `FORM_SIGNING_SECRET` — lange willekeurige string (`openssl rand -hex 32`)
   - optioneel `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (Cloudflare Turnstile)
3. Koppel het domein.

## Hero: scroll-gestuurde reconstructie

- Bron: `assets/hero.mp4` (9:16, 768×1344, 124 frames).
- Frames staan in `public/hero/v1/` — `d/` (768 px, tablet/desktop), `m/` (540 px, mobiel), beide AVIF
  (± 4,2 MB / 2,5 MB totaal) met WebP-fallback in `dw/` en `mw/`. Poster + eindframe voor LCP en reduced motion.
- Opnieuw genereren: `bash scripts/extract-frames.sh assets/hero.mp4 v2` en daarna `BASE`/`FRAME_COUNT`
  aanpassen in `src/components/hero/HeroSequence.tsx`.
- Engine (`src/components/hero/frame-sequence.ts`): laadt pas na het `load`-event, grof-naar-fijn
  (eerste frame, laatste, elke 32e … elke frame), max. 6 gelijktijdig, prioriteit voor de scrollpositie,
  en tekent altijd het dichtstbijzijnde geladen frame, dus nooit een leeg canvas. Save-Data/2G: halve framerate, lichte set.
- Pinning gebeurt met native `position: sticky` (geen transform-pinning), zodat touch-scrollen
  gewoon met de vinger meegaat; ScrollTrigger levert de voortgang, met `ignoreMobileResize` tegen sprongen
  door de adresbalk. Hoogtes in `lvh`.
- Desktop: de 9:16-film staat in een ingelijst paneel met een vervaagde full-bleed achtergrond.
  Opschalen naar 16:9 zou de beeldkwaliteit onnodig verlagen. Een echte 16:9-render kan als bron voor `d/` dienen.
- `prefers-reduced-motion`: statische hero met eindframe en alle drie de koppen.

## Content & CMS

| Bestand | Inhoud |
|---|---|
| `src/content/site.ts` | Bedrijfsgegevens, adres, KvK/BTW, documenten, referenties, navigatie |
| `src/content/services.ts` | Werkzaamheden |
| `src/content/projects.ts` | Projecten + categorieën (filters) |
| `src/content/process.ts` | Werkwijze-stappen |
| `src/lib/cms.ts` | `getProjects()` — de enige plek om een CMS (Sanity, WordPress REST, Storyblok …) aan te sluiten |

Alle gegevens komen van www.wegenbouw-brune.nl (nov. 2026). Er zijn geen projecten, cijfers of
statistieken verzonnen.

**Projectfoto's** worden nu geladen vanaf de bestaande WordPress-site (`next.config.ts` → `remotePatterns`).
Verhuis ze vóór het uitfaseren van de oude site naar `public/projecten/` of naar de CMS-mediabibliotheek.
Mislukt een foto, dan toont `ProjectImage` een nette placeholder.

**Logo:** `src/components/Logo.tsx` is een typografisch woordmerk. Vervang het door het officiële logobestand
als dat gewenst is.

## Contactformulier

`POST /api/contact` (Node runtime) valideert met Zod en verstuurt via de Resend REST-API.
Spambescherming: honeypot-veld, ondertekend tijd-token (min. 3 s, max. 2 uur), rate limit (5 per 10 min per IP),
Origin-controle, maximale bodygrootte en optioneel Cloudflare Turnstile. Gebruikersinvoer wordt in de e-mail ge-escaped;
`reply_to` is het adres van de aanvrager. Zonder Resend-configuratie logt de route de aanvraag in development
en geeft hij in productie een nette foutmelding met telefoon en e-mail.

Wilt u liever SMTP (bijv. Microsoft 365)? Vervang het `fetch`-blok in `src/app/api/contact/route.ts` door nodemailer.

## SEO

- `GeneralContractor` JSON-LD met adres, KvK, BTW, werkgebied (Zuid-Limburg, Geleen, Beekdaelen, Meerssen, Beek) en diensten
- Metadata/OpenGraph in `nl_NL`, dynamische OG-afbeelding, `sitemap.xml`, `robots.txt`, canonicals
- Semantische HTML, één `h1`, skip-link, toetsenbordbediening (tabs, dialog, menu) en zichtbare focus

## Om na te lopen vóór livegang

- [ ] Vercel env-variabelen invullen en een testaanvraag versturen
- [ ] Domein van `CONTACT_FROM_EMAIL` verifiëren bij Resend
- [ ] Projectfoto's naar eigen opslag verhuizen
- [ ] Officieel logo plaatsen (optioneel)
- [ ] Bij nieuwe projecten: toevoegen in `projects.ts` of in het CMS
