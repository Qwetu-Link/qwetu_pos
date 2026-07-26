"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import AddOrderModal, {
  AddOrderSubmitValues,
  OrderVariantOption,
} from "./addOrderModal";
import { useCustomers } from "@/hooks/useCustomers";
import { useCreateOrder } from "@/hooks/useOrders";
import { useGetProducts } from "@/hooks/useProduct";
import { FormPageSkeleton } from "@/components/skeletons";

interface ManualAddOrderPageProps {
  customerId?: string;
}

export default function ManualAddOrderPage({ customerId }: ManualAddOrderPageProps) {
  const router = useRouter();
  const { customers, addCustomer, isCreating: isCreatingCustomer, isLoading } = useCustomers();
  const { products } = useGetProducts();
  const createOrder = useCreateOrder();

  const selectedCustomer = customerId
    ? customers.find((customer) => customer.id === customerId || customer.slug === customerId)
    : null;
  const backHref = selectedCustomer
    ? `/admin/customers/${encodeURIComponent(selectedCustomer.slug)}`
    : "/admin/orders";

  const variantOptions = useMemo<OrderVariantOption[]>(() => {
    return products.flatMap((product) =>
      product.variants
        .map((variant) => ({
          variantId: variant.id,
          productId: product.id,
          sku: variant.sku,
          name: `${product.name} - ${variant.color} (${variant.size})`,
          sellPrice: variant.sellPrice,
          locations: variant.inventory.locations
            .filter((location) => location.stock > 0)
            .map((location) => ({
              name: location.name,
              stock: location.stock,
            })),
        }))
        .filter((variant) => variant.locations.length > 0),
    );
  }, [products]);

  const handleClose = () => {
    router.push(backHref);
  };

  const handleAddOrder = async (values: AddOrderSubmitValues) => {
    const customer = values.newCustomer
      ? await addCustomer(values.newCustomer)
      : undefined;

    await createOrder.mutateAsync({
      customerId: selectedCustomer?.id ?? customer?.id ?? values.customerId,
      paymentType: values.paymentType,
      amountPaid: values.amountPaid,
      installmentPlan: values.installmentPlan,
      installmentStartDate: values.installmentStartDate,
      status: values.status,
      shippingAddress: values.shippingAddress || selectedCustomer?.address || "",
      lineItems: values.lineItems,
    });

    router.push(backHref);
  };

  if (customerId && isLoading) {
    return <FormPageSkeleton />;
  }

  if (customerId && !selectedCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          Customer could not be found.
        </div>
      </div>
    );
  }

  return (
    <AddOrderModal
      customers={selectedCustomer ? [selectedCustomer] : customers}
      variants={variantOptions}
      defaultCustomerId={selectedCustomer?.id ?? ""}
      hideCustomerSelect={Boolean(selectedCustomer)}
      title={selectedCustomer ? `New Order - ${selectedCustomer.name}` : "Manual Add Order"}
      isSaving={createOrder.isPending || isCreatingCustomer}
      onAdd={handleAddOrder}
      onClose={handleClose}
    />
  );
}
