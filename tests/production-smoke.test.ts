import { expect, test } from "bun:test";
import { smokeSite } from "../scripts/smoke";

test("built site serves its pages and assets with origin protection", async () => {
  const port = 15_000 + (process.pid % 30_000);
  const base = `http://127.0.0.1:${port}`;
  const secret = "isolated-smoke-test-secret";
  const server = Bun.spawn([process.execPath, "run", "server.ts"], {
    cwd: new URL("..", import.meta.url).pathname,
    env: { ...process.env, PORT: String(port), HOST: "127.0.0.1", ORIGIN_AUTH_SECRET: secret },
    stdout: "ignore",
    stderr: "inherit",
  });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (server.exitCode !== null) throw new Error(`Production server exited with ${server.exitCode}`);
      try {
        const response = await fetch(`${base}/health.json`, { signal: AbortSignal.timeout(500) });
        if (response.ok) { ready = true; break; }
      } catch { /* Wait for the server to bind its port. */ }
      await Bun.sleep(100);
    }
    expect(ready).toBe(true);
    const result = await smokeSite(base, secret);
    console.log(`Verified ${result.pages} pages and ${result.assets} assets`);
  } finally {
    server.kill();
    await server.exited;
  }
}, 60_000);
