import { auth } from "@/auth";
import { getSuperAdminReportCenterData } from "@/db/queries/superadmin-reports";
import {
  buildSuperAdminReportCsv,
  buildSuperAdminReportPdf,
  buildSuperAdminReportXls,
} from "@/features/superadmin/reports/report-export";

export const dynamic = "force-dynamic";

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

function getFileDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ format: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (session.user.roleName !== "Super Admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const { format } = await context.params;
  const normalizedFormat = format.toLowerCase();

  if (!(normalizedFormat in exportConfig)) {
    return new Response("Unsupported report format", { status: 400 });
  }

  const data = await getSuperAdminReportCenterData();
  const config = exportConfig[normalizedFormat as keyof typeof exportConfig];
  const filename = `qwetu-superadmin-report-${getFileDate()}.${config.extension}`;
  const body =
    normalizedFormat === "pdf"
      ? buildSuperAdminReportPdf(data)
      : normalizedFormat === "xls"
        ? buildSuperAdminReportXls(data)
        : `\uFEFF${buildSuperAdminReportCsv(data)}`;

  return new Response(body, {
    headers: {
      "Content-Type": config.contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
