import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  gpa: {
    type: Number,
    default: null,
  },
  // profilePic: {
  //   type: file,
  //   default: null,
  // },
  // courses: {
  //   type: [];
  //   default: null,
  // },
});

const User = model("User", UserSchema);
export default User;
