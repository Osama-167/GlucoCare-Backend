import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rePassword: { type: String, required: true },
  gender: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  weight: { type: Number, required: true },
  diabetesType: { type: Number, required: true },
  birthday: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
