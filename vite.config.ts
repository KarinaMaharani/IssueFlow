// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const nitroPreset = process.env.NITRO_PRESET ?? "vercel";

export default defineConfig({
  // Outside Lovable-managed deploys, this wrapper falls back to a Vite-only build
  // unless Nitro is explicitly enabled. Force Nitro here so Vercel gets server output.
  nitro: {
    preset: nitroPreset,
    output:
      nitroPreset === "vercel"
        ? {
            dir: ".vercel/output",
            publicDir: "static",
            serverDir: "functions/__server.func",
          }
        : undefined,
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
