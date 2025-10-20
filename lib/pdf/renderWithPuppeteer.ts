import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { CollaboratorDocumentPayload } from "@/lib/documents/types";
import { renderDocumentHtml } from "@/app/collaborateurs/chat/templates/DocumentTemplate";

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
): Promise<Buffer> {
  const html = renderDocumentHtml({
    ...payload,
    generatedAt: new Date(),
    logoDataUrl: await loadLogoDataUrl(),
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}
