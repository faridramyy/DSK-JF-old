import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const projectTeamSchema = new Schema({
  students: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  
  teamLeader: {
    type: mongoose.Schema.Types.ObjectId,
    default: 0,
  },
});

const projectTeam = model("projectTeam", projectTeamSchema);
export default projectTeam;
