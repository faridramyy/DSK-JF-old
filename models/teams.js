import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const TeamSchema = new Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    numberOfStudents: {
      type: Number,
      default: 0,
    },
    
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
    students: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);

const Team = model("Team", TeamSchema);
export default Team;
