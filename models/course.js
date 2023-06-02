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
  },
  availableForUsers: {
    type: Boolean,
    default: false,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId }],
  coverPic: {
    type: String,
    default: "/img/default/defaultCover.jpg",
  },
  links: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  files: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  submissions: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
});

const course = model("Course", CourseSchema);
export default course;
