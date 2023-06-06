import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const ChatSchema = new Schema({
  msg: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Chat = model("Chat", ChatSchema);
export default Chat;