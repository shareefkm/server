// const jobModel = require('../models/jobModel');
// const chatModel = require('../models/chatModel')
// const user = require('../models/userModel')
// const messageModel = require('../models/messageModel');
import mongoose from "mongoose";

import user from "../../models/user.js";
import Chat from "../../models/chat.js";
import message from "../../models/message.js";
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
            const employeeId = new mongoose.Types.ObjectId(req.employee.employeeId)
            //// const userRole = req.payload.role === 'Employee' ? "employeeId" : "employerId"
            const chats = await Chat
                .find({employeeId: employeeId })
                .populate({ path: 'employeeId', select: 'Name Image Email' })
                .populate({ path: 'userId', select: 'Name Email' })
                .populate({ path: 'latestMessage', populate: { path: 'senderId', select: 'name image email' } })
                .sort({ updatedAt: -1 });
            res.status(200).json({chats})
            console.log(chats);
        } catch (error) {
            console.log(error);
            return res.status(500)
        }
    },

    // sendMessage: async (Message) => {
    //     console.log(Message);
    //     try {
    //         const newMessage = {
    //             senderId: new mongoose.Types.ObjectId(Message.senderId._id),
    //             content: Message.content,
    //             chat: new mongoose.Types.ObjectId(Message.chatId),
    //             senderType: Message.role
    //         }
    //         let message = await messageModel.create(newMessage);
    //         await chatModel.findByIdAndUpdate(Message.chatId, {
    //             latestMessage: message
    //         })
    //         return true;
    //     } catch (error) {
    //         console.error(error);
    //         return false;
    //     }
    // },
 
    sendMessage: async(req,res)=>{
        try {
            const {newMessageData} = req.body
            const newMessage = {
                senderId: new mongoose.Types.ObjectId(newMessageData.senderId._id),
                content: newMessageData.content,
                chat: new mongoose.Types.ObjectId(newMessageData.chatId),
                senderType: newMessageData.role
            }
            let message = await Message.create(newMessage);
            res.send({message})
            console.log(message);
        } catch (error) {
            console.log(error);
            
        }
    },

    allMessages: async(req,res)=>{
        try {
            console.log("quie", req.query.chatId);
          const messages = await Message.find({chat : req.query.chatId})
            .populate("senderId","name image email")
            .populate("chat")
             res.status(200).json({result:messages})
             console.log(messages);
        } catch (error) {
            console.log(error);
            return res.status(500)
        }
    }
}