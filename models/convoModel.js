import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

const Conversation = model('Conversation', conversationSchema);

export default Conversation;
