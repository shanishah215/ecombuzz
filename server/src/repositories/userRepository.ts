import { User, type IUser } from '@/models/User'

export class UserRepository {
  findById(id: string) {
    return User.findById(id)
  }

  findByEmail(email: string) {
    return User.findOne({ email }).select('+password')
  }

  create(data: Pick<IUser, 'name' | 'email' | 'password'>) {
    return User.create(data)
  }

  findAll(page = 1, limit = 20) {
    return User.find()
      .select('-__v')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
  }

  countAll() {
    return User.countDocuments()
  }
}
