import { createTRPCRouter } from '../init';
import { subscriptionRouter } from '@/server/subscription';
import { categoryRouter } from '@/server/category.server';
import { productRouter } from '@/server/product.server';
import { variantRouter } from '@/server/variant.server';
import { inventoryRouter } from '@/server/inventory.server';
import { customerRouter } from '@/server/customer.server';
import { orderRouter } from '@/server/order.server';
import { transactionRouter } from '@/server/transaction.server';
import { expenseRouter } from '@/server/expense.server';
import { dashboardRouter } from '@/server/dashboard.server';
import { analyticsRouter } from '@/server/analytics.server';

export const appRouter = createTRPCRouter({
  subscriptions: subscriptionRouter,
  categories: categoryRouter,
  products: productRouter,
  variants: variantRouter,
  inventory: inventoryRouter,
  customers: customerRouter,
  orders: orderRouter,
  transactions: transactionRouter,
  expenses: expenseRouter,
  dashboard: dashboardRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
