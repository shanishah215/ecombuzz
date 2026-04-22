import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IOrderItem {
  product: Types.ObjectId
  name: string
  image: string
  price: number
  quantity: number
}

export interface IAddress {
  fullName: string
  phone: string
  pincode: string
  street: string
  city: string
  state: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface IOrder extends Document {
  user: Types.ObjectId
  items: IOrderItem[]
  shippingAddress: IAddress
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  status: OrderStatus
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      pincode: String,
      street: String,
      city: String,
      state: String,
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { timestamps: true },
)

export const Order = mongoose.model<IOrder>('Order', orderSchema)
