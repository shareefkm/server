import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderType:{
        type: String,
        enum: ["Employee","Users"],
        required: true
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "senderType"
    },
    content :{
        type : String ,
        trim :true
    },
    chat :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Chat'
    },
    is_read :{
        type : Boolean,
        default : false
    }
},
{
    timestamps : true
}
)

const Message = mongoose.model('Message',messageSchema)
export default Message;