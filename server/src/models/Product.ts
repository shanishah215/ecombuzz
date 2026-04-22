import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  price: number
  originalPrice: number
  discount: number
  images: string[]
  category: string
  brand: string
  stock: number
  rating: number
  reviewCount: number
  tags: string[]
  isActive: boolean
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    images: [{ type: String }],
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    tags: [String],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
)

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' })

export const Product = mongoose.model<IProduct>('Product', productSchema)
