import { db } from "@/db";
import { customerTable } from "@/db/schema/customers";
import { invoiceTable } from "@/db/schema/invoice";
import { orderItemTable, orderTable } from "@/db/schema/orders";
import { paymentTable, transactionTable } from "@/db/schema/payments";
import { productsTable } from "@/db/schema/products";
import { locationTable, variantInventoryTable, variantsTable } from "@/db/schema/variants";
import type {
    LineItem,
    Order,
    OrderInvoice,
    OrderLocationName,
    OrderStatus,
    PaymentStatus,
    PaymentType,
} from "@/types/customer";
import { and, desc, eq, inArray, lte } from "drizzle-orm";
import crypto from "crypto";

type OrderLineItemInput = LineItem;
type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | DbTransaction;

type OrderWriteInput = {
    businessId: string;
    customerId: string;
    paymentType: PaymentType;
    amountPaid: number;
    installmentPlan?: string;
    installmentStartDate?: string;
    status: OrderStatus;
    shippingAddress: string;
    lineItems: OrderLineItemInput[];
};

type RecordOrderPaymentInput = {
    businessId: string;
    invoiceId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: "M-Pesa" | "Airtel Money" | "Bank Transfer" | "Cash" | "Card";
    reference?: string;
    note?: string;
};

type PaymentReceiptRow = {
    payment: typeof paymentTable.$inferSelect;
    transaction: typeof transactionTable.$inferSelect | null;
};

const INVOICE_PREFIX = "INV";
const UNPAID_ORDER_AUTO_CANCEL_HOURS = 48;
const AUTO_CANCEL_OPEN_STATUSES: OrderStatus[] = ["pending", "processing"];
const orderLocationNames: OrderLocationName[] = ["Main Store", "Warehouse A", "Outlet"];
function toIsoDate(value?: Date | string | null) {
    if (!value) return "";
    return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toOrderLocationName(value?: string | null) {
    return orderLocationNames.includes(value as OrderLocationName)
        ? value as OrderLocationName
        : undefined;
}

function getInstallmentCount(paymentType: PaymentType, plan?: string) {
    if (paymentType === "full") return 1;
    const count = Number(plan?.match(/\d+/)?.[0] ?? 1);
    if (!Number.isFinite(count) || count < 1) return 1;
    return Math.min(12, Math.floor(count));
}

function addMonths(date: Date, months: number) {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + months);
    return nextDate;
}

function getPaymentStatus(total: number, amountPaid: number): PaymentStatus {
    if (amountPaid >= total) return "paid";
    if (amountPaid > 0) return "partial";
    return "unpaid";
}

function getInventoryStatus(stock: number, reorderPoint: number) {
    if (stock === 0) return "reorder" as const;
    if (stock <= 3) return "critical" as const;
    if (stock <= reorderPoint * 0.6) return "low" as const;
    return "healthy" as const;
}

function getInvoiceStatus(total: number, amountPaid: number) {
    if (amountPaid >= total) return "paid" as const;
    if (amountPaid > 0) return "partially_paid" as const;
    return "issued" as const;
}

