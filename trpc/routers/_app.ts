import { createTRPCRouter } from '../init';
import { subscriptionRouter } from '@/server/subscription';
import { categoryRouter } from '@/server/category.server';

export const appRouter = createTRPCRouter({
  subscriptions: subscriptionRouter,
  categories: categoryRouter,
});

export type AppRouter = typeof appRouter;