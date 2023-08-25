import mongoose from "mongoose";
const objectId = mongoose.Schema.Types.ObjectId

const msgSchema = new mongoose.Schema({

    
    user : String,
    chatId : {type: mongoose.Schema.Types.ObjectId, ref: "Chats"},
    message: {type: String, trim: true},
    seen: {type: Boolean, default: "false"}
    
 
}, {timestamps: true}) 
export default mongoose.model('msg',msgSchema);