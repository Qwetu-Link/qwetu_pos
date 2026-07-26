export const expenseCategoryValues = [
  "rent",
  "utilities",
  "salaries",
  "transport",
  "supplies",
  "inventory_purchase",
  "marketing",
  "equipment",
  "maintenance",
  "insurance",
  "taxes",
  "loan_repayment",
  "other",
] as const;

export function getExpenseCategoryLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeExpenseCategory(value: string) {
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return expenseCategoryValues.includes(normalized as typeof expenseCategoryValues[number])
    ? normalized as typeof expenseCategoryValues[number]
    : "other";
}
