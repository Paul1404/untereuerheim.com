import { join } from "node:path";

const DIST = join(import.meta.dir, "dist");
const PORT = Number(process.env.PORT) || 4321;
const HOST = process.env.HOST ?? "0.0.0.0";

const CACHE_LONG = "public, max-age=31536000, immutable";
const CACHE_DAY = "public, max-age=86400";
const CACHE_NONE = "no-cache";

const headersFor = (pathname: string): HeadersInit | undefined => {
  if (pathname.startsWith("/_astro/")) return { "cache-control": CACHE_LONG };
  if (/\.(woff2?|ico|svg|webp|jpg|jpeg|png|gif|webmanifest)$/i.test(pathname)) {
    return { "cache-control": CACHE_DAY };
  }
  if (/\.html?$/i.test(pathname) || pathname === "/" || !pathname.includes(".")) {
    return { "cache-control": CACHE_NONE };
  }
  return undefined;
};

const tryFile = async (path: string) => {
  const file = Bun.file(join(DIST, path));
  return (await file.exists()) ? file : null;
};

const resolve = async (pathname: string) => {
  if (pathname === "/") return tryFile("/index.html");
  const direct = await tryFile(pathname);
  if (direct) return direct;
  if (!pathname.endsWith("/") && !pathname.includes(".")) {
    return (
      (await tryFile(pathname + "/index.html")) ?? (await tryFile(pathname + ".html"))
    );
  }
  if (pathname.endsWith("/")) {
    return tryFile(pathname + "index.html");
  }
  return null;
};

Bun.serve({
  port: PORT,
  hostname: HOST,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = decodeURIComponent(url.pathname);

    const file = await resolve(pathname);
    if (file) {
      return new Response(file, { headers: headersFor(pathname) });
    }

    const notFound = await tryFile("/404.html");
    if (notFound) {
      return new Response(notFound, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`static server: http://${HOST}:${PORT}`);
