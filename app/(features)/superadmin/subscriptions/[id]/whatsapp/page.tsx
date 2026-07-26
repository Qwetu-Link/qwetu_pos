import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import WhatsAppCloudApiConfigPage from "@/features/superadmin/subscriptions/components/WhatsAppCloudApiConfigPage";

export const dynamic = "force-dynamic";

export default async function TenantWhatsAppConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caller = appRouter.createCaller(await createTRPCContext({ headers: await headers() }));
  const data = await caller.subscriptions.getById({ id });

  if (!data) {
    notFound();
  }

  return <WhatsAppCloudApiConfigPage business={data.business} />;
}
