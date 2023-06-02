import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
      default: 0,
    },
    CourseId: {
      type: mongoose.Schema.Types.ObjectId,
      unique:true,
    },
    numberOfStudentsPerTeam: {
      type: Number,
      default: 0,
    },
    
    teamLeader: {
      type: String,
      default: "",
    },
    coverPic: {
      type: String,
      default: "/img/defaultCover.jpg",
    },
    deadline: {
      type: Date,
      require: true,
    },
    noOfPhases: {
      type: Number,
      default: 1,
    },
    requirementsFile: {
      type: String,
      default:"aaa"
      // required: true,
    },
  },
  { timestamps: true }
);

const Project = model("Project", ProjectSchema);
export default Project;
