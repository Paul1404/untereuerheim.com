# untereuerheim.com

Die Website für Untereuerheim, Ortsteil von Grettstadt im Landkreis Schweinfurt.

## Stack

Astro 6 (static), Tailwind v4, Bun. Deploy auf Railway über Dockerfile, ausgeliefert von einem schlanken Bun-Static-Server.

## Lokal starten

```bash
bun install
bun run dev
```

Läuft dann auf http://localhost:4321.

## Bauen und ausliefern

```bash
bun run build
bun run server.ts
```

`server.ts` ist ein Bun-Static-Server. Bindet an `process.env.HOST` (Default `0.0.0.0`) und `process.env.PORT` (Default `4321`). Railway setzt `PORT` automatisch.

## Skripte

| Befehl | Zweck |
|---|---|
| `bun run dev` | Astro Dev-Server mit HMR |
| `bun run build` | Statischer Build nach `dist/` |
| `bun run start` | Bun-Static-Server (`server.ts`) |
| `bun run check` | TypeScript- und Astro-Check |
| `bun run icons` | Favicons aus `public/favicon.svg` erzeugen |
| `bun run og` | OG-Bild `public/og.jpg` (1200x630) aus dem Luftbild erzeugen |
| `bun run optimize-images` | Quellbilder in `src/assets/images/` auf 2500 px / Q82 kappen |

## Chronik-Eintrag hinzufügen

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

`sortKey` ist eine Zahl, damit auch unscharfe Jahreszahlen wie `"16. Jh."` an die richtige Stelle der Zeitleiste sortieren. `image` und `imageAlt` sind optional.

## Bilder hinzufügen

1. Datei nach `src/assets/images/` legen.
2. `bun run optimize-images` ausführen (kappt zu große Quellen auf 2500 px, JPEG-Qualität 82).
3. In der Astro-Komponente importieren und in `<Figure>` oder `<Image>` einsetzen. Astro übernimmt das Erzeugen mehrerer Größen, WebP-Konvertierung und Lazy Loading.

## Deployment auf Railway

Railway erkennt das `Dockerfile` und baut damit. Healthcheck in `railway.toml` zeigt auf `/health.json` (statisches File). Domain im Railway-Dashboard verbinden.

Umgebungsvariablen siehe `.env.example`.

## Inhalt pflegen

| Bereich | Datei |
|---|---|
| Hero | `src/components/Hero.astro` |
| Der Ort | `src/components/DerOrt.astro` |
| Chronik | `src/content/chronik/*.md` |
| Institutionen | `src/components/Institutionen.astro` |
| Footer | `src/components/Footer.astro` |
| Impressum | `src/pages/impressum.astro` |
| Datenschutz | `src/pages/datenschutz.astro` |

## Quellen

Die Chronik stützt sich auf die Angaben der Gemeinde Grettstadt, des Bistums Würzburg und der gängigen Lexika. Wer einen Fehler findet, soll ihn bitte melden, Kontakt im Impressum.
