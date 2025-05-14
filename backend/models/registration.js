import mongoose from "mongoose";
const registrationSchema = new mongoose.Schema({
    user: { type: String, required: true },
    doctor: { type: String, required: true },
    status: { type: String, required: true },
    registeredAt: { type: Date, required: true }
});

export default mongoose.model('registration', registrationSchema);
