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
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    birthdayDate: {
      type: String,
      default: "2003-12-22",
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
    facebook: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
export default User;
