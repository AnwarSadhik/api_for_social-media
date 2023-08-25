import chatModel from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import msgModel from '../models/msgModel.js';
import initializeSocketIO from '../utils/socket.js';

export const sendMessage = async (req, res) => {
  const { conversationId, receiver, content } = req.body;
  const sender = req.user;

  try {
    const message = new Message({ conversationId, sender, receiver, content });
    await message.save();

    const data = {
      conversationId,
      sender,
      content,
    };
    req.app.io.to(conversationId).emit('message', data);

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while sending the message' });
  }
};

export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.deleted = true;
    await message.save();

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the message' });
  }
};

export const createNewChat = async(req, res)=>{
  try {
    let {to, description=""} = req.body

    let chat = await chatModel.create({users: [req.user._id, to], description})
    return res.status(201).send({status: true, data: data})

  }
  catch(err){
    return res.status(400).send({status: false, msg: err.message})

  }

}

export const getAllChatById = async(req, res)=> {
  try {
    let {chatId} = req.params
    let chats = await msgModel.find({chatId})
    if(!chats){
      return res.status(400).send({status: false, msg: "chat id not found"})
    }
    return res.status(200).send({status: true, data: chats})

  }
  catch(err){
    return res.status(400).send({status: false, msg: err.message})

  }
};

export const getChats = async(req, res)=> {
  try {
    let {id} = req.params
    let chats = await chatModel.find({users: id})
    return res.status(200).send({status: true, data: chats})

  }
  catch(err){
    return res.status(400).send({status: false, msg: err.message})

  }
}


const socketIOHandler = initializeSocketIO();
export const setupSocketIO = (server) => {
  const io = socketIOHandler(server);
  server.app.io = io; 
};
