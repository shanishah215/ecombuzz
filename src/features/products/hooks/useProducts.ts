import { useState, useEffect, useCallback } from 'react'
import { productsApi } from '@/api/products'
import type { Product, ProductFilters, PaginatedProducts } from '@/types'
import { getErrorMessage } from '@/lib/utils'

export function useProducts(initialFilters: ProductFilters = {}) {
  const [data, setData] = useState<PaginatedProducts | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)

  const fetch = useCallback(async (f: ProductFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await productsApi.getAll(f)
      setData(res.data.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetch(filters) }, [filters, fetch])

  return { data, isLoading, error, filters, setFilters }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)
    productsApi
      .getBySlug(slug)
      .then((res) => setProduct(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [slug])

  return { product, isLoading, error }
}
