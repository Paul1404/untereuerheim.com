import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const publicDir = resolve(root, "public");
mkdirSync(publicDir, { recursive: true });

const svg = readFileSync(resolve(publicDir, "favicon.svg"));

type Target = { name: string; size: number };
const pngTargets: Target[] = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

for (const t of pngTargets) {
  const out = resolve(publicDir, t.name);
  await sharp(svg, { density: 384 }).resize(t.size, t.size).png({ compressionLevel: 9 }).toFile(out);
  console.log(`wrote ${t.name}`);
}

const icoSizes = [16, 32, 48];
const icoBuffers = await Promise.all(
  icoSizes.map((s) => sharp(svg, { density: 384 }).resize(s, s).png().toBuffer()),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);

const dirEntries: Buffer[] = [];
const imageData: Buffer[] = [];
let offset = 6 + icoSizes.length * 16;

for (let i = 0; i < icoSizes.length; i++) {
  const size = icoSizes[i];
  const png = icoBuffers[i];
  if (!size || !png) continue;
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  dirEntries.push(entry);
  imageData.push(png);
  offset += png.length;
}

const ico = Buffer.concat([header, ...dirEntries, ...imageData]);
writeFileSync(resolve(publicDir, "favicon.ico"), ico);
console.log("wrote favicon.ico");

const manifest = {
  name: "Untereuerheim",
  short_name: "Untereuerheim",
  description: "Untereuerheim. Kirchdorf im Landkreis Schweinfurt, am Main.",
  start_url: "/",
  display: "standalone",
  background_color: "#faf8f5",
  theme_color: "#9a6a3d",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
  ],
};

writeFileSync(resolve(publicDir, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));
console.log("wrote manifest.webmanifest");
