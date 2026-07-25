import { createTRPCRouter } from '../init';
import { subscriptionRouter } from '@/server/subscription';
import { categoryRouter } from '@/server/category.server';
import { productRouter } from '@/server/product.server';
import { variantRouter } from '@/server/variant.server';
import { inventoryRouter } from '@/server/inventory.server';
import { customerRouter } from '@/server/customer.server';
import { orderRouter } from '@/server/order.server';

export const appRouter = createTRPCRouter({
  subscriptions: subscriptionRouter,
  categories: categoryRouter,
  products: productRouter,
  variants: variantRouter,
  inventory: inventoryRouter,
  customers: customerRouter,
  orders: orderRouter,
});

export type AppRouter = typeof appRouter;
