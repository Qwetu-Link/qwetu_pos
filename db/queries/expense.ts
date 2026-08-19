import { db } from "@/db";
import { expenseItemTable, expenseTable, transactionTable } from "@/db/schema/payments";
import { getExpenseCategoryLabel, normalizeExpenseCategory } from "@/data/expense-categories";
import type { Expense, ExpenseStatus } from "@/types/admin/transactions";
import { and, desc, eq } from "drizzle-orm";
import crypto from "crypto";

type ExpenseWriteInput = {
    businessId: string;
    date: string;
    category: string;
    vendor: string;
    amount?: number;
    method: "M-Pesa" | "Cash" | "Bank Transfer" | "Card";
    status: ExpenseStatus;
    note?: string;
    items?: {
        name: string;
        quantity: number;
        unitCost: number;
    }[];
};

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | DbTransaction;

function getDbPaymentMethod(method: ExpenseWriteInput["method"]) {
    if (method === "Cash") return "cash" as const;
    if (method === "Bank Transfer") return "bank" as const;
    if (method === "Card") return "card" as const;
    return "mpesa" as const;
}

function getReadablePaymentMethod(method: typeof transactionTable.$inferSelect.paymentMethod) {
    if (method === "mpesa") return "M-Pesa";
    if (method === "bank") return "Bank Transfer";
    if (method === "card") return "Card";
    return "Cash";
}

function getTransactionStatus(status: ExpenseStatus) {
    if (status === "approved") return "success" as const;
    if (status === "rejected") return "failed" as const;
    return "pending" as const;
}

function getDigitCode(length: number) {
    return String(crypto.randomInt(0, 10 ** length)).padStart(length, "0");
}

function getLetterCode(length: number) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length }, () => alphabet[crypto.randomInt(0, alphabet.length)]).join("");
}

