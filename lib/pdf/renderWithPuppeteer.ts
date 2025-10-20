import fs from "node:fs/promises";
import type { Dirent } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import { CollaboratorDocumentPayload } from "@/lib/documents/types";
import { renderDocumentHtml } from "@/app/collaborateurs/chat/templates/DocumentTemplate";

const DEFAULT_RENDER_CACHE_DIR = "/opt/render/.cache/puppeteer";

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

  const executablePath = await resolveChromeExecutablePath();

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath,
  });

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
