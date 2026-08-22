import {
    createCustomerQuery,
    deleteCustomerQuery,
    getCustomerByIdQuery,
    getCustomersQuery,
    updateCustomerQuery,
} from "@/db/queries/customer";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {
    customerEditSchema,
    customerIdSchema,
    customerSchema,
} from "@/db/schema/validators/customer";
import { TRPCError } from "@trpc/server";

type DatabaseError = {
    code?: string;
    constraint_name?: string;
    constraint?: string;
};

function ensureBusinessId(businessId: string | null) {
    if (!businessId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be signed in to manage customers.",
        });
    }

    return businessId;
}

function ensureCustomerExists<T>(customer: T | undefined) {
    if (!customer) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Customer not found for this business.",
        });
    }

    return customer;
}

function getDatabaseError(error: unknown): DatabaseError {
    return typeof error === "object" && error !== null ? error : {};
}

function getFriendlyCustomerError(error: unknown, action: "create" | "update" | "delete"): never {
    if (error instanceof TRPCError) {
        throw error;
    }

    const databaseError = getDatabaseError(error);
    const constraint = databaseError.constraint_name ?? databaseError.constraint;

    if (databaseError.code === "23505" && constraint === "business_customer_email_idx") {
        throw new TRPCError({
            code: "CONFLICT",
            message: "A customer with this email already exists.",
        });
    }

    const fallbackMessage =
        action === "create"
            ? "Could not create the customer. Please check the details and try again."
            : action === "update"
                ? "Could not update the customer. Please check the details and try again."
                : "Could not delete the customer. Please try again.";

    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: fallbackMessage,
    });
}

export const customerRouter = createTRPCRouter({
    getCustomers: baseProcedure.query(async ({ ctx }) => {
        const businessId = ensureBusinessId(ctx.businessId);

        return getCustomersQuery(businessId);
    }),

    getCustomerById: baseProcedure
        .input(customerIdSchema)
        .query(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);
            const customer = await getCustomerByIdQuery({
                id: input.id,
                businessId,
            });

            return ensureCustomerExists(customer);
        }),

    addCustomer: baseProcedure
        .input(customerSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                return await createCustomerQuery({
                    ...input,
                    businessId,
                });
            } catch (error) {
                getFriendlyCustomerError(error, "create");
            }
        }),

    editCustomer: baseProcedure
        .input(customerEditSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const customer = await updateCustomerQuery({
                    ...input,
                    businessId,
                });

                return ensureCustomerExists(customer);
            } catch (error) {
                getFriendlyCustomerError(error, "update");
            }
        }),

    removeCustomer: baseProcedure
        .input(customerIdSchema)
        .mutation(async ({ input, ctx }) => {
            const businessId = ensureBusinessId(ctx.businessId);

            try {
                const customer = await deleteCustomerQuery({
                    id: input.id,
                    businessId,
                });

                return ensureCustomerExists(customer);
            } catch (error) {
                getFriendlyCustomerError(error, "delete");
            }
        }),
});
