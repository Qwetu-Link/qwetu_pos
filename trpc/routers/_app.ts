import { createTRPCRouter } from '../init';
import { subscriptionRouter } from '@/server/subscription';
import { categoryRouter } from '@/server/category.server';
import { productRouter } from '@/server/product.server';
import { variantRouter } from '@/server/variant.server';
import { inventoryRouter } from '@/server/inventory.server';

export const appRouter = createTRPCRouter({
  subscriptions: subscriptionRouter,
  categories: categoryRouter,
  products: productRouter,
  variants: variantRouter,
  inventory: inventoryRouter,
});

export type AppRouter = typeof appRouter;
