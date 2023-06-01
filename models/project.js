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
    },
    numberOfStudentsPerTeam: {
      type: Number,
      default: 0,
    },
    availableForUsers: {
      type: Boolean,
      default: false,
    },
    teamLeader: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    coverPic: {
      type: String,
      default: "/img/defaultCover.jpg",
    },
    deadline: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true }
);

const Project = model("Project", ProjectSchema);
export default Project;
