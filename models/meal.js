import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  user: { type: String, required: true },             
  type: { type: String, required: true },              
  message: { type: String, required: true },           
  date: { type: Date, default: Date.now }              
});

export default mongoose.model('Meal', mealSchema);
