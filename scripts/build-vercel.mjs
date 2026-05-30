import { spawn } from "node:child_process";

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const child = spawn(npmCmd, ["run", "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NITRO_PRESET: "vercel",
  },
});

child.on("error", (error) => {
  console.error("Failed to start Vercel build process:", error);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
