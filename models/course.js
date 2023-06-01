import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const CourseSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
    default: 0,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  numberOfStudents: {
    type: Number,
    default: 0,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  availableForUsers:{
    type: Boolean,
    default: false,
  },
  student: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  coverPic: {
    type: String,
    default: "/img/defaultCover.jpg",
  },
});

const course = model("Course", CourseSchema);
export default course;
