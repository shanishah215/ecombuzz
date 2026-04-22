import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function calculateDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100)
}

export function truncate(text: string, length: number): string {
  return text.length > length ? `${text.slice(0, length)}...` : text
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    return axiosError.response?.data?.message ?? 'Something went wrong'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}
