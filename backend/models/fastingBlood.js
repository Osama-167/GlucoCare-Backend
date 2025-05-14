import mongoose from 'mongoose'

const fastingBloodSchema = mongoose.Schema({
  user: { type: String, required: true },
  value: { type: String, required: true },
  date: {
    type: Date,
    default: new Date(),
  },
})

export default mongoose.model('FastingBlood', fastingBloodSchema)
