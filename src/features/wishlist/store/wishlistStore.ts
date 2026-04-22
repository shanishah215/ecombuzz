import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { wishlistApi } from '@/api/wishlist'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

interface WishlistStore {
  items: Product[]
  isInWishlist: (productId: string) => boolean
  toggle: (product: Product) => void
  syncFromServer: () => Promise<void>
  clearLocal: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      isInWishlist: (productId) =>
        get().items.some((p) => p._id === productId),

      toggle: (product) => {
        const { items, isInWishlist } = get()
        if (isInWishlist(product._id)) {
          set({ items: items.filter((p) => p._id !== product._id) })
          wishlistApi.remove(product._id).catch(() => null)
          toast.success('Removed from wishlist')
        } else {
          set({ items: [...items, product] })
          wishlistApi.add(product._id).catch(() => null)
          toast.success('Added to wishlist')
        }
      },

      syncFromServer: async () => {
        try {
          const { data } = await wishlistApi.get()
          set({ items: data.data.map((w) => w.product) })
        } catch { /* silent */ }
      },

      clearLocal: () => set({ items: [] }),
    }),
    { name: 'wishlist-storage' },
  ),
)
