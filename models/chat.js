import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    employeeId: {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Employee'
    },
    latestMessage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Message'
    }
},
{
    timestamps : true
}
)

const Chat = mongoose.model('Chat',chatSchema)
export default  Chat ;