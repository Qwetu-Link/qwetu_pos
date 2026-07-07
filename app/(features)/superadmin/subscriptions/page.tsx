import { headers } from "next/headers";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import SubscriptionsList from "./_components/SubscriptionsList";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const caller = appRouter.createCaller(await createTRPCContext({ headers: await headers() }));
  const records = await caller.subscriptions.getAll();
  return <SubscriptionsList records={records} />;
}
