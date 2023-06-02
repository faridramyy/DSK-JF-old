import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const courseLinkSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  link: {
    type: String,
    require: true,
  },
});

const courseLink = model("courseLink", courseLinkSchema);
export default courseLink;
