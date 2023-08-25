import express from 'express';
import * as msg from "../controllers/message.js"
import { checkAuth } from "../middlewares/userAuth.js";

const router = express.Router();

router.post('/',msg.sendMessage);

router.delete("/:messageId",msg.deleteMessage)

router.post('/new-chat', msg.createNewChat)

router.get('/chats', msg.getChats)

router.get('/get-chat/:chatId', msg.getAllChatById)



export { router as messagesRoutes }