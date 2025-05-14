import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    user: { type: String, required: true },
  mealName: { type: String, required: true },
  type: { type: String, required: true },
  date: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model('meal', mealSchema);
