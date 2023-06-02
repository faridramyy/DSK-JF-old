import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const MaterialSchema = new Schema({
  title: {
    type: String,
  },
  type: {
    type: String,
    default: 0,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  availableForUsers: {
    type: Boolean,
    default: false,
  },
  material: {
    type: String,
    default: 0,
  },
});

const Material = model("Material", MaterialSchema);
export default Material;
