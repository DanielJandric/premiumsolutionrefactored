import fs from "node:fs/promises";
import type { Dirent } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import {
  Browser,
  ChromeReleaseChannel,
  computeExecutablePath,
  detectBrowserPlatform,
  install as installBrowser,
  resolveBuildId,
} from "@puppeteer/browsers";
import { CollaboratorDocumentPayload } from "@/lib/documents/types";
import { renderDocumentHtml } from "@/app/collaborateurs/chat/templates/DocumentTemplate";

const DEFAULT_RENDER_CACHE_DIR = "/opt/render/.cache/puppeteer";
const downloadLock: { promise: Promise<void> | null } = { promise: null };
let cachedExecutablePath: string | undefined;

async function loadLogoDataUrl(): Promise<string | undefined> {
  const logoPath = path.join(process.cwd(), "public", "logo.png");

  try {
    const file = await fs.readFile(logoPath);
    return `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    return undefined;
  }
}

export async function renderPdfWithPuppeteer(
  payload: CollaboratorDocumentPayload,
): Promise<Uint8Array> {
  const html = renderDocumentHtml({
    ...payload,
    generatedAt: new Date(),
    logoDataUrl: await loadLogoDataUrl(),
  });

  const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };

  const executablePath = await ensureChromeExecutablePath();
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(launchOptions);

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "18mm",
        right: "18mm",
      },
    });

    // Puppeteer returns a Uint8Array in modern versions.
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

async function ensureChromeExecutablePath(): Promise<string | undefined> {
  if (cachedExecutablePath && (await fileExists(cachedExecutablePath))) {
    return cachedExecutablePath;
  }

  let resolved = await resolveChromeExecutablePath();
  if (resolved) {
    cachedExecutablePath = resolved;
    return resolved;
  }

  await downloadChromeIfNeeded();
  resolved = await resolveChromeExecutablePath();
  if (resolved) {
    cachedExecutablePath = resolved;
  }

  return resolved;
}

async function resolveChromeExecutablePath(): Promise<string | undefined> {
  if (!process.env.PUPPETEER_CACHE_DIR && process.env.RENDER === "true") {
    process.env.PUPPETEER_CACHE_DIR = DEFAULT_RENDER_CACHE_DIR;
  }

  const candidates: Array<string | undefined> = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_BIN,
    typeof puppeteer.executablePath === "function" ? puppeteer.executablePath() : undefined,
  ];

  const cacheDir = process.env.PUPPETEER_CACHE_DIR ?? DEFAULT_RENDER_CACHE_DIR;
  const discovered = await findChromeExecutable(cacheDir);
  if (discovered) {
    candidates.push(discovered);
  }

  const seen = new Set<string>();
  for (const candidate of candidates) {
    if (!candidate) continue;
    const trimmed = candidate.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    if (await fileExists(trimmed)) {
      return trimmed;
    }
  }

  return undefined;
}

async function downloadChromeIfNeeded(): Promise<void> {
  if (!process.env.PUPPETEER_CACHE_DIR && process.env.RENDER === "true") {
    process.env.PUPPETEER_CACHE_DIR = DEFAULT_RENDER_CACHE_DIR;
  }

  if (!downloadLock.promise) {
    downloadLock.promise = (async () => {
      const cacheDir = process.env.PUPPETEER_CACHE_DIR ?? DEFAULT_RENDER_CACHE_DIR;
      try {
        await fs.mkdir(cacheDir, { recursive: true });
      } catch {
        // Ignore mkdir errors; download will fail later if directory is unusable.
      }

      try {
        const platform = detectBrowserPlatform();
        if (!platform) {
          return;
        }

        try {
          const { downloadBrowsers } = await import("puppeteer/internal/node/install.js");
          await downloadBrowsers();
        } catch (error) {
          console.warn("[pdf] Puppeteer downloadBrowsers fallback failed, retrying via manual install", error);
        }

        const buildId = await resolveBuildId(Browser.CHROME, platform, ChromeReleaseChannel.STABLE);
        const executableCandidate = computeExecutablePath({
          browser: Browser.CHROME,
          cacheDir,
          platform,
          buildId,
        });

        if (!(await fileExists(executableCandidate))) {
          await installBrowser({
            browser: Browser.CHROME,
            cacheDir,
            platform,
            buildId,
            downloadProgressCallback: process.env.NODE_ENV === "development" ? "default" : undefined,
          });
        }

        if (await fileExists(executableCandidate)) {
          cachedExecutablePath = executableCandidate;
        }
      } catch (error) {
        console.error("[pdf] Unable to download Chrome for Puppeteer", error);
      }
    })();
  }

  const currentPromise = downloadLock.promise;
  if (!currentPromise) {
    return;
  }

  try {
    await currentPromise;
  } finally {
    if (downloadLock.promise === currentPromise) {
      downloadLock.promise = null;
    }
  }
}

async function findChromeExecutable(root: string, depth = 0): Promise<string | undefined> {
  if (!root || depth > 4) {
    return undefined;
  }

  let entries: Dirent[];
  try {
    entries = (await fs.readdir(root, { withFileTypes: true })) as Dirent[];
  } catch {
    return undefined;
  }

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isFile() && isExecutableName(entry.name) && (await fileExists(entryPath))) {
      return entryPath;
    }
    if (entry.isDirectory()) {
      const found = await findChromeExecutable(entryPath, depth + 1);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isExecutableName(fileName: string) {
  const normalized = fileName.toLowerCase();
  return (
    normalized === "chrome" ||
    normalized === "chrome.exe" ||
    normalized === "chromium" ||
    normalized === "chromium.exe"
  );
}
