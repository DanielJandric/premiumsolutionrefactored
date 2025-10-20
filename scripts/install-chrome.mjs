import { spawn } from "node:child_process";

const shouldInstall =
  process.env.FORCE_PUPPETEER_INSTALL === "true" ||
  process.env.RENDER === "true" ||
  process.env.CI === "true";

if (!shouldInstall) {
  console.log("[puppeteer] Skipping Chrome download (set FORCE_PUPPETEER_INSTALL=true to force).");
  process.exit(0);
}

const cacheDir =
  process.env.PUPPETEER_CACHE_DIR ??
  (process.env.RENDER === "true" ? "/opt/render/.cache/puppeteer" : undefined);

const args = ["browsers", "install", "chrome"];
if (cacheDir) {
  args.push(`--cache-dir=${cacheDir}`);
}

console.log(`[puppeteer] Installing bundled Chrome into ${cacheDir ?? "default cache"}`);

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(npxCommand, ["puppeteer", ...args], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  if (code !== 0) {
    console.error("[puppeteer] Chrome download failed.");
  }
  process.exit(code ?? 0);
});
