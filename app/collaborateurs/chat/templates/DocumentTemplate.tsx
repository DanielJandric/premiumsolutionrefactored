import { CollaboratorDocumentPayload } from "@/lib/documents/types";

function formatCurrency(value: number | undefined) {
  const amount = Number.isFinite(value ?? NaN) ? Number(value) : 0;
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(amount);
}

function sanitizeText(value?: string) {
  return value?.trim() ?? "-";
}

function computeTotals(payload: CollaboratorDocumentPayload) {
  const items = payload.items ?? [];
  const itemsTotal = items.reduce((acc, item) => {
    const quantity = Number.isFinite(item.quantity ?? NaN)
      ? Number(item.quantity)
      : 0;
    const unitPrice = Number.isFinite(item.unit_price ?? NaN)
      ? Number(item.unit_price)
      : 0;
    const total = Number.isFinite(item.total ?? NaN)
      ? Number(item.total)
      : quantity * unitPrice;
    return acc + total;
  }, 0);

  const subtotal = Number.isFinite(payload.subtotal ?? NaN)
    ? Number(payload.subtotal)
    : itemsTotal;
  const vatRate = Number.isFinite(payload.vat_rate ?? NaN)
    ? Number(payload.vat_rate)
    : 0;
  const vatAmount = Number.isFinite(payload.vat_amount ?? NaN)
    ? Number(payload.vat_amount)
    : subtotal * vatRate;
  const total = Number.isFinite(payload.total_amount ?? NaN)
    ? Number(payload.total_amount)
    : subtotal + vatAmount;

  return { subtotal, vatRate, vatAmount, total };
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function renderDocumentHtml(
  payload: CollaboratorDocumentPayload & {
    generatedAt: Date;
    logoDataUrl?: string;
  },
) {
  const totals = computeTotals(payload);
  const items = payload.items ?? [];
  const client = payload.client ?? {};
  const serviceDate = formatDate(payload.service_date);
  const generated = payload.generatedAt.toLocaleString("fr-CH");
  const logoDataUrl = payload.logoDataUrl;

  const title = payload.type === "invoice" ? "Facture" : "Devis";

  const rows = items
    .map((item) => {
      const quantity = Number.isFinite(item.quantity ?? NaN)
        ? Number(item.quantity).toString()
        : "-";
      const unitPrice = Number.isFinite(item.unit_price ?? NaN)
        ? formatCurrency(item.unit_price)
        : "-";
      const total = Number.isFinite(item.total ?? NaN)
        ? formatCurrency(item.total)
        : "-";
      return `<tr>
        <td>${sanitizeText(item.description)}</td>
        <td class="numeric">${quantity}</td>
        <td class="numeric">${sanitizeText(item.unit)}</td>
        <td class="numeric">${unitPrice}</td>
        <td class="numeric">${total}</td>
      </tr>`;
    })
    .join("");

  const tableBody =
    rows ||
    `<tr><td colspan="5" class="empty">Aucune ligne de prestation renseign&eacute;e.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charSet="utf-8" />
    <title>${title} ${sanitizeText(payload.reference)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Inter', Arial, sans-serif;
        color: #111827;
        background: #ffffff;
        padding: 40px;
      }
      h1 { font-size: 26px; margin-bottom: 4px; }
      h2 { font-size: 18px; margin: 24px 0 8px; }
      p { margin: 4px 0; font-size: 13px; }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
      }
      .badge { text-transform: uppercase; font-size: 12px; letter-spacing: 2px; color: #6b7280; }
      .meta { margin-top: 12px; font-size: 13px; color: #4b5563; text-align: right; }
      .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
      .logo { max-width: 140px; height: auto; }
      .section { margin-top: 28px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      thead { background: #f3f4f6; }
      th, td {
        padding: 10px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 13px;
        text-align: left;
      }
      th.numeric, td.numeric { text-align: right; white-space: nowrap; }
      td.empty { text-align: center; color: #6b7280; font-style: italic; }
      .totals { margin-top: 16px; width: 40%; margin-left: auto; }
      .totals tr td { border: none; font-size: 13px; padding: 6px 0; }
      .totals tr.total td { font-weight: 600; font-size: 14px; }
      .notes { margin-top: 24px; font-size: 12px; color: #4b5563; }
      .footer {
        margin-top: 36px;
        font-size: 10px;
        color: #6b7280;
        text-align: center;
        line-height: 1.4;
      }
      .footer .note { margin-top: 8px; font-size: 10px; color: #9ca3af; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="badge">Premium Solution</div>
        <h1>${title}</h1>
        <p>R&eacute;f&eacute;rence : <strong>${sanitizeText(payload.reference)}</strong></p>
        ${serviceDate ? `<p>Date de service : ${serviceDate}</p>` : ""}
      </div>
      <div class="header-right">
        ${
          logoDataUrl
            ? `<img class="logo" src="${logoDataUrl}" alt="Logo Premium Solution" />`
            : ""
        }
        <div class="meta">
          <p>G&eacute;n&eacute;r&eacute; le ${generated}</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Client</h2>
      <p><strong>${sanitizeText(client.name)}</strong></p>
      ${client.company ? `<p>${sanitizeText(client.company)}</p>` : ""}
      ${client.address ? `<p>${sanitizeText(client.address)}</p>` : ""}
      ${client.email ? `<p>${sanitizeText(client.email)}</p>` : ""}
      ${client.phone ? `<p>${sanitizeText(client.phone)}</p>` : ""}
    </div>

    <div class="section">
      <h2>D&eacute;tails des prestations</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="numeric">Qt&eacute;</th>
            <th class="numeric">Unit&eacute;</th>
            <th class="numeric">Prix unitaire</th>
            <th class="numeric">Total</th>
          </tr>
        </thead>
        <tbody>
          ${tableBody}
        </tbody>
      </table>
    </div>

    <table class="totals">
      <tbody>
        <tr>
          <td>Sous-total</td>
          <td class="numeric">${formatCurrency(totals.subtotal)}</td>
        </tr>
        <tr>
          <td>TVA (${(totals.vatRate * 100).toFixed(2).replace(/\\.00$/, "") || "0"} %)</td>
          <td class="numeric">${formatCurrency(totals.vatAmount)}</td>
        </tr>
        <tr class="total">
          <td>Total</td>
          <td class="numeric">${formatCurrency(totals.total)}</td>
        </tr>
      </tbody>
    </table>

    ${
      payload.payment_terms
        ? `<div class="section"><h2>Conditions de paiement</h2><p>${sanitizeText(payload.payment_terms)}</p></div>`
        : ""
    }
    ${
      payload.notes
        ? `<div class="section"><h2>Notes</h2><p>${sanitizeText(payload.notes)}</p></div>`
        : ""
    }

    <div class="footer">
      <p>Premium Solution CM Sarl Route de Crans 81 - 1978 Lens E-mail : info@premium-solution.ch T&eacute;l&eacute;phone : +41766393653 Site Internet : www.premium-solution.ch N&deg; IDE : CHE-338.407.073 N&deg; IDE : CHE-338.407.073 Banque : Banque UBS Titulaire du compte : Premium Solution CM Sarl BIC : UBSWCHZH39L IBAN : CH100026826812976201J</p>
      <p class="note">Document g&eacute;n&eacute;r&eacute; automatiquement via le portail collaborateurs Premium Solution.</p>
    </div>
  </body>
</html>`;
}
