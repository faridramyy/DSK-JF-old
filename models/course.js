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
    tcype: String,
  },
  numberOfStudents: {
    type: Number,
    default: 0,
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
