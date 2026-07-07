import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import SubscriptionDetail from "../_components/SubscriptionDetail";

export const dynamic = "force-dynamic";

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caller = appRouter.createCaller(await createTRPCContext({ headers: await headers() }));
  const data = await caller.subscriptions.getById({ id });

  if (!data) {
    notFound();
  }

  return <SubscriptionDetail business={data.business} owners={data.owners} />;
}
