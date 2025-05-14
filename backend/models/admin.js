import mongoose from 'mongoose'

const docSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  birthday: { type: String, required: true },
})

export default mongoose.model('Admin', docSchema)
