import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const courseProjectSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      default: "",
    },
    numberOfStudentsPerTeam: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: String,
      require: true,
    },
    numberOfPhases: {
      type: Number,
      default: 1,
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  },
  { timestamps: true }
);

const courseProject = model("courseProject", courseProjectSchema);
export default courseProject;
