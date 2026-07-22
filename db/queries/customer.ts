import { db } from "@/db";
import { customerTable } from "@/db/schema/customers";
import {
    getCustomerWriteValues,
    mapCustomerRecordToCustomer,
} from "@/utils/customerUtils";
import { and, desc, eq } from "drizzle-orm";

export async function getCustomersQuery(businessId: string) {
    const rows = await db
        .select()
        .from(customerTable)
        .where(eq(customerTable.businessId, businessId))
        .orderBy(desc(customerTable.createdAt));

    return rows.map(mapCustomerRecordToCustomer);
}

export async function getCustomerByIdQuery(data: {
    id: string;
    businessId: string;
}) {
    const [customer] = await db
        .select()
        .from(customerTable)
        .where(and(
            eq(customerTable.id, data.id),
            eq(customerTable.businessId, data.businessId),
        ));

    return customer ? mapCustomerRecordToCustomer(customer) : undefined;
}

export async function createCustomerQuery(data: {
    businessId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    segment: "New" | "Regular" | "VIP";
    riskLevel: "low" | "medium" | "high";
}) {
    const [customer] = await db
        .insert(customerTable)
        .values({
            businessId: data.businessId,
            ...getCustomerWriteValues(data),
        })
        .returning();

    return mapCustomerRecordToCustomer(customer);
}

export async function updateCustomerQuery(data: {
    id: string;
    businessId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    segment: "New" | "Regular" | "VIP";
    riskLevel: "low" | "medium" | "high";
}) {
    const { id, businessId, ...values } = data;

    const [customer] = await db
        .update(customerTable)
        .set(getCustomerWriteValues(values))
        .where(and(
            eq(customerTable.id, id),
            eq(customerTable.businessId, businessId),
        ))
        .returning();

    return customer ? mapCustomerRecordToCustomer(customer) : undefined;
}

export async function deleteCustomerQuery(data: {
    id: string;
    businessId: string;
}) {
    const [customer] = await db
        .delete(customerTable)
        .where(and(
            eq(customerTable.id, data.id),
            eq(customerTable.businessId, data.businessId),
        ))
        .returning();

    return customer ? mapCustomerRecordToCustomer(customer) : undefined;
}
