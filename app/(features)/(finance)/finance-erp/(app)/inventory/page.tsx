import { Button } from '@/components/ui/button'
import { Plus, Download, Filter, AlertTriangle } from 'lucide-react'
import { PageLayout } from '../../../_components/page-layout'

export const metadata = {
  title: 'Inventory - Qwetulink Finance ERP',
  description: 'Inventory and product management',
}

export default function InventoryPage() {
  const products = [
    { id: 'SKU001', name: 'Wireless Mouse', category: 'Electronics', quantity: 245, unit: 'Units', value: 122500, reorder: 50, status: 'Optimal' },
    { id: 'SKU002', name: 'USB-C Cable', category: 'Accessories', quantity: 12, unit: 'Units', value: 18000, reorder: 100, status: 'Low Stock' },
    { id: 'SKU003', name: 'Laptop Stand', category: 'Furniture', quantity: 0, unit: 'Units', value: 0, reorder: 20, status: 'Out of Stock' },
    { id: 'SKU004', name: 'Mechanical Keyboard', category: 'Electronics', quantity: 78, unit: 'Units', value: 312000, reorder: 30, status: 'Optimal' },
    { id: 'SKU005', name: 'Monitor 27in', category: 'Electronics', quantity: 5, unit: 'Units', value: 250000, reorder: 10, status: 'Low Stock' },
    { id: 'SKU006', name: 'Desk Lamp', category: 'Furniture', quantity: 340, unit: 'Units', value: 102000, reorder: 100, status: 'Optimal' },
  ]

  return (
      <PageLayout
        title="Inventory Management"
        subtitle="Track products, stock levels, and inventory value"
        actions={
          <>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Product
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </>
        }
      >
        {/* Inventory Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold text-foreground">180</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Units</p>
            <p className="text-2xl font-bold text-foreground">680</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 bg-primary/5">
            <p className="text-sm text-muted-foreground">Inventory Value</p>
            <p className="text-2xl font-bold text-primary">KES 804,500</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 bg-red-50">
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <p className="text-2xl font-bold text-red-600">3</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">SKU</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Product Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Category</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Quantity</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Reorder Level</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Value</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{product.id}</td>
                    <td className="px-6 py-4 text-foreground">{product.name}</td>
                    <td className="px-6 py-4 text-foreground text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">{product.quantity} {product.unit}</td>
                    <td className="px-6 py-4 text-right text-foreground">{product.reorder} {product.unit}</td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">KES {product.value.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'Optimal' ? 'bg-green-100 text-green-800' :
                        product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 gap-1' :
                        'bg-red-100 text-red-800 gap-1'
                      }`}>
                        {product.status === 'Low Stock' || product.status === 'Out of Stock' && <AlertTriangle className="h-3 w-3" />}
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageLayout>
  )
}
