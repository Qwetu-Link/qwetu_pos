import type { AdminReportCenterData } from "@/db/queries/admin-reports";

type ExportSection = {
  title: string;
  columns: string[];
  rows: unknown[][];
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function normalizeCell(value: unknown) {
  if (value instanceof Date) return formatDate(value);
  if (value === null || value === undefined) return "";
  return String(value);
}

function escapeCsvCell(value: unknown) {
  const cell = normalizeCell(value);
  return /[",\n\r]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

function escapeXml(value: unknown) {
  return normalizeCell(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapePdfText(value: unknown) {
  return normalizeCell(value)
    .replace(/[^\x20-\x7e]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function truncate(value: unknown, length: number) {
  const text = normalizeCell(value).replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length - 3)}...` : text;
}

function getSections(data: AdminReportCenterData): ExportSection[] {
  return [
    {
      title: "Metrics",
      columns: ["Metric", "Value", "Detail"],
      rows: data.metrics.map((metric) => [metric.label, metric.value, metric.detail]),
    },
    {
      title: "Revenue Trend",
      columns: ["Month", "Revenue", "Expenses"],
      rows: data.revenueTrend.map((point) => [point.month, point.revenue, point.expenses]),
    },
    {
      title: "Top Products",
      columns: ["Product", "SKU", "Quantity", "Revenue"],
      rows: data.topProducts.map((product) => [product.name, product.sku, product.quantity, product.revenue]),
    },
    {
      title: "Inventory Alerts",
      columns: ["Product", "SKU", "Color", "Size", "Stock", "Reorder Point", "Status"],
      rows: data.inventory.map((item) => [
        item.product,
        item.sku,
        item.color,
        item.size,
        item.stock,
        item.reorderPoint,
        item.status,
      ]),
    },
    {
      title: "Customer Segments",
      columns: ["Segment", "Customers", "Total Spent"],
      rows: data.customerSegments.map((segment) => [segment.segment, segment.customers, segment.totalSpent]),
    },
    {
      title: "Recent Transactions",
      columns: ["Transaction ID", "Type", "Method", "Status", "Amount", "Transacted At"],
      rows: data.transactions.map((transaction) => [
        transaction.tnxId,
        transaction.type,
        transaction.method,
        transaction.status,
        transaction.amount,
        transaction.transactedAt,
      ]),
    },
  ];
}

export function buildAdminReportCsv(data: AdminReportCenterData) {
  const rows: unknown[][] = [
    [`${data.business.name} Admin Report`],
    ["Generated At", formatDate(data.generatedAt)],
    ["Period", data.periodLabel],
    ["Business Email", data.business.email],
    [],
  ];

  getSections(data).forEach((section) => {
    rows.push([section.title], section.columns, ...section.rows, []);
  });

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}

export function buildAdminReportXls(data: AdminReportCenterData) {
  const rows: unknown[][] = [
    [`${data.business.name} Admin Report`],
    ["Generated At", formatDate(data.generatedAt)],
    ["Period", data.periodLabel],
    ["Business Email", data.business.email],
    [],
  ];

  getSections(data).forEach((section) => {
    rows.push([section.title], section.columns, ...section.rows, []);
  });

  const body = rows
    .map((row) => (
      `<Row>${row.map((cell) => `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`).join("")}</Row>`
    ))
    .join("");

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Admin Report">
  <Table>${body}</Table>
 </Worksheet>
</Workbook>`;
}

function drawText(text: string, x: number, y: number, size = 9) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET\n`;
}

function buildPdfPageContent(data: AdminReportCenterData, pageNumber: number, pageCount: number) {
  let y = 800;
  let content = "";
  content += drawText(`${data.business.name} Admin Report`, 42, y, 16);
  y -= 20;
  content += drawText(`Generated: ${formatDate(data.generatedAt)} | Period: ${data.periodLabel}`, 42, y, 9);
  y -= 22;

  data.metrics.forEach((metric) => {
    content += drawText(`${metric.label}: ${metric.value} (${metric.detail})`, 42, y, 9);
    y -= 14;
  });

  y -= 8;
  content += drawText("Top Products", 42, y, 11);
  y -= 16;
  content += drawText("Product", 42, y, 8);
  content += drawText("SKU", 220, y, 8);
  content += drawText("Qty", 336, y, 8);
  content += drawText("Revenue", 390, y, 8);
  y -= 12;
  data.topProducts.slice(0, 10).forEach((product) => {
    content += drawText(truncate(product.name, 28), 42, y, 8);
    content += drawText(truncate(product.sku, 16), 220, y, 8);
    content += drawText(String(product.quantity), 340, y, 8);
    content += drawText(String(product.revenue), 390, y, 8);
    y -= 14;
  });

  y -= 8;
  content += drawText("Inventory Alerts", 42, y, 11);
  y -= 16;
  content += drawText("Product", 42, y, 8);
  content += drawText("SKU", 220, y, 8);
  content += drawText("Stock", 336, y, 8);
  content += drawText("Status", 390, y, 8);
  y -= 12;
  data.inventory.slice(0, 12).forEach((item) => {
    content += drawText(truncate(item.product, 28), 42, y, 8);
    content += drawText(truncate(item.sku, 16), 220, y, 8);
    content += drawText(String(item.stock), 340, y, 8);
    content += drawText(item.status, 390, y, 8);
    y -= 14;
  });

  y -= 8;
  content += drawText("Recent Transactions", 42, y, 11);
  y -= 16;
  content += drawText("ID", 42, y, 8);
  content += drawText("Type", 160, y, 8);
  content += drawText("Method", 236, y, 8);
  content += drawText("Status", 324, y, 8);
  content += drawText("Amount", 390, y, 8);
  y -= 12;
  data.transactions.slice(0, 12).forEach((transaction) => {
    content += drawText(truncate(transaction.tnxId, 18), 42, y, 8);
    content += drawText(transaction.type, 160, y, 8);
    content += drawText(transaction.method, 236, y, 8);
    content += drawText(transaction.status, 324, y, 8);
    content += drawText(String(transaction.amount), 390, y, 8);
    y -= 14;
  });

  content += drawText(`Page ${pageNumber} of ${pageCount}`, 500, 32, 8);
  return content;
}

function toPdfObject(id: number, body: string) {
  return `${id} 0 obj\n${body}\nendobj\n`;
}

export function buildAdminReportPdf(data: AdminReportCenterData) {
  const content = buildPdfPageContent(data, 1, 1);
  const objects = [
    toPdfObject(1, "<< /Type /Catalog /Pages 2 0 R >>"),
    toPdfObject(2, "<< /Type /Pages /Kids [4 0 R] /Count 1 >>"),
    toPdfObject(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
    toPdfObject(4, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents 5 0 R >>"),
    toPdfObject(5, `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}endstream`),
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += object;
  });

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}
