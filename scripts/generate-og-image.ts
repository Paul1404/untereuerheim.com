import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const publicDir = resolve(root, "public");
mkdirSync(publicDir, { recursive: true });

const source = resolve(root, "src/assets/images/luftbild-untereuerheim.jpg");
const out = resolve(publicDir, "og.jpg");

await sharp(source)
  .resize(1200, 630, { fit: "cover", position: "centre", kernel: "lanczos3" })
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toFile(out);

console.log("wrote og.jpg (1200x630)");
