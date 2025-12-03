import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  sender: {
    type: String, // "admin" veya "user" gibi rol bilgisi
    required: true,
  },
  userName: {
    type: String, // Kullanıcının adı
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

export default ChatMessage;