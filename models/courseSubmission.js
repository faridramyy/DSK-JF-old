import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const courseSubmissionSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  feadBack: {
    type: String,
    default:""
  },
  deadline: {
    type: String,
  },
});

const courseSubmission = model("courseSubmission", courseSubmissionSchema);
export default courseSubmission;
