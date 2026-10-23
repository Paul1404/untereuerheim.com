const TIMEOUT_MS = 5_000;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

/** Read-only checks against the built server, locally or inside Docker. */
export async function smokeSite(base: string, secret: string) {
  const origin = new URL(base).origin;
  const headers = { "x-origin-verify": secret };
  const get = (path: string, authorized = true) => fetch(new URL(path, origin), {
    headers: authorized ? headers : {},
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const health = await get("/health.json", false);
  assert(health.status === 200, `Health returned ${health.status}`);
  assert((await health.json()).status === "ok", "Health payload is not ok");
  const denied = await get("/", false);
  assert(denied.status === 403, `Origin without verification returned ${denied.status}, expected 403`);

  const pending = new Set(["/", "/archiv/", "/institutionen/", "/impressum/", "/datenschutz/"]);
  const checked = new Set<string>();
  let pages = 0;
  let assets = 0;

  const enqueue = (reference: string, parent: URL) => {
    if (reference.startsWith("#")) return;
    const url = new URL(reference, parent);
    if (url.origin !== origin || !["http:", "https:"].includes(url.protocol)) return;
    url.hash = "";
    const path = url.pathname + url.search;
    if (!checked.has(path)) pending.add(path);
  };

  while (pending.size) {
    assert(checked.size < 2_000, "Site crawl exceeded 2,000 URLs");
    const path = pending.values().next().value!;
    pending.delete(path);
    if (checked.has(path)) continue;
    checked.add(path);
    const response = await get(path);
    assert(response.status === 200, `${path} returned ${response.status}, expected 200`);
    assert(response.headers.get("x-content-type-options") === "nosniff", `${path} lost security headers`);
    const type = response.headers.get("content-type") ?? "";
    const parent = new URL(path, origin);
    const extension = parent.pathname.split(".").pop()?.toLowerCase();
    if (extension === "css") assert(type.includes("text/css"), `${path} is not served as CSS`);
    if (extension === "js" || extension === "mjs") assert(type.includes("javascript"), `${path} is not served as JavaScript`);
    if (["webp", "png", "jpg", "jpeg", "svg", "ico"].includes(extension ?? "")) {
      assert(type.startsWith("image/"), `${path} is not served as an image`);
    }
    if (extension === "woff2" || extension === "woff") assert(type.includes("font"), `${path} is not served as a font`);
    if (type.includes("text/html")) {
      pages++;
      const html = await response.text();
      assert(/<title>\s*[^<]+<\/title>/i.test(html), `${path} has no page title`);
      assert(/<h1(?:\s|>)/i.test(html), `${path} has no main heading`);
      // Parse generated HTML with Bun's HTML parser, including responsive images.
      await new HTMLRewriter().on("[href], [src], [srcset]", {
        element(element) {
          for (const name of ["href", "src"]) {
            const value = element.getAttribute(name);
            if (value && !value.startsWith("#")) enqueue(value, parent);
          }
          const srcset = element.getAttribute("srcset");
          if (srcset && !srcset.startsWith("data:")) {
            for (const candidate of srcset.split(",")) {
              const value = candidate.trim().split(/\s+/)[0];
              if (value) enqueue(value, parent);
            }
          }
        },
      }).transform(new Response(html)).text();
    } else {
      assets++;
      if (type.includes("text/css")) {
        const css = await response.text();
        for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]*))\s*\)/g)) {
          enqueue(match[1] ?? match[2] ?? match[3], parent);
        }
      } else {
        assert((await response.arrayBuffer()).byteLength > 0, `${path} is empty`);
      }
      if (path.startsWith("/_astro/")) {
        assert(response.headers.get("cache-control")?.includes("immutable"), `${path} lost immutable caching`);
      }
    }
  }
  assert(pages >= 5 && assets > 0, `Incomplete site: ${pages} pages, ${assets} assets`);
  for (const path of ["/__smoke_missing_page__/", "/_astro/__smoke_missing_asset__.js"]) {
    const missing = await get(path);
    assert(missing.status === 404, `${path} returned ${missing.status}, expected 404`);
  }
  return { pages, assets };
}

if (import.meta.main) {
  const base = process.argv[2];
  const secret = process.env.SMOKE_ORIGIN_SECRET;
  assert(base && secret, "Usage: SMOKE_ORIGIN_SECRET=<test secret> bun scripts/smoke.ts <base URL>");
  const result = await smokeSite(base, secret);
  console.log(`Production smoke passed: ${result.pages} pages and ${result.assets} assets`);
}
