import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user_id is required"],
  },
  title: {
    type: String,
    reqiuired: [true, "title is required"],
  },
});

export default mongoose.model("Chat", chatSchema);
