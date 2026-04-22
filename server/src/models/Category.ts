import mongoose, { Document, Schema } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
)

export const Category = mongoose.model<ICategory>('Category', categorySchema)
