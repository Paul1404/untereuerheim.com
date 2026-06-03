# untereuerheim.com

Die Website für Untereuerheim, Ortsteil von Grettstadt im Landkreis Schweinfurt. Eine statisch erzeugte, redaktionell gestaltete Ortsseite: Hero mit Luftbild, eine bebilderte Chronik vom frühen Mittelalter bis zur Eingemeindung, ein Archiv der Baudenkmäler und die Institutionen vor Ort.

Kein CMS, keine Datenbank, kein Client-Framework. Der Inhalt liegt als Markdown und typisierte Datenstrukturen im Repository, wird zur Bauzeit zu reinem HTML gerendert und von einem schlanken Bun-Server mit Sicherheits- und Cache-Headern ausgeliefert.

---

## Überblick

| | |
|---|---|
| Art | Statische Multi-Page-Site (kein SPA, kein Hydration-Runtime) |
| Sprache | Deutsch, eine Locale (`de-DE`) |
| Seiten | `/` (Hero, Der Ort, Chronik, Institutionen), `/archiv`, `/impressum`, `/datenschutz`, `/404` |
| JavaScript im Browser | Drei kleine, eigenständige Skripte: Reveal-on-Scroll, Chronik-Zeitstrahl, Zählanimation. Sonst nichts. |
| Ausgabe | Statisches HTML/CSS/Assets nach `dist/`, ausgeliefert über `server.ts` (Bun) |

Gestalterische Leitidee: eine gedruckte Ortschronik, ins Web übersetzt. Serifen-Display, Initialen, Marginalien, Kapitelnummern, Schmucklinien, eine warme Sandstein-Palette. Bewegung gibt es nur dort, wo sie etwas ordnet, und sie respektiert `prefers-reduced-motion` durchgehend.

---

## Tech-Stack

