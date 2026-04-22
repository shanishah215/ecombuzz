import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { addressApi, ordersApi } from '@/api/orders'
import { useCartStore } from '@/features/cart/store/cartStore'
import { formatPrice, getErrorMessage } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
import type { Address } from '@/types'

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'online', label: 'Online Payment (Mock)' },
]

const emptyAddress = { fullName: '', phone: '', pincode: '', street: '', city: '', state: '' }

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCartStore()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState(emptyAddress)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    if (items.length === 0) navigate('/cart')
    addressApi.get().then(({ data }) => {
      setAddresses(data.data)
      const def = data.data.find((a) => a.isDefault)
      if (def?._id) setSelectedAddress(def._id)
      else if (data.data[0]?._id) setSelectedAddress(data.data[0]._id)
    })
  }, [])

  async function saveAddress() {
    try {
      const { data } = await addressApi.add({ ...newAddress })
      setAddresses((prev) => [...prev, data.data])
      setSelectedAddress(data.data._id ?? '')
      setShowNewAddress(false)
      setNewAddress(emptyAddress)
      toast.success('Address saved')
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  async function placeOrder() {
    if (!selectedAddress) return toast.error('Please select a delivery address')
    setPlacing(true)
    try {
      const { data } = await ordersApi.create({ addressId: selectedAddress, paymentMethod })
      await clearCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${data.data._id}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setPlacing(false)
    }
  }

  const shippingCharge = total >= 500 ? 0 : 40
  const grandTotal = total + shippingCharge

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Address + Payment */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Delivery Address */}
          <section className="bg-white rounded-sm shadow-sm p-5">
            <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
              Delivery Address
            </h2>
            <div className="flex flex-col gap-3">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 border rounded p-3 cursor-pointer transition ${
                    selectedAddress === addr._id ? 'border-[#2874f0] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1 accent-[#2874f0]"
                    checked={selectedAddress === addr._id}
                    onChange={() => setSelectedAddress(addr._id ?? '')}
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{addr.fullName}</p>
                    <p className="text-gray-500">{addr.street}, {addr.city}, {addr.state} — {addr.pincode}</p>
                    <p className="text-gray-500">Phone: {addr.phone}</p>
                    {addr.isDefault && <span className="text-xs text-[#2874f0] font-medium">Default</span>}
                  </div>
                </label>
              ))}

              {/* New address form */}
              {showNewAddress ? (
                <div className="border border-dashed border-[#2874f0] rounded p-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress((a) => ({ ...a, fullName: e.target.value }))} />
                    <Input label="Phone" value={newAddress.phone} onChange={(e) => setNewAddress((a) => ({ ...a, phone: e.target.value }))} />
                  </div>
                  <Input label="Street / Area" value={newAddress.street} onChange={(e) => setNewAddress((a) => ({ ...a, street: e.target.value }))} />
                  <div className="grid grid-cols-3 gap-3">
                    <Input label="City" value={newAddress.city} onChange={(e) => setNewAddress((a) => ({ ...a, city: e.target.value }))} />
                    <Input label="State" value={newAddress.state} onChange={(e) => setNewAddress((a) => ({ ...a, state: e.target.value }))} />
                    <Input label="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress((a) => ({ ...a, pincode: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveAddress}>Save Address</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowNewAddress(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewAddress(true)}
                  className="flex items-center gap-2 text-sm text-[#2874f0] hover:underline"
                >
                  <PlusCircle size={16} /> Add a new address
                </button>
              )}
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white rounded-sm shadow-sm p-5">
            <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
              Payment Method
            </h2>
            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex items-center gap-3 border rounded p-3 cursor-pointer transition ${
                    paymentMethod === m.value ? 'border-[#2874f0] bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="accent-[#2874f0]"
                    checked={paymentMethod === m.value}
                    onChange={() => setPaymentMethod(m.value)}
                  />
                  <span className="text-sm text-gray-800">{m.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Order summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-sm shadow-sm p-5 sticky top-20">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Order Summary</h2>
            <div className="flex flex-col gap-2 text-sm max-h-48 overflow-y-auto mb-3">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="flex justify-between text-gray-600">
                  <span className="line-clamp-1 flex-1 mr-2">{product.name} × {quantity}</span>
                  <span className="shrink-0">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="flex flex-col gap-2 text-sm mt-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className={shippingCharge === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingCharge === 0 ? 'FREE' : formatPrice(shippingCharge)}
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <Button
              onClick={placeOrder}
              isLoading={placing}
              size="lg"
              variant="secondary"
              className="w-full mt-5"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