function getInvoiceNumber() {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${INVOICE_PREFIX}-${Date.now()}-${suffix}`;
}

function getOrderNumber(orderId: string, createdAt: Date) {
    const orderSegment = orderId.split("-")[1]?.toUpperCase() ?? orderId.slice(0, 4).toUpperCase();
    const minute = String(createdAt.getMinutes()).padStart(2, "0");
    return `ORD-${orderSegment}-${minute}`;
}

function getOrderTotal(lineItems: OrderLineItemInput[]) {
    return lineItems.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function getInvoiceValues(data: {
    businessId: string;
    orderId: string;
    total: number;
    amountPaid: number;
    paymentType: PaymentType;
    installmentPlan?: string | null;
    installmentStartDate?: Date | null;
}) {
    const balance = Math.max(0, data.total - data.amountPaid);
    const installments = getInstallmentCount(data.paymentType, data.installmentPlan ?? undefined);
    const startDate = data.installmentStartDate ?? new Date();
    const dueDate =
        data.paymentType === "installment"
            ? addMonths(startDate, installments)
            : startDate;

    return {
        businessId: data.businessId,
        orderId: data.orderId,
        invoiceNumber: getInvoiceNumber(),
        subtotal: data.total,
        discount: 0,
        tax: 0,
        total: data.total,
        balance,
        installments,
        installmentAmount:
            data.paymentType === "installment"
                ? Math.ceil(data.total / installments)
                : balance,
        status: getInvoiceStatus(data.total, data.amountPaid),
        frequency: data.paymentType === "installment" ? "monthly" : null,
        startDate,
        endDate: data.paymentType === "installment" ? dueDate : null,
        dueDate,
    };
}

function mapInvoiceWithReceipts(
    row: typeof invoiceTable.$inferSelect | undefined,
    payments: PaymentReceiptRow[],
): OrderInvoice | undefined {
    if (!row) return undefined;

    return {
        id: row.id,
        invoiceNumber: row.invoiceNumber,
        total: row.total,
        balance: row.balance,
        installments: row.installments,
        installmentAmount: row.installmentAmount,
        status: row.status,
        frequency: row.frequency ?? "",
        startDate: toIsoDate(row.startDate),
        dueDate: toIsoDate(row.dueDate),
        receipts: payments
            .sort((a, b) => a.payment.paidAt.getTime() - b.payment.paidAt.getTime())
            .map(({ payment, transaction }) => ({
                id: payment.id,
                amount: payment.amount,
                date: toIsoDate(payment.paidAt),
                method: transaction ? getReadablePaymentMethod(transaction.paymentMethod) : "Payment",
                ref: transaction?.reference ?? transaction?.tnxId ?? "",
                note: payment.notes ?? transaction?.notes ?? "",
            })),
    };
}

function getReadablePaymentMethod(method: (typeof transactionTable.$inferSelect)["paymentMethod"]) {
    if (method === "mpesa") return "M-Pesa";
    if (method === "airtel_money") return "Airtel Money";
    if (method === "bank") return "Bank Transfer";
    if (method === "card") return "Card";
    return "Cash";
}

function getDbPaymentMethod(method: RecordOrderPaymentInput["paymentMethod"]) {
    if (method === "Cash") return "cash" as const;
    if (method === "Bank Transfer") return "bank" as const;
    if (method === "Card") return "card" as const;
    if (method === "Airtel Money") return "airtel_money" as const;
    return "mpesa" as const;
}

function getRecordPaymentTransactionType(order: typeof orderTable.$inferSelect) {
    if (order.depositPaid === 0) return "deposit" as const;
    if (order.paymentType === "installment") return "installment" as const;
    return "payment" as const;
}

function getPaymentMethodLetter(method: RecordOrderPaymentInput["paymentMethod"]) {
    return method.trim().charAt(0).toUpperCase();
}

function getDigitCode(length: number) {
    const max = 10 ** length;
    return String(crypto.randomInt(0, max)).padStart(length, "0");
}

async function getUniqueTransactionId(
    client: DbClient,
    businessId: string,
    method: RecordOrderPaymentInput["paymentMethod"],
) {
    const methodLetter = getPaymentMethodLetter(method);

    for (let attempt = 0; attempt < 10; attempt += 1) {
        const tnxId = `TXN-${getDigitCode(4)}-${methodLetter}`;
        const [existing] = await client
            .select({ id: transactionTable.id })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.tnxId, tnxId),
            ));

        if (!existing) return tnxId;
    }

    return `TXN-${getDigitCode(4)}-${methodLetter}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

async function getUniqueCashReference(client: DbClient, businessId: string) {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const reference = `CSH-${getDigitCode(5)}`;
        const [existing] = await client
            .select({ id: transactionTable.id })
            .from(transactionTable)
            .where(and(
                eq(transactionTable.businessId, businessId),
                eq(transactionTable.reference, reference),
            ));

        if (!existing) return reference;
    }

    return `CSH-${getDigitCode(5)}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

function mapOrderRecord(data: {
    order: typeof orderTable.$inferSelect;
    customer: typeof customerTable.$inferSelect;
    items: (typeof orderItemTable.$inferSelect)[];
    locations: (typeof locationTable.$inferSelect)[];
    invoice?: typeof invoiceTable.$inferSelect;
    payments?: PaymentReceiptRow[];
}): Order {
    const quantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
    const invoice = mapInvoiceWithReceipts(data.invoice, data.payments ?? []);
    const remainingAmount = invoice?.balance ?? Math.max(0, data.order.total - data.order.depositPaid);

    return {
        id: data.order.id,
        orderNumber: data.order.orderNo ?? getOrderNumber(data.order.id, data.order.createdAt),
        customerId: data.order.customerId,
        customer: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone ?? "",
        items: quantity,
        total: data.order.total,
        amountPaid: data.order.depositPaid,
        remainingAmount,
        paymentStatus: data.order.paymentStatus,
        paymentType: data.order.paymentType,
        installmentPlan: data.order.installmentPlan ?? undefined,
        installmentStartDate: toIsoDate(data.order.installmentStartDate) || undefined,
        status: data.order.status,
        createdAt: toIsoDate(data.order.createdAt),
        shippingAddress: data.order.shippingAddress,
        lineItems: data.items.map((item) => ({
            variantId: item.variantId,
            productId: item.productId,
            sku: item.sku,
            name: item.name,
            qty: item.quantity,
            price: item.price,
            originalPrice: item.originalPrice ?? item.price,
            locationName: toOrderLocationName(
                data.locations.find((location) => location.id === item.locationId)?.name,
            ),
        })),
        invoice,
    };
}

async function ensureCustomerBelongsToBusiness(customerId: string, businessId: string) {
    const [customer] = await db
        .select()
        .from(customerTable)
        .where(and(
            eq(customerTable.id, customerId),
            eq(customerTable.businessId, businessId),
        ));

    if (!customer) {
        throw new Error("The selected customer does not belong to this business.");
    }

    return customer;
}

async function ensureLineItemsBelongToBusiness(
    lineItems: OrderLineItemInput[],
    businessId: string,
) {
    const variantIds = [...new Set(lineItems.map((item) => item.variantId))];
    const rows = await db
        .select({
            id: variantsTable.id,
            productId: variantsTable.productId,
            sku: variantsTable.sku,
            productName: productsTable.name,
        })
        .from(variantsTable)
        .innerJoin(productsTable, eq(productsTable.id, variantsTable.productId))
        .where(and(
            inArray(variantsTable.id, variantIds),
            eq(variantsTable.businessId, businessId),
            eq(productsTable.businessId, businessId),
        ));

    if (rows.length !== variantIds.length) {
        throw new Error("One or more selected variants do not belong to this business.");
    }

    for (const item of lineItems) {
        const row = rows.find((variant) => variant.id === item.variantId);
        if (!row || row.productId !== item.productId || row.sku !== item.sku) {
            throw new Error("One or more order items no longer match the product catalog.");
        }
    }
}

async function getOrderItemInventoryRows(
    client: DbClient,
    lineItems: OrderLineItemInput[],
    businessId: string,
) {
    const rows = await client
        .select({
            variantId: variantInventoryTable.variantId,
            locationId: variantInventoryTable.locationId,
            locationName: locationTable.name,
            totalStock: variantInventoryTable.totalStock,
            reorderPoint: variantInventoryTable.reorderPoint,
            inventoryId: variantInventoryTable.id,
        })
        .from(variantInventoryTable)
        .innerJoin(locationTable, eq(locationTable.id, variantInventoryTable.locationId))
        .where(and(
            eq(variantInventoryTable.businessId, businessId),
            eq(locationTable.businessId, businessId),
            inArray(variantInventoryTable.variantId, lineItems.map((item) => item.variantId)),
        ));

    const inventoryRows = lineItems.map((item) => {
        const row = rows.find(
            (inventory) =>
                inventory.variantId === item.variantId &&
                inventory.locationName === item.locationName,
        );

        if (!row) {
            throw new Error(`${item.name} is not stocked at ${item.locationName}.`);
        }

        if (row.totalStock < item.qty) {
            throw new Error(`${item.name} has only ${row.totalStock} available at ${item.locationName}.`);
        }

        return {
            item,
            row,
        };
    });

    return inventoryRows;
}

async function deductInventoryRows(
    client: DbClient,
    inventoryRows: Awaited<ReturnType<typeof getOrderItemInventoryRows>>,
) {
    for (const { item, row } of inventoryRows) {
        const nextStock = row.totalStock - item.qty;

        await client
            .update(variantInventoryTable)
            .set({
                totalStock: nextStock,
                status: getInventoryStatus(nextStock, row.reorderPoint),
            })
            .where(eq(variantInventoryTable.id, row.inventoryId));
    }
}

async function restoreOrderInventoryRows(
    client: DbClient,
    data: {
        businessId: string;
        items: (typeof orderItemTable.$inferSelect)[];
    },
) {
    const itemsWithLocations = data.items.filter((item) => item.locationId);
    if (itemsWithLocations.length === 0) return;

    const rows = await client
        .select({
            id: variantInventoryTable.id,
            variantId: variantInventoryTable.variantId,
            locationId: variantInventoryTable.locationId,
            totalStock: variantInventoryTable.totalStock,
            reorderPoint: variantInventoryTable.reorderPoint,
        })
        .from(variantInventoryTable)
        .where(and(
            eq(variantInventoryTable.businessId, data.businessId),
            inArray(
                variantInventoryTable.locationId,
                itemsWithLocations.map((item) => item.locationId!),
            ),
        ));

    for (const item of itemsWithLocations) {
        const row = rows.find(
            (inventory) =>
                inventory.locationId === item.locationId &&
                inventory.variantId === item.variantId,
        );
        if (!row) continue;

        const nextStock = row.totalStock + item.quantity;

        await client
            .update(variantInventoryTable)
            .set({
                totalStock: nextStock,
                status: getInventoryStatus(nextStock, row.reorderPoint),
            })
            .where(eq(variantInventoryTable.id, row.id));
    }
}

async function recomputeCustomerOrderStats(customerId: string, businessId: string) {
    const rows = await db
        .select()
        .from(orderTable)
        .where(and(
            eq(orderTable.customerId, customerId),
            eq(orderTable.businessId, businessId),
        ));

    const totalOrders = rows.length;
    const totalSpent = rows.reduce((sum, order) => sum + order.depositPaid, 0);
    const activeInstallments = rows.filter(
        (order) => order.paymentType === "installment" && order.paymentStatus !== "paid",
    ).length;
    const lastPurchase = rows
        .map((order) => order.createdAt)
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

    await db
        .update(customerTable)
        .set({
            totalOrders,
            totalSpent,
            activeInstallments,
            lastPurchase,
        })
        .where(and(
            eq(customerTable.id, customerId),
            eq(customerTable.businessId, businessId),
        ));
}

function getAutoCancelCutoff() {
    return new Date(Date.now() - UNPAID_ORDER_AUTO_CANCEL_HOURS * 60 * 60 * 1000);
}

async function autoCancelUnpaidOpenOrders(businessId: string) {
    const expiredOrders = await db
        .select()
        .from(orderTable)
        .where(and(
            eq(orderTable.businessId, businessId),
            inArray(orderTable.status, AUTO_CANCEL_OPEN_STATUSES),
            eq(orderTable.paymentStatus, "unpaid"),
            eq(orderTable.depositPaid, 0),
            lte(orderTable.createdAt, getAutoCancelCutoff()),
        ));

    if (expiredOrders.length === 0) return;

    await db.transaction(async (tx) => {
        for (const order of expiredOrders) {
            const items = await tx
                .select()
                .from(orderItemTable)
                .where(and(
                    eq(orderItemTable.orderId, order.id),
                    eq(orderItemTable.businessId, businessId),
                ));

            await restoreOrderInventoryRows(tx, {
                businessId,
                items,
            });

            await tx
                .update(invoiceTable)
                .set({ status: "cancelled" })
                .where(and(
                    eq(invoiceTable.orderId, order.id),
                    eq(invoiceTable.businessId, businessId),
                ));

            await tx
                .update(orderTable)
                .set({ status: "cancelled" })
                .where(and(
                    eq(orderTable.id, order.id),
                    eq(orderTable.businessId, businessId),
                ));
        }
    });

    const customerIds = [...new Set(expiredOrders.map((order) => order.customerId))];
    await Promise.all(
        customerIds.map((customerId) => recomputeCustomerOrderStats(customerId, businessId)),
    );
}

async function ensureInvoicesForOrders(orders: (typeof orderTable.$inferSelect)[]) {
    if (orders.length === 0) return;

    const orderIds = orders.map((order) => order.id);
    const invoices = await db
        .select({ orderId: invoiceTable.orderId })
        .from(invoiceTable)
        .where(inArray(invoiceTable.orderId, orderIds));
    const invoicedOrderIds = new Set(invoices.map((invoice) => invoice.orderId));
    const missingOrders = orders.filter((order) => !invoicedOrderIds.has(order.id));

    if (missingOrders.length === 0) return;

    await db
        .insert(invoiceTable)
        .values(
            missingOrders.map((order) =>
                getInvoiceValues({
                    businessId: order.businessId,
                    orderId: order.id,
                    total: order.total,
                    amountPaid: order.depositPaid,
                    paymentType: order.paymentType,
                    installmentPlan: order.installmentPlan,
                    installmentStartDate: order.installmentStartDate,
                }),
            ),
        );
}

async function getMappedOrders(orders: (typeof orderTable.$inferSelect)[]) {
    if (orders.length === 0) return [];

    await ensureInvoicesForOrders(orders);

    const orderIds = orders.map((order) => order.id);
    const customerIds = [...new Set(orders.map((order) => order.customerId))];
    const [customers, items, invoices, locations] = await Promise.all([
        db.select().from(customerTable).where(inArray(customerTable.id, customerIds)),
        db.select().from(orderItemTable).where(inArray(orderItemTable.orderId, orderIds)),
        db.select().from(invoiceTable).where(inArray(invoiceTable.orderId, orderIds)),
        db.select().from(locationTable).where(eq(locationTable.businessId, orders[0].businessId)),
    ]);
    const invoiceIds = invoices.map((invoice) => invoice.id);
    const payments = invoiceIds.length
        ? await db
            .select({
                payment: paymentTable,
                transaction: transactionTable,
            })
            .from(paymentTable)
            .leftJoin(transactionTable, eq(transactionTable.paymentId, paymentTable.id))
            .where(inArray(paymentTable.invoiceId, invoiceIds))
        : [];

    return orders
        .map((order) => {
            const customer = customers.find((item) => item.id === order.customerId);
            if (!customer) return null;
            const invoice = invoices.find((invoice) => invoice.orderId === order.id);

            return mapOrderRecord({
                order,
                customer,
                items: items.filter((item) => item.orderId === order.id),
                locations,
                invoice,
                payments: payments.filter((payment) =>
                    payment.payment.invoiceId === invoice?.id
                ),
            });
        })
        .filter((order): order is Order => Boolean(order));
}

export async function getOrdersQuery(businessId: string) {
    await autoCancelUnpaidOpenOrders(businessId);

    const orders = await db
        .select()
        .from(orderTable)
        .where(eq(orderTable.businessId, businessId))
        .orderBy(desc(orderTable.createdAt));

    return getMappedOrders(orders);
}

export async function getOrderByIdQuery(data: {
    id: string;
    businessId: string;
}) {
    await autoCancelUnpaidOpenOrders(data.businessId);

    const [order] = await db
        .select()
        .from(orderTable)
        .where(and(
            eq(orderTable.id, data.id),
            eq(orderTable.businessId, data.businessId),
        ));

    const [mappedOrder] = await getMappedOrders(order ? [order] : []);
    return mappedOrder;
}

export async function createOrderQuery(data: OrderWriteInput) {
    await ensureCustomerBelongsToBusiness(data.customerId, data.businessId);
    await ensureLineItemsBelongToBusiness(data.lineItems, data.businessId);

    const total = getOrderTotal(data.lineItems);
    const amountPaid = Math.min(Math.max(data.amountPaid, 0), total);
    const paymentStatus = getPaymentStatus(total, amountPaid);
    const installmentStartDate =
        data.paymentType === "installment" && data.installmentStartDate
            ? new Date(data.installmentStartDate)
            : null;
    const orderId = crypto.randomUUID();
    const createdAt = new Date();

    const [createdOrder] = await db.transaction(async (tx) => {
        const inventoryRows = await getOrderItemInventoryRows(
            tx,
            data.lineItems,
            data.businessId,
        );
        const [order] = await tx
            .insert(orderTable)
            .values({
                id: orderId,
                businessId: data.businessId,
                customerId: data.customerId,
                orderNo: getOrderNumber(orderId, createdAt),
                total,
                depositPaid: amountPaid,
                paymentStatus,
                paymentType: data.paymentType,
                installmentPlan: data.paymentType === "installment" ? data.installmentPlan : null,
                installmentStartDate,
                status: data.status,
                startDate: createdAt,
                shippingAddress: data.shippingAddress,
                createdAt,
            })
            .returning();

        await tx
            .insert(orderItemTable)
            .values(
                data.lineItems.map((item) => ({
                    businessId: data.businessId,
                    orderId: order.id,
                    variantId: item.variantId,
                    productId: item.productId,
                    locationId: inventoryRows.find(({ item: inventoryItem }) =>
                        inventoryItem.variantId === item.variantId &&
                        inventoryItem.locationName === item.locationName
                    )?.row.locationId,
                    sku: item.sku,
                    name: item.name,
                    quantity: item.qty,
                    price: item.price,
                    originalPrice: item.originalPrice,
                })),
            );

        const [invoice] = await tx.insert(invoiceTable).values(
            getInvoiceValues({
                businessId: data.businessId,
                orderId: order.id,
                total,
                amountPaid,
                paymentType: data.paymentType,
                installmentPlan: data.installmentPlan,
                installmentStartDate,
            }),
        ).returning();

        if (amountPaid > 0) {
            const paidAt = createdAt;
            const transactionReference = await getUniqueCashReference(tx, data.businessId);
            const transactionId = await getUniqueTransactionId(tx, data.businessId, "Cash");
            const [payment] = await tx.insert(paymentTable).values({
                businessId: data.businessId,
                invoiceId: invoice.id,
                amount: amountPaid,
                paidAt,
                notes:
                    data.paymentType === "installment"
                        ? "Initial deposit paid when the order was created"
                        : "Full payment recorded when the order was created",
            }).returning();

            await tx.insert(transactionTable).values({
                businessId: data.businessId,
                paymentId: payment.id,
                tnxId: transactionId,
                amount: amountPaid,
                tnxType: data.paymentType === "installment" ? "deposit" : "sale",
                status: "success",
                paymentMethod: "cash",
                provider: "Cash",
                reference: transactionReference,
                transactedAt: paidAt,
                notes:
                    data.paymentType === "installment"
                        ? "Initial order deposit"
                        : "Initial full order payment",
            });
        }

        await deductInventoryRows(tx, inventoryRows);

        return [order];
    });

    await recomputeCustomerOrderStats(data.customerId, data.businessId);
    return getOrderByIdQuery({ id: createdOrder.id, businessId: data.businessId });
}

export async function updateOrderQuery(data: OrderWriteInput & { id: string }) {
    await ensureCustomerBelongsToBusiness(data.customerId, data.businessId);
    await ensureLineItemsBelongToBusiness(data.lineItems, data.businessId);

    const existingOrder = await getOrderByIdQuery({
        id: data.id,
        businessId: data.businessId,
    });
    if (!existingOrder) return undefined;

    const total = getOrderTotal(data.lineItems);
    const amountPaid = Math.min(Math.max(data.amountPaid, 0), total);
    const paymentStatus = getPaymentStatus(total, amountPaid);
    const installmentStartDate =
        data.paymentType === "installment" && data.installmentStartDate
            ? new Date(data.installmentStartDate)
            : null;

    await db.transaction(async (tx) => {
        const oldItems = await tx
            .select()
            .from(orderItemTable)
            .where(and(
                eq(orderItemTable.orderId, data.id),
                eq(orderItemTable.businessId, data.businessId),
            ));

        await restoreOrderInventoryRows(tx, {
            businessId: data.businessId,
            items: oldItems,
        });

        const inventoryRows = await getOrderItemInventoryRows(
            tx,
            data.lineItems,
            data.businessId,
        );

        await tx
            .update(orderTable)
            .set({
                customerId: data.customerId,
                total,
                depositPaid: amountPaid,
                paymentStatus,
                paymentType: data.paymentType,
                installmentPlan: data.paymentType === "installment" ? data.installmentPlan : null,
                installmentStartDate,
                status: data.status,
                shippingAddress: data.shippingAddress,
            })
            .where(and(
                eq(orderTable.id, data.id),
                eq(orderTable.businessId, data.businessId),
            ));

        await tx
            .delete(orderItemTable)
            .where(and(
                eq(orderItemTable.orderId, data.id),
                eq(orderItemTable.businessId, data.businessId),
            ));

        await tx
            .insert(orderItemTable)
            .values(
                data.lineItems.map((item) => ({
                    businessId: data.businessId,
                    orderId: data.id,
                    variantId: item.variantId,
                    productId: item.productId,
                    locationId: inventoryRows.find(({ item: inventoryItem }) =>
                        inventoryItem.variantId === item.variantId &&
                        inventoryItem.locationName === item.locationName
                    )?.row.locationId,
                    sku: item.sku,
                    name: item.name,
                    quantity: item.qty,
                    price: item.price,
                    originalPrice: item.originalPrice,
                })),
            );

        await tx
            .update(invoiceTable)
            .set({
                ...getInvoiceValues({
                    businessId: data.businessId,
                    orderId: data.id,
                    total,
                    amountPaid,
                    paymentType: data.paymentType,
                    installmentPlan: data.installmentPlan,
                    installmentStartDate,
                }),
                invoiceNumber: existingOrder.invoice?.invoiceNumber ?? getInvoiceNumber(),
            })
            .where(and(
                eq(invoiceTable.orderId, data.id),
                eq(invoiceTable.businessId, data.businessId),
            ));

        await deductInventoryRows(tx, inventoryRows);
    });

    await recomputeCustomerOrderStats(existingOrder.customerId, data.businessId);
    if (existingOrder.customerId !== data.customerId) {
        await recomputeCustomerOrderStats(data.customerId, data.businessId);
    }

    return getOrderByIdQuery({ id: data.id, businessId: data.businessId });
}

export async function recordOrderPaymentQuery(data: RecordOrderPaymentInput) {
    await autoCancelUnpaidOpenOrders(data.businessId);

    const [updatedOrder] = await db.transaction(async (tx) => {
        const [invoice] = await tx
            .select()
            .from(invoiceTable)
            .where(and(
                eq(invoiceTable.id, data.invoiceId),
                eq(invoiceTable.businessId, data.businessId),
            ));

        if (!invoice) return [];

        const [order] = await tx
            .select()
            .from(orderTable)
            .where(and(
                eq(orderTable.id, invoice.orderId),
                eq(orderTable.businessId, data.businessId),
            ));

        if (!order) return [];

        if (invoice.status === "cancelled" || order.status === "cancelled") {
            throw new Error("This order has been cancelled and can no longer receive payments.");
        }

        const amount = Math.min(data.amount, Math.max(0, invoice.balance));
        if (amount <= 0) {
            throw new Error("This invoice has no remaining balance.");
        }

        const nextPaid = Math.min(order.total, order.depositPaid + amount);
        const nextBalance = Math.max(0, invoice.total - nextPaid);
        const paymentStatus = getPaymentStatus(order.total, nextPaid);
        const paidAt = new Date(data.paymentDate);
        const originalMethodNote =
            data.paymentMethod === "Airtel Money" || data.paymentMethod === "Card"
                ? `${data.paymentMethod}${data.note ? ` - ${data.note}` : ""}`
                : data.note;
        const transactionId = await getUniqueTransactionId(
            tx,
            data.businessId,
            data.paymentMethod,
        );
        const paymentReference =
            data.paymentMethod === "Cash"
                ? data.reference || await getUniqueCashReference(tx, data.businessId)
                : data.reference || null;

        const [payment] = await tx.insert(paymentTable).values({
            businessId: data.businessId,
            invoiceId: invoice.id,
            amount,
            paidAt,
            notes: originalMethodNote || null,
        }).returning();

        await tx.insert(transactionTable).values({
            businessId: data.businessId,
            paymentId: payment.id,
            tnxId: transactionId,
            amount,
            tnxType: getRecordPaymentTransactionType(order),
            status: "success",
            paymentMethod: getDbPaymentMethod(data.paymentMethod),
            provider: data.paymentMethod,
            reference: paymentReference,
            transactedAt: paidAt,
            notes: data.note || null,
        });

        await tx
            .update(invoiceTable)
            .set({
                balance: nextBalance,
                status: getInvoiceStatus(invoice.total, nextPaid),
            })
            .where(and(
                eq(invoiceTable.id, invoice.id),
                eq(invoiceTable.businessId, data.businessId),
            ));

        return tx
            .update(orderTable)
            .set({
                depositPaid: nextPaid,
                paymentStatus,
            })
            .where(and(
                eq(orderTable.id, order.id),
                eq(orderTable.businessId, data.businessId),
            ))
            .returning();
    });

    if (!updatedOrder) return undefined;

    await recomputeCustomerOrderStats(updatedOrder.customerId, data.businessId);
    return getOrderByIdQuery({ id: updatedOrder.id, businessId: data.businessId });
}

export async function updateOrderStatusQuery(data: {
    id: string;
    businessId: string;
    status: OrderStatus;
}) {
    const [order] = await db.transaction(async (tx) => {
        const [existingOrder] = await tx
            .select()
            .from(orderTable)
            .where(and(
                eq(orderTable.id, data.id),
                eq(orderTable.businessId, data.businessId),
            ));

        if (!existingOrder) return [];

        if (existingOrder.status === "cancelled" && data.status !== "cancelled") {
            throw new Error("Cancelled orders cannot be reopened.");
        }

        if (existingOrder.status !== "cancelled" && data.status === "cancelled") {
            const items = await tx
                .select()
                .from(orderItemTable)
                .where(and(
                    eq(orderItemTable.orderId, data.id),
                    eq(orderItemTable.businessId, data.businessId),
                ));

            await restoreOrderInventoryRows(tx, {
                businessId: data.businessId,
                items,
            });
        }

        return tx
            .update(orderTable)
            .set({ status: data.status })
            .where(and(
                eq(orderTable.id, data.id),
                eq(orderTable.businessId, data.businessId),
            ))
            .returning();
    });

    return order ? getOrderByIdQuery({ id: order.id, businessId: data.businessId }) : undefined;
}

export async function deleteOrderQuery(data: {
    id: string;
    businessId: string;
}) {
    const existingOrder = await getOrderByIdQuery(data);
    if (!existingOrder) return undefined;

    await db.transaction(async (tx) => {
        const oldItems = await tx
            .select()
            .from(orderItemTable)
            .where(and(
                eq(orderItemTable.orderId, data.id),
                eq(orderItemTable.businessId, data.businessId),
            ));

        if (existingOrder.status !== "cancelled") {
            await restoreOrderInventoryRows(tx, {
                businessId: data.businessId,
                items: oldItems,
            });
        }

        await tx
            .delete(invoiceTable)
            .where(and(
                eq(invoiceTable.orderId, data.id),
                eq(invoiceTable.businessId, data.businessId),
            ));

        await tx
            .delete(orderTable)
            .where(and(
                eq(orderTable.id, data.id),
                eq(orderTable.businessId, data.businessId),
            ));
    });

    await recomputeCustomerOrderStats(existingOrder.customerId, data.businessId);
    return existingOrder;
}
