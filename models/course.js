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
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  coverPic: {
    type: String,
    default: "/img/defaultCover.jpg",
  },
  assignedProject: {
    type: Boolean,
    default: false,
  },
});

const course = model("Course", CourseSchema);
export default course;
