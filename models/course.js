import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const CourseSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    default: "",
  },
  numberOfStudents: {
    type: Number,
    default: 0,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  availableForUsers: {
    type: Boolean,
    default: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  coverPic: {
    type: String,
    default: "/img/default/defaultCover.jpg",
  },
  links: [
    { type: mongoose.Schema.Types.ObjectId, default: [], ref: "courseLink" },
  ],
  files: [
    { type: mongoose.Schema.Types.ObjectId, default: [], ref: "courseFile" },
  ],
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "courseSubmission",
    },
  ],
  projects: [
    { type: mongoose.Schema.Types.ObjectId, default: [], ref: "courseProject" },
  ],
});

const course = model("Course", CourseSchema);
export default course;
