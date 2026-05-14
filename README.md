# untereuerheim.com

Die Website für Untereuerheim, Ortsteil von Grettstadt im Landkreis Schweinfurt.

## Stack

Astro 6, Tailwind v4, Bun, Node-Adapter, Railway via Dockerfile.

## Lokal starten

```bash
bun install
bun run dev
```

Läuft dann auf http://localhost:4321.

## Bauen und ausliefern

```bash
bun run build
node dist/server/entry.mjs
```

Der Server bindet an `process.env.HOST` (Standard `0.0.0.0` im Container) und `process.env.PORT` (Standard 4321). Railway setzt `PORT` automatisch, also nichts weiter zu tun.

## Favicons

`public/favicon.svg` ist die Quelle. Alle PNGs, die ICO und das Manifest werden daraus erzeugt:

```bash
bun run icons
```

## Chronik-Eintrag hinzufügen

Eine Markdown-Datei in `src/content/chronik/` ablegen:

```yaml
---
year: 1880
sortKey: 1880
title: Kurze Überschrift
description: Ein Satz, der beschreibt, was passiert ist.
---
```

`sortKey` ist eine Zahl. Damit lassen sich auch unscharfe Jahreszahlen wie `"16. Jh."` an die richtige Stelle der Zeitleiste sortieren.

## Deployment auf Railway

Railway erkennt das `Dockerfile` und baut damit. Der Healthcheck steht in `railway.toml` und zeigt auf `/health`. Domain im Railway-Dashboard verbinden.

Umgebungsvariablen siehe `.env.example`.

## Health-Endpoint

`GET /health` liefert `{"status":"ok"}` mit HTTP 200.

## Inhalt pflegen

Wer Texte ändern will, findet sie hier:

- Hero und Tagline: `src/components/Hero.astro`
- Der Ort: `src/components/DerOrt.astro`
- Chronik: `src/content/chronik/*.md`
- Vereine und Institutionen: `src/components/Institutionen.astro`
- Fußzeile: `src/components/Footer.astro`

## Quellen

Die Chronik stützt sich auf die Angaben der Gemeinde Grettstadt, des Bistums Würzburg und der gängigen Lexika. Wer einen Fehler findet, soll ihn bitte melden.
