export interface NavItemConfig {
    label: string;
    tab: string;
    icon: string;
    href: string;
}

export const ALL_NAV_ITEMS: NavItemConfig[] = [
    {
        label: "Executive Dashboard",
        tab: "dashboard",
        icon: "ChartLine",
        href: "/dashboard",
    },
    {
        label: "Product Catalog",
        tab: "catalog",
        icon: "Tags",
        href: "/admin/products",
    },
    {
        label: "Product Variants",
        tab: "variants",
        icon: "Cubes",
        href: "/admin/variants",
    },
    {
        label: "Inventory Intelligence",
        tab: "inventory",
        icon: "Boxes",
        href: "/admin/inventory",
    },
    {
        label: "Orders Pipeline",
        tab: "orders",
        icon: "Tasks",
        href: "/admin/orders",
    },
    {
        label: "Customers Hub",
        tab: "customers",
        icon: "Users",
        href: "/admin/customers",
    },
    {
        label: "Transactions Hub",
        tab: "transactions",
        icon: "DollarSign",
        href: "/admin/transactions",
    },
    {
        label: "Lipa Mdogo Core",
        tab: "installments",
        icon: "HandHoldingUsd",
        href: "/admin/mdogo",
    },
    {
        label: "Analytics Engine",
        tab: "analytics",
        icon: "ChartPie",
        href: "/admin/analytics",
    },
    {
        label: "Reports Center",
        tab: "reports",
        icon: "FileText",
        href: "/admin/reports",
    },
    {
        label: "Settings",
        tab: "settings",
        icon: "Settings",
        href: "/admin/settings",
    },
];
