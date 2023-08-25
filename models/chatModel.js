import mongoose from "mongoose";
const objectId = mongoose.Schema.Types.ObjectId

const puSchema = new mongoose.Schema({

     
    users : [String],
    description: "",
    lastMsg: {type: String, trim: true}


}, {timestamps: true}) 
export default mongoose.model("Chats", puSchema)