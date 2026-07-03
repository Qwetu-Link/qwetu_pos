export type UserRole =
    | "Accountant"
    | "Cashier"
    | "Inventory"
    | "Manager"
    | "Owner";

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    Accountant: [
        "dashboard",
        "transactions",
        "installments",
        "analytics",
        "reports",
    ],
    Cashier: ["dashboard", "orders", "customers", "transactions", "installments"],
    Inventory: ["dashboard", "catalog", "variants", "inventory"],
    Manager: [
        "dashboard",
        "catalog",
        "variants",
        "inventory",
        "orders",
        "customers",
        "transactions",
        "reports",
    ],
    Owner: [
        "dashboard",
        "catalog",
        "category",
        "variants",
        "inventory",
        "orders",
        "customers",
        "transactions",
        "installments",
        "finance",
        "analytics",
        "reports",
        "settings",
    ],
};
