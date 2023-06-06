import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
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
    password: {
      type: String,
      required: true,
    },
    birthdayDate: {
      type: String,
      default: "2003-12-22",
    },
    phoneNumber: {
      type: String,
      default: "1234567890",
    },
    gpa: {
      type: Number,
      default: null,
    },
    profilePic: {
      type: String,
      default: "/img/default/defaultPP.png",
    },
    verifyEmail: {
      type: Boolean,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: 0,
    },
    code: {
      type: String,
    },
    courses: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Course",
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

const user = model("user", userSchema);
export default user;
