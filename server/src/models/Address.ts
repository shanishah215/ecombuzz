import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IAddress extends Document {
  user: Types.ObjectId
  fullName: string
  phone: string
  pincode: string
  street: string
  city: string
  state: string
  isDefault: boolean
}

const addressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Address = mongoose.model<IAddress>('Address', addressSchema)
