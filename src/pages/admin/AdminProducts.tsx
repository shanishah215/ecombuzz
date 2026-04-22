import { useEffect, useState } from 'react'
import { Pencil, Trash2, PlusCircle } from 'lucide-react'
import { productsApi } from '@/api/products'
import { formatPrice, getErrorMessage } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

const EMPTY_FORM = {
  name: '', description: '', price: '', originalPrice: '', discount: '',
  category: '', brand: '', stock: '', images: '', tags: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  function load(p = 1) {
    setIsLoading(true)
    productsApi.getAll({ page: p, limit: 15 })
      .then(({ data }) => { setProducts(data.data.products); setTotal(data.data.total) })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { load(page) }, [page])

  function openCreate() { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }
  function openEdit(p: Product) {
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      originalPrice: String(p.originalPrice), discount: String(p.discount),
      category: p.category, brand: p.brand, stock: String(p.stock),
      images: p.images.join(', '), tags: p.tags.join(', '),
    })
    setEditingId(p._id)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        name: form.name, description: form.description,
        price: Number(form.price), originalPrice: Number(form.originalPrice),
        discount: Number(form.discount), category: form.category, brand: form.brand,
        stock: Number(form.stock),
        images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      }
      const fd = new FormData()
      Object.entries(payload).forEach(([k, v]) =>
        fd.append(k, Array.isArray(v) ? JSON.stringify(v) : String(v)))

      if (editingId) {
        await productsApi.update(editingId, fd)
        toast.success('Product updated')
      } else {
        await productsApi.create(fd)
        toast.success('Product created')
      }
      setShowForm(false)
      load(page)
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    try {
      await productsApi.delete(id)
      toast.success('Product deleted')
      load(page)
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Products <span className="text-sm font-normal text-gray-400">({total})</span></h1>
        <Button size="sm" onClick={openCreate} className="flex items-center gap-1">
          <PlusCircle size={15} /> Add Product
        </Button>
      </div>

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="col-span-2" />
              <Input label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
              <Input label="Brand" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
              <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
              <Input label="Original Price (₹)" type="number" value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} />
              <Input label="Discount (%)" type="number" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} />
              <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
              <Input label="Image URLs (comma-separated)" value={form.images} onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))} className="col-span-2" />
              <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className="col-span-2" />
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="sm" isLoading={saving} onClick={handleSave}>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><Skeleton className="h-6 w-full" /></td></tr>
              ))
              : products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-10 h-10 object-contain rounded border border-gray-100 bg-gray-50" />
                      <span className="font-medium text-gray-800 line-clamp-1 max-w-[160px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize hidden sm:table-cell">{p.category}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-orange-500' : 'text-red-500'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-[#2874f0]"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {/* Pagination */}
        {Math.ceil(total / 15) > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <span className="text-sm text-gray-500 self-center">Page {page} of {Math.ceil(total / 15)}</span>
            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 15)} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  )
}
