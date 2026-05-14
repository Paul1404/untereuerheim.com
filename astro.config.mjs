import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://untereuerheim.com",
  output: "server",
  adapter: node({ mode: "standalone" }),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4321,
  },
  image: {
    responsiveStyles: true,
  },
});
