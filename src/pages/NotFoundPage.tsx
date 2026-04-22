import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-8xl font-bold text-[#2874f0]">404</p>
      <h1 className="text-2xl font-semibold text-gray-800">Page Not Found</h1>
      <p className="text-gray-500 text-sm max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button size="lg">Go to Homepage</Button>
      </Link>
    </div>
  )
}
