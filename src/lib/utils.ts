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
  if (!Number.isFinite(original) || !Number.isFinite(current) || original <= 0) {
    return 0
  }
  const discount = ((original - current) / original) * 100
  return Math.round(discount)
}

export function truncate(text: string, length: number): string {
  if (length <= 0) return ''
  return text.length > length ? `${text.slice(0, length)}...` : text
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const maybeResponse = error as { response?: { data?: { message?: string } }; message?: string }
    const message = maybeResponse.response?.data?.message ?? maybeResponse.message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }
  if (error instanceof Error && error.message.trim()) return error.message
  return 'Something went wrong'
}
