import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: Number,
    required: true,
  },
});

const Otp = model("Otp", otpSchema);
export default Otp;
