import { Address } from '@/models/Address'
import { AppError } from '@/middleware/errorHandler'

export const addressService = {
  async getAll(userId: string) {
    return Address.find({ user: userId }).lean()
  },

  async create(userId: string, data: Record<string, unknown>) {
    // If this is marked default, unset others first
    if (data.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false })
    }
    return Address.create({ ...data, user: userId })
  },

  async update(userId: string, addressId: string, data: Record<string, unknown>) {
    if (data.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false })
    }
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      data,
      { new: true },
    )
    if (!address) throw new AppError('Address not found', 404)
    return address
  },

  async delete(userId: string, addressId: string) {
    const address = await Address.findOneAndDelete({ _id: addressId, user: userId })
    if (!address) throw new AppError('Address not found', 404)
  },
}
