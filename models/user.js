import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
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
    default: "/img/avatar.jpg",
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
});

const User = model("User", UserSchema);
export default User;
