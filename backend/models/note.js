import mongoose from "mongoose";
const noteSchema = new mongoose.Schema({
  doctor: { type: String, required: true }, 
  user: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true }, 
  createdAt: { type: Date, required: true } 
});

export default mongoose.model('Note', noteSchema);