| Schicht | Tool | Version | Warum |
|---|---|---|---|
| Framework | [Astro](https://astro.build) | 6 | Islands-Architektur, liefert standardmäßig null JS aus. Passt zu einer Inhaltsseite. |
| Rendering | `output: "static"` | | Vollständig vorgerendert zur Bauzeit. Kein Node-Runtime im Hot Path. |
| Styling | [Tailwind CSS](https://tailwindcss.com) | v4 | Über das Vite-Plugin `@tailwindcss/vite`, keine `tailwind.config.js`. Design-Tokens stehen als `@theme` direkt in `global.css`. |
| Schriften | Fontsource | | `Cormorant Garamond` (Serif, Display) und `Inter Variable` (Sans, Fließtext), selbst gehostet, keine externen Requests. |
| Inhaltsmodell | Astro Content Collections | | Glob-Loader plus Zod-Schema für die Chronik. Typsicher zur Bauzeit. |
| Bilder | `astro:assets` + [sharp](https://sharp.pixelplumbing.com) | | Responsive `srcset`, WebP, Lazy Loading im Build; sharp-Skripte für Quelloptimierung, OG-Bild und Favicons. |
| Sitemap | `@astrojs/sitemap` | | Erzeugt `sitemap-index.xml` automatisch aus `site`. |
| Runtime + Paketmanager | [Bun](https://bun.sh) | 1.3.x | Installiert Abhängigkeiten und betreibt den Produktions-Static-Server. |
| Sprache | TypeScript | 6 | `astro/tsconfigs/strict`, Pfad-Alias `~/*` → `src/*`. |
| CI | GitHub Actions | | `bun run check` + `bun run build` bei jedem PR und Push auf `main`. |
| Deploy | Docker auf [Railway](https://railway.com) | | Mehrstufiges Dockerfile, Healthcheck auf `/health.json`. |

Bewusst **nicht** im Einsatz: kein React/Vue/Svelte im Client, kein CSS-in-JS, kein Tailwind-Config-File, kein externer Font- oder Analytics-Dienst, keine Laufzeit-Datenquelle.

---

## Architektur

### Rendering-Modell

Alles wird zur Bauzeit aufgelöst. `astro build` rendert jede Route zu statischem HTML, optimiert die Bilder in `_astro/`, inlined kritisches CSS und kleine Skripte und schreibt das Ergebnis nach `dist/`. Im Betrieb läuft nur ein Dateiserver; es gibt kein SSR, keine API-Routen und keinen Datenbankzugriff.

### Projektstruktur

```
src/
  layouts/
    Base.astro          Dokument-Hülle: <head>, Meta, JSON-LD, Skip-Link, Reveal-Observer
  components/
    Nav.astro           Fixe Kopfzeile + Lesefortschritts-Band (Scroll-Timeline)
    Hero.astro          Vollbild-Luftbild, choreografierter Einstieg, Eckdaten
    DerOrt.astro        Faktentabelle + redaktionelle Figuren
    Chronik.astro       Zeitstrahl aus der Content Collection, Zählanimation
    Institutionen.astro Datengetriebene Karten (Verein, Mühle, Kirche, Mainsteg ...)
    Figure.astro        Wiederverwendbare Bildfigur mit Zoom/Parallax/Ring
    Footer.astro        Rechtliche Links, Jahr
  content/
    chronik/*.md        Eine Markdown-Datei je Chronik-Eintrag
  content.config.ts     Collection-Definition + Zod-Schema
  pages/
    index.astro         Startseite (komponiert die Sektionen)
    archiv.astro        Baudenkmäler, Detailtafeln, Quellen (Inline-Daten)
    impressum.astro
    datenschutz.astro
    404.astro
  styles/
    global.css          Tailwind-Import, @theme-Tokens, das gesamte Design-System
  assets/images/        Quellbilder (von Astro verarbeitet)
public/                 Unveränderte Assets: Favicons, manifest, robots, health.json, og.jpg
scripts/                sharp-Werkzeuge: Icons, OG-Bild, Bildoptimierung
server.ts               Bun-Static-Server für die Produktion
Dockerfile              Mehrstufiger Build
railway.toml            Deploy-Konfiguration
```

### Komposition

`index.astro` setzt die Startseite aus den Sektions-Komponenten zusammen, getrennt durch `.section-rule`-Haarlinien. Jede Sektion ist eigenständig und zieht ihre Daten dort, wo sie hingehören: Die Chronik aus der Content Collection, die Institutionen aus einem typisierten Array in der Komponente, das Archiv aus Inline-Strukturen in `archiv.astro`. Es gibt keinen globalen Zustand.

---

## Inhaltsmodell

### Chronik (Content Collection)

Die Chronik ist die einzige formale Content Collection. Definiert in `src/content.config.ts` über den Glob-Loader, validiert mit Zod:

```ts
const chronik = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/chronik" }),
  schema: ({ image }) =>
    z.object({
      year: z.union([z.number(), z.string()]), // "1152" oder "16. Jh."
      sortKey: z.number(),                      // numerisch, sortiert auch unscharfe Jahre
      title: z.string(),
      description: z.string(),
      image: image().optional(),                // von Astro verarbeitet
      imageAlt: z.string().optional(),
    }),
});
```

Zwei Details, die das Modell tragen:

- **`sortKey` getrennt von `year`.** `year` ist Anzeigetext und darf unscharf sein (`"um 800"`, `"16. Jh."`). `sortKey` ist die Zahl, nach der `Chronik.astro` die Einträge ordnet. So landet ein unscharfer Eintrag trotzdem an der richtigen Stelle im Zeitstrahl.
- **`image()` statt `string`.** Der Zod-Helfer `image()` bindet das Bild in Astros Asset-Pipeline ein, statt nur einen Pfad zu speichern. Dadurch bekommt jedes Chronik-Bild Responsive-Größen und WebP, ohne Zusatzarbeit.

Beim Rendern zerlegt `parseYear()` das Anzeige-Jahr per Regex in `prefix / num / suffix`, damit der numerische Teil separat hochgezählt werden kann (siehe Zählanimation), während Präfix und Suffix stehen bleiben.

### Archiv und Institutionen (Inline-Daten)

`/archiv` und die Institutionen-Karten brauchen kein Markdown. Ihre Daten stehen als typisierte Arrays direkt in der jeweiligen `.astro`-Datei (`Denkmal[]`, `Inst[]`). Das ist Absicht: Diese Listen sind selten, klein und eng an ihr Layout gekoppelt. Eine Collection wäre Overhead. Die Baudenkmäler tragen ihre offiziellen Denkmal-IDs des Bayerischen Landesamts für Denkmalpflege (`D-6-78-138-…`).

---

## Design-System

Das gesamte System lebt in `src/styles/global.css`. Keine UI-Bibliothek, keine Komponenten-Styles verteilt über das Projekt; die Komponenten setzen Tailwind-Utilities und greifen auf eine kleine Menge benannter Klassen und Tokens zu.

### Tokens (`@theme`)

Tailwind v4 liest Design-Tokens aus dem `@theme`-Block. Daraus generiert es Utility-Klassen, die Komponenten als `text-[color:var(--color-ink)]` o. ä. nutzen.

```css
@theme {
  --color-paper: #faf8f5;        /* warmes Off-White, Hintergrund */
  --color-paper-2: #f3eee5;
  --color-ink: #1f1b16;          /* fast-schwarze Tinte */
  --color-ink-soft: #3a342c;
  --color-muted: #75695a;
  --color-line: #e7dfd1;         /* Haarlinien */
  --color-line-strong: #d9cdb6;
  --color-sandstone: #9a6a3d;    /* Leitfarbe, fränkischer Sandstein */
  --color-sandstone-soft: #b48a5e;
  --color-wine: #6b1f2a;         /* Akzent */

  --font-serif: "Cormorant Garamond", ui-serif, Georgia, serif;
  --font-sans:  "Inter Variable", ui-sans-serif, system-ui, sans-serif;

  --shadow-soft: 0 1px 2px rgb(31 27 22 / 0.04), 0 8px 30px -12px rgb(31 27 22 / 0.10);
}
```

### Typografie

- Überschriften und Display in Cormorant Garamond, mit `text-wrap: balance` und optischer Größe.
- Fließtext in Inter Variable mit `text-wrap: pretty` gegen Schusterjungen und aktivierten Stilsets (`ss01`, `cv11`).
- Zahlen nutzen je nach Kontext `lining-nums` oder `tabular-nums`, damit Jahreszahlen und Eckdaten sauber stehen.

### Redaktionelle Bausteine

Wiederverwendbare Klassen, die den Druckcharakter erzeugen:

| Klasse | Wirkung |
|---|---|
| `.dropcap` | Kursive Sandstein-Initiale am Absatzanfang |
| `.pull-quote` | Großes kursives Zitat mit deutschen Anführungszeichen über `::before`/`::after` |
| `.ghost-numeral` | Übergroße, transparente Kapitelzahl hinter Überschriften (zur „Eins/Zwei/Drei“-Auszeichnung) |
| `.numeral-anchor` | Riesige Marginal-Zahl als Anker im Archiv |
| `.marginalia` | Kleine Randnotizen neben dem Haupttext |
| `.ornament` + `.ornament-glyph` | Schmucklinie mit kleiner gedrehter Raute in der Mitte |
| `.note-rail` / `.rule-top` / `.section-rule` | Vertikaler Akzentstrich, obere Haarlinie, zentrierte Verlaufstrennlinie |
| `.link-underline` | Unterstrich, der sich beim Hover per `background-size` von links aufzieht |

### Hintergrund

Der Body trägt keine Volltonfläche, sondern drei übereinandergelegte Schichten: zwei `radial-gradient`-Lichthöfe in Sandstein und Wein plus eine inline als Data-URI eingebettete SVG-Textur (`feTurbulence`, fraktales Rauschen), `background-attachment: fixed`. Das gibt dem Papier eine leichte Körnung, ohne ein einziges zusätzliches Asset zu laden.

---

## Bewegung und Interaktion

Bewegung ist sparsam und größtenteils CSS-getrieben. Drei Techniken, abgestuft nach Browser-Support, mit Fallbacks und überall `prefers-reduced-motion`-Abschaltung.

### 1. Native Scroll-Timelines (CSS, kein JS)

Wo der Browser `animation-timeline` unterstützt, laufen scrollgekoppelte Effekte komplett ohne JavaScript:

- **Lesefortschritts-Band** (`Nav.astro`): ein 2px-Verlaufsstreifen oben, `animation-timeline: scroll(root)`, skaliert von 0 auf 1 über die Seitenlänge.
- **Parallax der großen Fotos** (`.parallax-media`): `animation-timeline: view()`, die Bilder driften beim Vorbeiscrollen leicht. Sie sind überskaliert (`scale(1.12)`), damit nie ein Rand sichtbar wird.

Beide stehen hinter `@supports (animation-timeline: …)` und `@media (prefers-reduced-motion: no-preference)`. Fehlt der Support, sitzt das Band bei Breite 0 und das Bild still. Kein Polyfill, keine Kosten.

### 2. Hero-Choreografie und View Transitions (CSS)

Der Hero steigt einmalig beim ersten Paint gestaffelt ein: Eyebrow, Headline, Lede und Eckdaten tragen je ein eigenes `--enter-delay` auf der Keyframe-Animation `hero-enter`, sodass sie nacheinander statt gleichzeitig erscheinen. Anschließend zieht sich per `headline-underline` eine Sandstein-Linie unter den Ortsnamen. Seitenwechsel nutzen die View Transitions API (`@view-transition { navigation: auto; }`).

### 3. JavaScript-Inseln (drei kleine Skripte)

Nur drei Dinge brauchen echtes JS, jeweils klein und mit Fallback:

- **Reveal-on-Scroll** (`Base.astro`): ein `IntersectionObserver` setzt `.is-visible` auf `.reveal`-Elemente. Ohne `IntersectionObserver` werden alle sofort sichtbar gemacht.
- **Chronik-Zeitstrahl** (`Chronik.astro`): füllt die Sandstein-Schiene am Zeitstrahl proportional zur Scroll-Position (`--progress`, gedrosselt per `requestAnimationFrame`).
- **Zählanimation** (`Chronik.astro`): zählt jede Jahreszahl beim Eintreten ins Viewport mit Cubic-Ease auf ihren Zielwert hoch. Bei reduzierter Bewegung oder fehlendem Observer steht sofort der Endwert.

Jede Animation hat ihren `prefers-reduced-motion: reduce`-Gegenpart, der sie auf den Endzustand setzt und Transitions abschaltet.

---

## Bilder-Pipeline

Drei getrennte Stufen, alle auf sharp:

1. **Quelloptimierung** (`bun run optimize-images`): kappt Bilder in `src/assets/images/` auf maximal 2500 px (Lanczos3), JPEG Qualität 82 mit mozjpeg/progressive, PNG mit Kompressionsstufe 9. Schreibt nur zurück, wenn das Ergebnis kleiner ist, und meldet die Ersparnis pro Datei und gesamt. Das hält das Repository schlank.
2. **Build-Verarbeitung** (Astro `<Image>` / `Figure.astro`): erzeugt zur Bauzeit mehrere Breiten (z. B. `[640, 960, 1280, 1920]`), korrektes `sizes`, WebP, `loading="lazy"`, `decoding="async"`. Der Hero lädt `eager` mit `fetchpriority="high"`. `responsiveStyles: true` in `astro.config.mjs` erzeugt die passenden Layout-Styles mit.
3. **OG-Bild** (`bun run og`): schneidet das Luftbild auf exakt 1200×630 (`og.jpg`) für Social-Previews.

Favicons entstehen ebenfalls aus einer Quelle: `bun run icons` rendert aus `public/favicon.svg` per sharp das komplette Set (16/32, apple-touch 180, 192, 512) und baut die `favicon.ico` (16/32/48) byteweise selbst zusammen, dazu die `manifest.webmanifest`.

---

## SEO und strukturierte Daten

Die Seite ist für lokale Auffindbarkeit gebaut. `Base.astro` setzt pro Seite:

- Canonical-URL, OpenGraph- und Twitter-Card-Meta, `og:locale=de_DE`, OG-Bild mit Maßen und Alt-Text.
- Geo-Meta (`geo.region`, `geo.position`, `ICBM`) mit den Ortskoordinaten.
- Vollständiges Favicon- und Manifest-Linkset, `theme-color`.
- Font-Preloads für die beiden Cormorant-Schnitte, damit das Display-Lettering nicht nachzieht.

Auf der Startseite wird ein **JSON-LD-`@graph`** ausgegeben, das den Ort maschinenlesbar beschreibt: `WebSite`, `Place` (mit `GeoCoordinates`, `PostalAddress`, verschachtelten `AdministrativeArea` für Grettstadt und Landkreis Schweinfurt, `sameAs` auf Wikipedia) sowie die lokalen Akteure als `SportsOrganization`, `LocalBusiness` (Schlossmühle), `Church` (St. Gallus) und `Organization` (Mainbrückenverein). Die Knoten sind über stabile `@id`-Fragmente verlinkt.

`@astrojs/sitemap` erzeugt die Sitemap, `public/robots.txt` verweist darauf.

---

## Der Static-Server (`server.ts`)

In Produktion liefert ein eigener Bun-Server `dist/` aus. Astros Preview-Server wird dafür nicht verwendet. Der Server ist klein, hat keine Abhängigkeiten und macht drei Dinge:

**Pfadauflösung.** `resolve()` bildet saubere URLs auf Dateien ab: `/` → `index.html`, direkter Treffer, sonst `pfad/index.html` oder `pfad.html` für erweiterungslose Pfade, und `pfad/index.html` bei abschließendem Slash. Greift nichts, wird `404.html` mit Status 404 ausgeliefert.

**Sicherheits-Header auf jeder Antwort.** Eine restriktive Content-Security-Policy (`default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `upgrade-insecure-requests`), dazu `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, eine sperrende `Permissions-Policy` und HSTS. `'unsafe-inline'` für Skripte und Styles ist bewusst gesetzt, weil Astro kleine Seiten-Skripte und kritisches CSS zur Bauzeit inlined; da es keine Nutzereingaben gibt, bleibt der relevante Schutz Framing-, Base-URI-, Object- und Transport-Härtung.

**Gestufte Cache-Control.** Gehashte Build-Assets unter `/_astro/` bekommen `immutable` für ein Jahr, statische Medien (Fonts, Bilder, Icons, Manifest) einen Tag, HTML `no-cache`.

Gebunden wird an `HOST` (Default `0.0.0.0`) und `PORT` (Default `4321`). Railway injiziert `PORT` automatisch.

---

## Lokal entwickeln

```bash
bun install
bun run dev
```

Läuft dann auf http://localhost:4321 mit HMR.

Produktion lokal nachstellen:

```bash
bun run build      # statischer Build nach dist/
bun run server.ts  # der echte Produktions-Server
```

---

## Skripte

| Befehl | Zweck |
|---|---|
| `bun run dev` | Astro Dev-Server mit HMR |
| `bun run build` | Statischer Build nach `dist/` |
| `bun run start` | Bun-Static-Server (`server.ts`) |
| `bun run check` | TypeScript- und Astro-Diagnose (`astro check`) |
| `bun run icons` | Favicon-Set + Manifest aus `public/favicon.svg` erzeugen |
| `bun run og` | OG-Bild `public/og.jpg` (1200×630) aus dem Luftbild erzeugen |
| `bun run optimize-images` | Quellbilder in `src/assets/images/` auf 2500 px / Q82 kappen |

---

## Build und Deployment

### Dockerfile

Mehrstufiger Build, damit das Laufzeit-Image klein und ohne Build-Werkzeuge bleibt:

1. **`builder`** (`oven/bun:alpine`): installiert Abhängigkeiten mit `--frozen-lockfile` und baut die Site.
2. **`runner`** (`oven/bun:alpine`): kopiert nur `dist/` und `server.ts`, legt einen Nicht-Root-Nutzer `app` an, setzt `NODE_ENV`, `HOST`, `PORT` und startet `bun run server.ts`. Keine `node_modules` zur Laufzeit nötig, weil der Server keine Abhängigkeiten hat.

### Railway

`railway.toml` legt fest: Build über das Dockerfile, Healthcheck auf `/health.json` (eine statische Datei in `public/`, die immer 200 liefert, sobald der Server steht), `restartPolicyType = ON_FAILURE`. Railway erkennt das Dockerfile automatisch und injiziert `PORT`. Domain wird im Railway-Dashboard verbunden.

### CI

`.github/workflows/ci.yml` läuft bei jedem Pull Request und bei Push auf `main`: Bun einrichten, `bun install --frozen-lockfile`, dann `bun run check` und `bun run build`. Bricht der Typecheck oder der Build, schlägt CI fehl.

---

## Inhalte pflegen

### Chronik-Eintrag hinzufügen

Eine Markdown-Datei in `src/content/chronik/` ablegen:

```yaml
---
year: 1880
sortKey: 1880
title: Kurze Überschrift
description: Ein Satz, der beschreibt, was passiert ist.
image: "../../assets/images/optional-foto.jpg"
imageAlt: "Alt-Text für das Bild."
---
```

`sortKey` ist die Zahl, nach der einsortiert wird, auch bei unscharfen `year`-Angaben wie `"16. Jh."`. `image` und `imageAlt` sind optional.

### Bild hinzufügen

1. Datei nach `src/assets/images/` legen.
2. `bun run optimize-images` ausführen (kappt zu große Quellen auf 2500 px, JPEG Q82).
3. In der Astro-Komponente importieren und in `<Figure>` oder `<Image>` einsetzen. Astro erzeugt mehrere Größen, WebP und Lazy Loading automatisch.

### Wo welcher Inhalt liegt

| Bereich | Datei |
|---|---|
| Hero | `src/components/Hero.astro` |
| Der Ort (Eckdaten) | `src/components/DerOrt.astro` |
| Chronik | `src/content/chronik/*.md` |
| Institutionen | `src/components/Institutionen.astro` |
| Archiv (Baudenkmäler, Quellen) | `src/pages/archiv.astro` |
| Footer | `src/components/Footer.astro` |
| Impressum | `src/pages/impressum.astro` |
| Datenschutz | `src/pages/datenschutz.astro` |
| Design-Tokens und Klassen | `src/styles/global.css` |
| Meta, SEO, JSON-LD | `src/layouts/Base.astro` |

---

## Umgebungsvariablen

Siehe `.env.example`. Nur zwei, beide mit Defaults:

| Variable | Default | Zweck |
|---|---|---|
| `PORT` | `4321` | HTTP-Port. Railway setzt das automatisch. |
| `HOST` | `0.0.0.0` | Bind-Adresse. In Containern `0.0.0.0`. |

---

## Quellen

Die Chronik und das Archiv stützen sich auf die Angaben der Gemeinde Grettstadt, des Bistums Würzburg, des Bayerischen Landesamts für Denkmalpflege, der gängigen Lexika und der Vereine vor Ort. Die vollständige Belegliste steht unter `/archiv`. Wer einen Fehler findet, möge ihn bitte melden, Kontakt im Impressum.
