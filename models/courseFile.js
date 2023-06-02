import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const courseFileSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  filePath: {
    type: String,
    require: true,
  },
});

const courseFile = model("courseFile", courseFileSchema);
export default courseFile;
