import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartApi } from '@/api/cart'
import { getErrorMessage } from '@/lib/utils'
import type { CartItem, Product } from '@/types'
import toast from 'react-hot-toast'

interface CartStore {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncFromServer: () => Promise<void>
  // Optimistic local cart for guests
  addLocal: (product: Product, quantity?: number) => void
  removeLocal: (productId: string) => void
  updateLocal: (productId: string, quantity: number) => void
}

function calcTotals(items: CartItem[]) {
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  return { total, itemCount }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isLoading: false,

      addItem: async (product, quantity = 1) => {
        set({ isLoading: true })
        try {
          const { data } = await cartApi.add(product._id, quantity)
          set({ items: data.data.items, total: data.data.total, itemCount: data.data.itemCount })
          toast.success('Added to cart')
        } catch (err) {
          toast.error(getErrorMessage(err))
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (productId) => {
        set({ isLoading: true })
        try {
          const { data } = await cartApi.remove(productId)
          set({ items: data.data.items, total: data.data.total, itemCount: data.data.itemCount })
        } catch (err) {
          toast.error(getErrorMessage(err))
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (productId, quantity) => {
        set({ isLoading: true })
        try {
          const { data } = await cartApi.update(productId, quantity)
          set({ items: data.data.items, total: data.data.total, itemCount: data.data.itemCount })
        } catch (err) {
          toast.error(getErrorMessage(err))
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: async () => {
        set({ isLoading: true })
        try {
          await cartApi.clear()
          set({ items: [], total: 0, itemCount: 0 })
        } catch (err) {
          toast.error(getErrorMessage(err))
        } finally {
          set({ isLoading: false })
        }
      },

      syncFromServer: async () => {
        try {
          const { data } = await cartApi.get()
          set({ items: data.data.items, total: data.data.total, itemCount: data.data.itemCount })
        } catch { /* silent */ }
      },

      // Guest / optimistic helpers
      addLocal: (product, quantity = 1) => {
        const { items } = get()
        const idx = items.findIndex((i) => i.product._id === product._id)
        let next: CartItem[]
        if (idx > -1) {
          next = items.map((i, j) => j === idx ? { ...i, quantity: i.quantity + quantity } : i)
        } else {
          next = [...items, { product, quantity }]
        }
        set({ items: next, ...calcTotals(next) })
        toast.success('Added to cart')
      },

      removeLocal: (productId) => {
        const next = get().items.filter((i) => i.product._id !== productId)
        set({ items: next, ...calcTotals(next) })
      },

      updateLocal: (productId, quantity) => {
        const next = get().items.map((i) =>
          i.product._id === productId ? { ...i, quantity } : i,
        )
        set({ items: next, ...calcTotals(next) })
      },
    }),
    { 
      name: 'cart-storage',
      version: 1,
      partialize: (state) => ({ items: state.items }),
      migrate: () => ({ items: [] }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { total, itemCount } = calcTotals(state.items)
          state.total = total
          state.itemCount = itemCount
        }
      },
    },
  ),
)
