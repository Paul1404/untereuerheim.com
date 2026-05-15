import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { resolve, extname, join } from "node:path";

const imageDir = resolve(import.meta.dir, "../src/assets/images");
const MAX_DIM = 2500;
const JPEG_QUALITY = 82;
const PNG_COMPRESSION = 9;

const files = readdirSync(imageDir).filter((f) => /\.(jpe?g|png)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = join(imageDir, file);
  const ext = extname(file).toLowerCase();
  const before = statSync(filePath).size;
  totalBefore += before;

  const metadata = await sharp(filePath).rotate().metadata();
  if (!metadata.width || !metadata.height) {
    console.log(`skip ${file}: no metadata`);
    totalAfter += before;
    continue;
  }

  const needsResize = metadata.width > MAX_DIM || metadata.height > MAX_DIM;

  let pipeline = sharp(filePath).rotate();
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_DIM,
      height: MAX_DIM,
      fit: "inside",
      withoutEnlargement: true,
      kernel: "lanczos3",
    });
  }

  const buffer =
    ext === ".png"
      ? await pipeline.png({ compressionLevel: PNG_COMPRESSION }).toBuffer()
      : await pipeline
          .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
          .toBuffer();

  if (buffer.length < before) {
    await Bun.write(filePath, buffer);
    totalAfter += buffer.length;
    const beforeMb = (before / 1024 / 1024).toFixed(2);
    const afterMb = (buffer.length / 1024 / 1024).toFixed(2);
    const saved = (100 - (buffer.length / before) * 100).toFixed(0);
    console.log(
      `${file}: ${beforeMb} MB → ${afterMb} MB (-${saved}%, ${metadata.width}×${metadata.height}${needsResize ? " → capped " + MAX_DIM + "px" : ""})`,
    );
  } else {
    totalAfter += before;
    console.log(`${file}: already optimal`);
  }
}

const beforeMb = (totalBefore / 1024 / 1024).toFixed(2);
const afterMb = (totalAfter / 1024 / 1024).toFixed(2);
const saved = (100 - (totalAfter / totalBefore) * 100).toFixed(0);
console.log(`\ntotal: ${beforeMb} MB → ${afterMb} MB (-${saved}%)`);
