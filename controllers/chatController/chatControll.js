
import mongoose from "mongoose";

import Chat from "../../models/chat.js";
import Employee from "../../models/employee.js";
import Orders from "../../models/order.js";
import Users from "../../models/user.js";
import Message from "../../models/message.js";

export const chats = {
    createChat: async (req, res) => {
        try {
            const { id, senderRole } = req.body;
            if (!id) {
                return res.status(400).send('Bad Request');
            }
            let userId;
            let employeeId;
    
            if(senderRole === 'employee'){
                const data = await Orders.findOne({_id: id},{userId: 1 })
                userId =  data.userId
                employeeId = new mongoose.Types.ObjectId(req.employee.employeeId)
            }
            if(senderRole === 'user'){
              const data = await Users.findOne({_id: id},{_id : 1})
              employeeId = data._id
              userId = new mongoose.Types.ObjectId(req.user.userId)
            } 
            const findQuery = {
                employeeId: employeeId,
                userId: userId
            };
            const isChat = await Chat.findOne(findQuery);
            if (isChat) {
                res.sendStatus(200);
            } else {
                const chatData = {
                   employeeId: employeeId,
                   userId: userId
                };
                await Chat.create(chatData);
                res.sendStatus(200);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    fetchChats: async(req,res)=>{
        try {
            // console.log(req.baseUrl.startsWith('/employee'));
            let senderId, senderRole
            if(req.baseUrl.startsWith('/employee')){
                 senderId = new mongoose.Types.ObjectId(req.employee.employeeId)
                 senderRole = "employeeId"
            }else{
                 senderId = new mongoose.Types.ObjectId(req.user.userId)
                 senderRole = "userId"
            }
            const chats = await Chat
                .find({[senderRole]: senderId })
                .populate({ path: 'employeeId', select: 'Name Image Email' })
                .populate({ path: 'userId', select: 'Name Email' })
                .populate({ path: 'latestMessage', populate: { path: 'senderId', select: 'name image email' } })
                .sort({ updatedAt: -1 });
            res.status(200).json({chats})
            // console.log(chats);
        } catch (error) {
            console.log(error);
            return res.status(500)
        }
    },

    sendMessage: async (messages) => { 
        try {
            const newMessage = {
                senderId: new mongoose.Types.ObjectId(messages.senderId._id),
                content: messages.content,
                chat: new mongoose.Types.ObjectId(messages.chatId),
                senderType: messages.role
            }
            let message = await Message.create(newMessage);
            await Chat.findByIdAndUpdate(messages.chatId, {
                latestMessage: message
            })
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
 
    // sendMessage: async(req,res)=>{
    //     try {
    //         const {newMessageData} = req.body
    //         const newMessage = {
    //             senderId: new mongoose.Types.ObjectId(newMessageData.senderId._id),
    //             content: newMessageData.content,
    //             chat: new mongoose.Types.ObjectId(newMessageData.chatId),
    //             senderType: newMessageData.role
    //         }
    //         let message = await Message.create(newMessage);
    //         res.send({message})
    //         console.log(message);
    //     } catch (error) {
    //         console.log(error);
            
    //     }
    // },

    allMessages: async(req,res)=>{
        try {
          const messages = await Message.find({chat : req.query.chatId})
            .populate("senderId","Name Image Email")
            .populate("chat")
             res.status(200).json({result:messages})
            //  console.log(messages);
        } catch (error) {
            console.log(error);
            return res.status(500)
        }
    }
}