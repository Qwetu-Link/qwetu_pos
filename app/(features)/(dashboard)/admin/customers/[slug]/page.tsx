import { CustomerDetailView } from "../_components/CustomerDetailView";

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CustomerDetailView customerId={decodeURIComponent(slug)} />;
}
