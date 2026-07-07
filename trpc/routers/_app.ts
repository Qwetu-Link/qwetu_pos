import { subscriptionRouter } from '@/server/subscription';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  subscriptions: subscriptionRouter,
});

export type AppRouter = typeof appRouter;