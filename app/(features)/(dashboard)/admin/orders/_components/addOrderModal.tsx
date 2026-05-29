"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import {
  Calculator,
  CheckCircle2,
  PackagePlus,
  PackageSearch,
  Percent,
  ShoppingCart,
  Tag,
  Trash2,
} from "lucide-react";
import ModalFrame from "./modalFrame";
import { LineItem, Order, OrderStatus, PaymentType } from "../../../../../../types/orderTypes";
import { formatCurrency, generateOrderId } from "../../../../../../lib/orderUtils";
import type { Customer } from "@/types/customer";
import { DEMO_VARIANTS, generateCustomerId, getPaymentScoreFromRisk } from "@/lib/customerUtils";

interface LineItemRow {
  id: number;
  variantId: string;
  qty: number;
  originalPrice: number;
  discountPrice: string;
}

const addOrderSchema = z.object({
  selectedCustomerId: z.string().min(1, "Customer is required"),
  customer: z.string().trim(),
  email: z.email("Enter a valid email address").trim().or(z.literal("")),
  phone: z.string().trim(),
  address: z.string().trim(),
  paymentType: z.enum(["full", "installment"]),
  installmentPlan: z.string(),
  installmentStartDate: z.string(),
  status: z.enum(["pending", "processing", "shipped", "delivered"]),
}).superRefine((values, ctx) => {
  if (values.selectedCustomerId !== "new") {
    return;
  }
  if (!values.customer) {
    ctx.addIssue({ code: "custom", message: "Customer name is required", path: ["customer"] });
  }
  if (!values.phone) {
    ctx.addIssue({ code: "custom", message: "Phone number is required", path: ["phone"] });
  }
});

type AddOrderFormValues = z.infer<typeof addOrderSchema>;

let rowCounter = 0;

const createBlankLineItem = (): LineItemRow => ({
  id: ++rowCounter,
  variantId: "",
  qty: 1,
  originalPrice: 0,
  discountPrice: "",
});

function FormField({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  register,
  error,
}: {
  label: string;
  name: keyof AddOrderFormValues;
  type?: string;
  required?: boolean;
  placeholder?: string;
  register: UseFormRegister<AddOrderFormValues>;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        {...register(name)}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-slate-400 transition outline-none focus:ring-2 focus:ring-emerald-500"
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </label>
  );
}