async function getUniqueExpenseNo(client: DbClient, businessId: string) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
        const expenseNo = `EXP-${getLetterCode(5)}`;
        const [existing] = await client
            .select({ id: expenseTable.id })
            .from(expenseTable)
            .where(and(
                eq(expenseTable.businessId, businessId),
                eq(expenseTable.expenseNo, expenseNo),
            ));

        if (!existing) return expenseNo;
    }

    return `EXP-${getLetterCode(5)}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

async function getUniqueTransactionId(client: DbClient, businessId: string, method: ExpenseWriteInput["method"]) {
    const methodLetter = method.charAt(0).toUpperCase();

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

function displayCategory(category: string) {
    return getExpenseCategoryLabel(category);
}

function mapExpense(data: {
    expense: typeof expenseTable.$inferSelect;
    transaction: typeof transactionTable.$inferSelect;
    items: (typeof expenseItemTable.$inferSelect)[];
}): Expense {
    return {
        id: data.expense.id,
        expenseNo: data.expense.expenseNo ?? `EXP-${data.expense.id.slice(0, 5).toUpperCase()}`,
        date: data.transaction.transactedAt.toISOString(),
        category: displayCategory(data.expense.category),
        vendor: data.expense.vendorName ?? "",
        method: getReadablePaymentMethod(data.transaction.paymentMethod),
        amount: data.expense.amount,
        status: data.expense.status,
        note: data.expense.notes ?? data.transaction.notes ?? "",
        items: data.items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unitCost: item.unitCost,
            total: item.total,
        })),
    };
}

export async function getExpensesQuery(businessId: string): Promise<Expense[]> {
    const rows = await db
        .select({
            expense: expenseTable,
            transaction: transactionTable,
            item: expenseItemTable,
        })
        .from(expenseTable)
        .innerJoin(transactionTable, eq(transactionTable.id, expenseTable.transactionId))
        .leftJoin(expenseItemTable, eq(expenseItemTable.expenseId, expenseTable.id))
        .where(eq(expenseTable.businessId, businessId))
        .orderBy(desc(transactionTable.transactedAt));

    const grouped = new Map<string, {
        expense: typeof expenseTable.$inferSelect;
        transaction: typeof transactionTable.$inferSelect;
        items: (typeof expenseItemTable.$inferSelect)[];
    }>();

    for (const row of rows) {
        const current = grouped.get(row.expense.id) ?? {
            expense: row.expense,
            transaction: row.transaction,
            items: [],
        };
        if (row.item) current.items.push(row.item);
        grouped.set(row.expense.id, current);
    }

    return [...grouped.values()].map(mapExpense);
}

export async function createExpenseQuery(data: ExpenseWriteInput) {
    const amount = getExpenseTotal(data);
    const [expense] = await db.transaction(async (tx) => {
        const transactedAt = new Date(data.date);
        const transactionId = crypto.randomUUID();
        await tx.insert(transactionTable).values({
            id: transactionId,
            businessId: data.businessId,
            paymentId: null,
            tnxId: await getUniqueTransactionId(tx, data.businessId, data.method),
            amount: -Math.abs(amount),
            tnxType: "expense",
            status: getTransactionStatus(data.status),
            paymentMethod: getDbPaymentMethod(data.method),
            provider: data.method,
            reference: null,
            transactedAt,
            notes: data.note || null,
        });

        const expenseId = crypto.randomUUID();
        await tx.insert(expenseTable).values({
            id: expenseId,
            businessId: data.businessId,
            expenseNo: await getUniqueExpenseNo(tx, data.businessId),
            transactionId,
            category: normalizeExpenseCategory(data.category),
            vendorName: data.vendor,
            amount,
            status: data.status,
            notes: data.note || null,
        });

        if (data.category === "inventory_purchase" && data.items?.length) {
            await tx.insert(expenseItemTable).values(
                data.items.map((item) => ({
                    businessId: data.businessId,
                    expenseId: expense.id,
                    name: item.name,
                    quantity: item.quantity,
                    unitCost: item.unitCost,
                    total: item.quantity * item.unitCost,
                })),
            );
        }

        const [expense] = await tx
            .select()
            .from(expenseTable)
            .where(eq(expenseTable.id, expenseId));

        return [expense];
    });

    return expense ? getExpenseByIdQuery({ id: expense.id, businessId: data.businessId }) : undefined;
}

export async function updateExpenseQuery(data: ExpenseWriteInput & { id: string }) {
    const existing = await getRawExpenseById(data.id, data.businessId);
    if (!existing) return undefined;
    const amount = getExpenseTotal(data);

    await db.transaction(async (tx) => {
        await tx.update(transactionTable)
            .set({
                amount: -Math.abs(amount),
                status: getTransactionStatus(data.status),
                paymentMethod: getDbPaymentMethod(data.method),
                provider: data.method,
                transactedAt: new Date(data.date),
                notes: data.note || null,
            })
            .where(and(
                eq(transactionTable.id, existing.transactionId),
                eq(transactionTable.businessId, data.businessId),
            ));

        await tx.update(expenseTable)
            .set({
                category: normalizeExpenseCategory(data.category),
                vendorName: data.vendor,
                amount,
                status: data.status,
                notes: data.note || null,
            })
            .where(and(
                eq(expenseTable.id, data.id),
                eq(expenseTable.businessId, data.businessId),
            ));

        await tx.delete(expenseItemTable)
            .where(and(
                eq(expenseItemTable.expenseId, data.id),
                eq(expenseItemTable.businessId, data.businessId),
            ));

        if (data.category === "inventory_purchase" && data.items?.length) {
            await tx.insert(expenseItemTable).values(
                data.items.map((item) => ({
                    businessId: data.businessId,
                    expenseId: data.id,
                    name: item.name,
                    quantity: item.quantity,
                    unitCost: item.unitCost,
                    total: item.quantity * item.unitCost,
                })),
            );
        }
    });

    return getExpenseByIdQuery({ id: data.id, businessId: data.businessId });
}

export async function updateExpenseStatusQuery(data: {
    id: string;
    businessId: string;
    status: ExpenseStatus;
}) {
    const existing = await getRawExpenseById(data.id, data.businessId);
    if (!existing) return undefined;

    await db.transaction(async (tx) => {
        await tx.update(expenseTable)
            .set({ status: data.status })
            .where(and(
                eq(expenseTable.id, data.id),
                eq(expenseTable.businessId, data.businessId),
            ));

        await tx.update(transactionTable)
            .set({ status: getTransactionStatus(data.status) })
            .where(and(
                eq(transactionTable.id, existing.transactionId),
                eq(transactionTable.businessId, data.businessId),
            ));
    });

    return getExpenseByIdQuery({ id: data.id, businessId: data.businessId });
}

export async function deleteExpenseQuery(data: { id: string; businessId: string }) {
    const existing = await getRawExpenseById(data.id, data.businessId);
    if (!existing) return undefined;

    const mapped = await getExpenseByIdQuery(data);

    await db
        .delete(transactionTable)
        .where(and(
            eq(transactionTable.id, existing.transactionId),
            eq(transactionTable.businessId, data.businessId),
        ));

    return mapped;
}

async function getRawExpenseById(id: string, businessId: string) {
    const [expense] = await db
        .select()
        .from(expenseTable)
        .where(and(
            eq(expenseTable.id, id),
            eq(expenseTable.businessId, businessId),
        ));

    return expense;
}

export async function getExpenseByIdQuery(data: { id: string; businessId: string }) {
    const [row] = await db
        .select({
            expense: expenseTable,
            transaction: transactionTable,
        })
        .from(expenseTable)
        .innerJoin(transactionTable, eq(transactionTable.id, expenseTable.transactionId))
        .where(and(
            eq(expenseTable.id, data.id),
            eq(expenseTable.businessId, data.businessId),
        ));

    if (!row) return undefined;

    const items = await db
        .select()
        .from(expenseItemTable)
        .where(and(
            eq(expenseItemTable.expenseId, data.id),
            eq(expenseItemTable.businessId, data.businessId),
        ));

    return mapExpense({ ...row, items });
}

function getExpenseItemsTotal(items: ExpenseWriteInput["items"]) {
    return items?.reduce((sum, item) => sum + item.quantity * item.unitCost, 0) ?? 0;
}

function getExpenseTotal(data: Pick<ExpenseWriteInput, "amount" | "category" | "items">) {
    if (data.category === "inventory_purchase") {
        return getExpenseItemsTotal(data.items);
    }

    return data.amount ?? 0;
}
