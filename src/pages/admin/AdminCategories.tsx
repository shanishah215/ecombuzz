import { useEffect, useState } from 'react'
import { Pencil, Trash2, PlusCircle, ArrowLeft } from 'lucide-react'
import { categoriesApi, type Category } from '@/api/categories'
import { getErrorMessage } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const EMPTY_FORM = { name: '', description: '', image: '', isActive: true }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  function load() {
    setIsLoading(true)
    categoriesApi.getAll(true)
      .then(({ data }) => setCategories(data.data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }
  function openEdit(c: Category) {
    setForm({ 
      name: c.name, 
      description: c.description || '', 
      image: c.image || '', 
      isActive: c.isActive 
    })
    setEditingId(c._id)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editingId) {
        await categoriesApi.update(editingId, form)
        toast.success('Category updated')
      } else {
        await categoriesApi.create(form)
        toast.success('Category created')
      }
      setShowForm(false)
      load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? This might affect products using it.')) return
    try {
      await categoriesApi.delete(id)
      toast.success('Category deleted')
      load()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/products" className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold text-gray-800 flex-1">Manage Categories</h1>
        <Button size="sm" onClick={openCreate} className="flex items-center gap-1">
          <PlusCircle size={15} /> Add Category
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{editingId ? 'Edit Category' : 'Add Category'}</h2>
            <div className="flex flex-col gap-3">
              <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <Input label="Image URL" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.isActive} 
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} 
                />
                <span className="text-sm text-gray-700">Is Active</span>
              </label>
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

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={3} className="px-4 py-3"><Skeleton className="h-6 w-full" /></td></tr>
              ))
              : categories.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No categories found. Add one or products will use distinct names.</td></tr>
              ) : categories.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.image && <img src={c.image} alt="" className="w-8 h-8 object-contain rounded border border-gray-100" />}
                      <span className="font-medium text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-[#2874f0]"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
