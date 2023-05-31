import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
      default: "0123456789",
    },
    password: {
      type: String,
      required: true,
    },
    gpa: {
      type: Number,
      default: null,
    },
    profilePic: {
      type: String,
      default: "/img/defaultPP.png",
    },
    verifyEmail: {
      type: Boolean,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: 0,
    },
    courses: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
export default User;