export default function AddOrderModal({
  orders,
  customers,
  onAdd,
  onAddCustomer,
  onClose,
}: {
  orders: Order[];
  customers: Customer[];
  onAdd: (order: Order) => void;
  onAddCustomer: (customer: Customer) => void;
  onClose: () => void;
}) {
  const [lineItems, setLineItems] = useState<LineItemRow[]>([createBlankLineItem()]);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<AddOrderFormValues>({
    resolver: zodResolver(addOrderSchema),
    defaultValues: {
      selectedCustomerId: "",
      customer: "",
      email: "",
      phone: "",
      address: "",
      paymentType: "full",
      installmentPlan: "3 months",
      installmentStartDate: new Date().toISOString().slice(0, 10),
      status: "pending",
    },
  });
  const selectedCustomerId = useWatch({ control, name: "selectedCustomerId" });
  const paymentType = useWatch({ control, name: "paymentType" });

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId,
  );
  const isNewCustomer = selectedCustomerId === "new";

  const getVariant = (id: string) =>
    DEMO_VARIANTS.find((variant) => variant.variantId === id);

  const getEffectivePrice = (item: LineItemRow) => {
    const discountPrice = Number(item.discountPrice);
    return Number.isFinite(discountPrice) && discountPrice > 0
      ? discountPrice
      : item.originalPrice;
  };

  const totalPreview = lineItems.reduce(
    (sum, item) => sum + item.qty * getEffectivePrice(item),
    0,
  );

  const updateLineItem = (
    id: number,
    patch: Partial<LineItemRow>,
  ) => {
    setLineItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    );
  };

  const handleVariantChange = (id: number, variantId: string) => {
    const variant = getVariant(variantId);
    updateLineItem(id, {
      variantId,
      originalPrice: variant?.sellPrice ?? 0,
      discountPrice: "",
    });
  };

  const removeLineItem = (id: number) => {
    setLineItems((items) =>
      items.length === 1
        ? [createBlankLineItem()]
        : items.filter((item) => item.id !== id),
    );
  };

  const submitOrder = (values: AddOrderFormValues) => {
    const validLineItems = lineItems.filter(
      (item) => item.variantId && item.qty > 0 && getEffectivePrice(item) > 0,
    );

    if (validLineItems.length === 0) return;

    const orderLineItems: LineItem[] = validLineItems.map((item) => {
      const variant = getVariant(item.variantId);
      const effectivePrice = getEffectivePrice(item);

      return {
        variantId: item.variantId,
        productId: variant?.productId ?? item.variantId,
        sku: variant?.sku ?? item.variantId,
        name: variant?.name ?? "Selected product",
        qty: item.qty,
        price: effectivePrice,
        originalPrice: item.originalPrice || effectivePrice,
      };
    });

    const total = orderLineItems.reduce(
      (sum, item) => sum + item.qty * item.price,
      0,
    );
    const amountPaid = paymentType === "full" ? total : 0;
    const remainingAmount = Math.max(0, total - amountPaid);
    const createdAt = new Date().toISOString().slice(0, 10);
    const customer =
      selectedCustomer ??
      createCustomerFromForm(values, customers, total, paymentType, createdAt);

    if (isNewCustomer) {
      onAddCustomer(customer);
    }

    onAdd({
      id: generateOrderId(orders),
      customerId: customer.id,
      customer: customer.name,
      email: customer.email,
      phone: customer.phone,
      shippingAddress: customer.address,
      paymentType,
      installmentPlan:
        paymentType === "installment"
          ? values.installmentPlan
          : undefined,
      installmentStartDate:
        paymentType === "installment"
          ? values.installmentStartDate
          : undefined,
      status: values.status as OrderStatus,
      createdAt,
      lineItems: orderLineItems,
      items: orderLineItems.reduce((sum, item) => sum + item.qty, 0),
      total,
      amountPaid,
      remainingAmount,
      paymentStatus: remainingAmount > 0 ? "partial" : "paid",
    });
  };

  return (
    <ModalFrame
      title="Manual Add Order"
      icon={<ShoppingCart className="h-6 w-6 text-emerald-600" />}
      maxWidth="max-w-4xl"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(submitOrder)} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Customer
            </span>
            <select
              {...register("selectedCustomerId")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-slate-400 transition outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select customer</option>
              <option value="new">Add new customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
            {errors.selectedCustomerId ? (
              <p className="mt-1 text-xs text-red-500">{errors.selectedCustomerId.message}</p>
            ) : null}
          </label>

          {isNewCustomer ? (
            <>
              <FormField
                label="Customer Name"
                required
                name="customer"
                placeholder="e.g. Sarah Mwangi"
                register={register}
                error={errors.customer?.message}
              />
              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@example.com"
                register={register}
                error={errors.email?.message}
              />
              <FormField
                label="Phone Number"
                required
                name="phone"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                register={register}
                error={errors.phone?.message}
              />
              <FormField
                label="Shipping Address"
                name="address"
                placeholder="Street, city or delivery location"
                register={register}
                error={errors.address?.message}
              />
            </>
          ) : (
            selectedCustomer && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 md:col-span-2">
                <p className="font-semibold text-slate-800">{selectedCustomer.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedCustomer.email || "No email"} - {selectedCustomer.phone}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedCustomer.address || "No shipping address"}
                </p>
              </div>
            )
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Payment Type
            </span>
            <select
              {...register("paymentType")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-slate-400 transition outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="full">Full Payment</option>
              <option value="installment">Installment (Lipa Mdogo)</option>
            </select>
          </label>
          {paymentType === "installment" && (
            <>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Installment Plan
                </span>
                <select
                  {...register("installmentPlan")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-slate-400 transition outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="9 months">9 Months</option>
                  <option value="12 months">12 Months</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Installment Start Date
                </span>
                <input
                  type="date"
                  {...register("installmentStartDate")}
                  placeholder="Select start date"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>
            </>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Order Status
            </span>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-black placeholder:text-slate-400 transition outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </label>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Order Items
            </label>
            <button
              type="button"
              onClick={() =>
                setLineItems((items) => [...items, createBlankLineItem()])
              }
              className="inline-flex items-center gap-1 text-black placeholder:text-slate-400 transition rounded-lg bg-emerald-100 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-200"
            >
              <PackagePlus className="h-4 w-4" />
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="mb-3">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    <PackageSearch className="mr-1 inline h-3 w-3 text-emerald-600" />
                    Product Variant
                  </label>
                  <select
                    value={item.variantId}
                    onChange={(event) =>
                      handleVariantChange(item.id, event.target.value)
                    }
                    className="w-full rounded-xl text-black placeholder:text-slate-400 transition border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select product variant...</option>
                    {DEMO_VARIANTS.map((variant) => (
                      <option key={variant.variantId} value={variant.variantId}>
                        {variant.name} - {formatCurrency(variant.sellPrice)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Qty
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      placeholder="1"
                      onChange={(event) =>
                        updateLineItem(item.id, {
                          qty: Math.max(Number(event.target.value) || 1, 1),
                        })
                      }
                      className="w-full rounded-xl text-black placeholder:text-slate-400 transition border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      <Tag className="mr-0.5 inline h-3 w-3 text-purple-600" />
                      Original Price
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={item.originalPrice || ""}
                      onChange={(event) =>
                        updateLineItem(item.id, {
                          originalPrice: Math.max(Number(event.target.value) || 0, 0),
                        })
                      }
                      className="w-full rounded-xl border text-black placeholder:text-slate-400 transition border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="0"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      <Percent className="mr-0.5 inline h-3 w-3 text-orange-600" />
                      Discount Price
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={item.discountPrice}
                      onChange={(event) =>
                        updateLineItem(item.id, { discountPrice: event.target.value })
                      }
                      className="w-full rounded-xl border text-black placeholder:text-slate-400 transition border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Optional"
                    />
                  </label>

                  <div>
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      <Calculator className="mr-0.5 inline h-3 w-3 text-green-600" />
                      Subtotal
                    </span>
                    <div className="rounded-xl border text-black placeholder:text-slate-400 transition border-emerald-200 bg-emerald-50 px-3 py-2.5 text-center text-sm font-semibold text-emerald-700">
                      {formatCurrency(item.qty * getEffectivePrice(item))}
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right font-semibold text-slate-700">
            Total Amount:{" "}
            <span className="text-xl text-emerald-700">
              {formatCurrency(totalPreview)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 font-medium text-white hover:shadow-lg"
          >
            <CheckCircle2 className="h-4 w-4" />
            Create Order
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}

function createCustomerFromForm(
  values: AddOrderFormValues,
  customers: Customer[],
  orderTotal: number,
  paymentType: PaymentType,
  createdAt: string,
): Customer {
  const activeInstallments = paymentType === "installment" ? 1 : 0;

  return {
    id: generateCustomerId(customers),
    name: values.customer,
    email: values.email,
    phone: values.phone,
    address: values.address,
    segment: "New",
    riskLevel: "low",
    paymentScore: getPaymentScoreFromRisk("low"),
    totalOrders: 1,
    totalSpent: orderTotal,
    activeInstallments,
    joinedDate: createdAt,
    lastPurchase: createdAt,
  };
}
