import { useState, useEffect } from 'react'
import { productsApi } from '@/api/products'
import type { Product, ProductFilters, PaginatedProducts } from '@/types'
import { getErrorMessage } from '@/lib/utils'

export function useProducts(filters: ProductFilters = {}) {
  const [data, setData] = useState<PaginatedProducts | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { category, brand, minPrice, maxPrice, rating, search, sort, page, limit } = filters

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    productsApi
      .getAll({ category, brand, minPrice, maxPrice, rating, search, sort, page, limit })
      .then((res) => { if (!cancelled) setData(res.data.data) })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [category, brand, minPrice, maxPrice, rating, search, sort, page, limit])

  return { data, isLoading, error }
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

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    productsApi
      .getCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return { categories, isLoading }
}
