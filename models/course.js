import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const CourseSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    default: 0,
  },
  numberOfStudents: {
    type: Number,
    default: 0,
  },
});

const course = model("Courses", CourseSchema);
export default course;
