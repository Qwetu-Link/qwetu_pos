import type {
  SuperAdminReportCenterData,
  SuperAdminTenantReportRow,
} from "@/db/queries/superadmin-reports";

const reportColumns: { key: keyof SuperAdminTenantReportRow; label: string }[] = [
  { key: "businessName", label: "Business Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "owners", label: "Owners" },
  { key: "revenue", label: "Revenue" },
  { key: "invoiced", label: "Invoiced" },
  { key: "outstanding", label: "Outstanding" },
  { key: "orders", label: "Orders" },
  { key: "transactions", label: "Transactions" },
  { key: "createdAt", label: "Created At" },
];

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

export function buildSuperAdminReportCsv(data: SuperAdminReportCenterData) {
  const rows = [
    ["Qwetu POS Superadmin Report"],
    ["Generated At", formatDate(data.generatedAt)],
    ["Period", data.periodLabel],
    [],
    data.metrics.map((metric) => metric.title),
    data.metrics.map((metric) => metric.value),
    [],
    reportColumns.map((column) => column.label),
    ...data.tenants.map((tenant) => reportColumns.map((column) => tenant[column.key])),
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}

export function buildSuperAdminReportXls(data: SuperAdminReportCenterData) {
  const rows = [
    ["Qwetu POS Superadmin Report"],
    ["Generated At", formatDate(data.generatedAt)],
    ["Period", data.periodLabel],
    [],
    data.metrics.map((metric) => metric.title),
    data.metrics.map((metric) => metric.value),
    [],
    reportColumns.map((column) => column.label),
    ...data.tenants.map((tenant) => reportColumns.map((column) => tenant[column.key])),
  ];

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
 <Worksheet ss:Name="Superadmin Report">
  <Table>${body}</Table>
 </Worksheet>
</Workbook>`;
}

function drawText(text: string, x: number, y: number, size = 9) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET\n`;
}

function buildPdfPageContent(
  data: SuperAdminReportCenterData,
  rows: SuperAdminTenantReportRow[],
  pageNumber: number,
  pageCount: number,
) {
  let y = 800;
  let content = "";
  content += drawText("Qwetu POS Superadmin Report", 42, y, 16);
  y -= 20;
  content += drawText(`Generated: ${formatDate(data.generatedAt)} | Period: ${data.periodLabel}`, 42, y, 9);
  y -= 18;
  content += drawText(
    data.metrics.map((metric) => `${metric.title}: ${metric.value}`).join(" | "),
    42,
    y,
    8,
  );
  y -= 26;
  content += drawText("Tenant", 42, y, 8);
  content += drawText("Status", 188, y, 8);
  content += drawText("Owners", 240, y, 8);
  content += drawText("Revenue", 286, y, 8);
  content += drawText("Outstanding", 360, y, 8);
  content += drawText("Orders", 448, y, 8);
  content += drawText("Txns", 500, y, 8);
  y -= 12;
  content += "0.85 w 42 765 m 550 765 l S\n";

  rows.forEach((tenant) => {
    content += drawText(truncate(tenant.businessName, 24), 42, y, 8);
    content += drawText(tenant.status, 188, y, 8);
    content += drawText(String(tenant.owners), 246, y, 8);
    content += drawText(String(tenant.revenue), 286, y, 8);
    content += drawText(String(tenant.outstanding), 360, y, 8);
    content += drawText(String(tenant.orders), 452, y, 8);
    content += drawText(String(tenant.transactions), 504, y, 8);
    y -= 15;
  });

  content += drawText(`Page ${pageNumber} of ${pageCount}`, 500, 32, 8);
  return content;
}

function toPdfObject(id: number, body: string) {
  return `${id} 0 obj\n${body}\nendobj\n`;
}

export function buildSuperAdminReportPdf(data: SuperAdminReportCenterData) {
  const rowsPerPage = 34;
  const pages = data.tenants.length
    ? Array.from({ length: Math.ceil(data.tenants.length / rowsPerPage) }, (_, index) =>
      data.tenants.slice(index * rowsPerPage, (index + 1) * rowsPerPage),
    )
    : [[] as SuperAdminTenantReportRow[]];
  const pageCount = pages.length;
  const objects: string[] = [];
  const pageObjectIds = pages.map((_, index) => 4 + index * 2);
  const contentObjectIds = pages.map((_, index) => 5 + index * 2);

  objects.push(toPdfObject(1, "<< /Type /Catalog /Pages 2 0 R >>"));
  objects.push(toPdfObject(
    2,
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`,
  ));
  objects.push(toPdfObject(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"));

  pages.forEach((pageRows, index) => {
    const pageId = pageObjectIds[index];
    const contentId = contentObjectIds[index];
    const content = buildPdfPageContent(data, pageRows, index + 1, pageCount);
    objects.push(toPdfObject(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`,
    ));
    objects.push(toPdfObject(
      contentId,
      `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}endstream`,
    ));
  });

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
