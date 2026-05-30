import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const viteCliPath = resolve("node_modules", "vite", "bin", "vite.js");

const result = spawnSync(process.execPath, [viteCliPath, "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NITRO_PRESET: "vercel",
  },
});

if (result.error) {
  console.error("Failed to start Vercel build process:", result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
