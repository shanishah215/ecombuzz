import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  count?: number
  size?: number
  className?: string
}

export default function RatingStars({ rating, count, size = 12, className }: RatingStarsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span
        className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded"
        style={{ fontSize: size }}
      >
        {rating.toFixed(1)}
        <Star size={size - 1} fill="currentColor" />
      </span>
      {count !== undefined && (
        <span className="text-gray-400" style={{ fontSize: size }}>
          {count.toLocaleString('en-IN')} ratings
        </span>
      )}
    </div>
  )
}
