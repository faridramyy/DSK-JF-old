import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const courseFileSchema = new Schema({
  filePath: {
    type: String,
    require: true,
  },
});

const courseFile = model("courseFile", courseFileSchema);
export default courseFile;
