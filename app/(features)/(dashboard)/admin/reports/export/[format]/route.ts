import { auth } from "@/auth";
import { getAdminReportCenterData } from "@/db/queries/admin-reports";
import {
  buildAdminReportCsv,
  buildAdminReportPdf,
  buildAdminReportXls,
} from "@/features/reports/report-export";

const exportConfig = {
  csv: {
    contentType: "text/csv; charset=utf-8",
    extension: "csv",
  },
  xls: {
    contentType: "application/vnd.ms-excel; charset=utf-8",
    extension: "xls",
  },
  pdf: {
    contentType: "application/pdf",
    extension: "pdf",
  },
};

function fileNamePart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "business";
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ format: string }> },
) {
  const session = await auth();

  if (!session?.user?.businessId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (session.user.roleName === "SUPERADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const { format } = await context.params;
  const normalizedFormat = format.toLowerCase();

  if (!(normalizedFormat in exportConfig)) {
    return new Response("Unsupported report format", { status: 400 });
  }

  const data = await getAdminReportCenterData(session.user.businessId);
  const config = exportConfig[normalizedFormat as keyof typeof exportConfig];
  const filename = `${fileNamePart(data.business.name)}-admin-report-${new Date().toISOString().slice(0, 10)}.${config.extension}`;
  const body =
    normalizedFormat === "pdf"
      ? buildAdminReportPdf(data)
      : normalizedFormat === "xls"
        ? buildAdminReportXls(data)
        : `\uFEFF${buildAdminReportCsv(data)}`;

  return new Response(body, {
    headers: {
      "Content-Type": config.contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
