import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useRegister } from '@/features/auth/hooks/useAuth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function RegisterPage() {
  const { register, isLoading } = useRegister()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    await register(form)
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-start justify-center bg-[#f1f3f6]">
      <div className="flex w-full max-w-3xl min-h-[500px] shadow-md overflow-hidden rounded-sm mt-0 sm:mt-16">
        {/* Left blue panel */}
        <div className="hidden sm:flex flex-col justify-between bg-[#2874f0] text-white p-10 w-[42%]">
          <div>
            <h1 className="text-2xl font-semibold leading-tight mb-4">
              Create Account
            </h1>
            <p className="text-[#c5d8ff] text-sm leading-6">
              Sign up to enjoy exclusive deals, track your orders and more.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex-1 bg-white p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm w-full mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 sm:hidden">Create Account</h2>

            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password (min 6 chars)"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-5">
              By continuing, you agree to EcomBuzz's{' '}
              <span className="text-[#2874f0] cursor-pointer">Terms of Use</span> and{' '}
              <span className="text-[#2874f0] cursor-pointer">Privacy Policy</span>.
            </p>

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full rounded">
              Create Account
            </Button>

            <Link
              to="/login"
              className="text-center text-sm text-[#2874f0] font-medium hover:underline"
            >
              Already have an account? Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
