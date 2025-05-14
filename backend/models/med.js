import mongoose from 'mongoose'

const medSchema = mongoose.Schema({
  user: { type: String, required: true },
  medName: { type: String, required: true },
  effMaterial: { type: String, required: true },
  times_per_day: { type: Number, required: true },
  dose_time: { type: [String], required: true },
  //dose_time: { type: Date, required: true },
  type: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
})

export default mongoose.model('Med', medSchema)
