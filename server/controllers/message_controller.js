const Conversation = require('../models/conversation_model.js');
const Message = require('../models/message_model.js');
const { getReceiverSocketId, io } = require("../socket/socket.js");

// Controller to send a message
const sendMessage = async (req, res) => {
    const { messages } = req.body; // Messages to send
    const { id: receiverId } = req.params; // Receiver's user ID
    const senderId = req.user._id;  // Access sender's user ID from req.user

    try {
        // Check if a conversation already exists between sender and receiver
        let chats = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // If no conversation exists, create a new one
        if (!chats) {
            chats = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create a new message document
        const newMessage = new Message({
            senderId,
            receiverId,
            message: messages,
            conversationId: chats._id,
        });

        // Push the new message ID to the conversation
        if (newMessage) {
            chats.messages.push(newMessage._id);
        }

        // Save both the conversation and the new message
        await Promise.all([chats.save(), newMessage.save()]);

        // Emit the new message to the receiver via socket.io if they're online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Respond with success
        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while sending the message.",
        });
    }
};

// Controller to get messages from a conversation
const getMessages = async (req, res) => {
    const { id: receiverId } = req.params; // Receiver's user ID
    const senderId = req.user._id;  // Access sender's user ID from req.user

    try {
        // Find the conversation between sender and receiver, populating the messages
        const chats = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages"); // Populating the messages array

        // If no conversation is found, return an empty array
        if (!chats) {
            return res.status(200).json([]);
        }

        const messages = chats.messages; // Get all the messages from the conversation
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while fetching the messages.",
        });
    }
};

// Controller to fetch all conversations for the authenticated user
const getConversations = async (req, res) => {
    const userId = req.user._id;  // Access the user's ID

    try {
        // Find all conversations where the user is a participant
        const conversations = await Conversation.find({
            participants: { $in: [userId] },
        }).populate("messages");

        res.status(200).json(conversations); // Respond with the conversations
    } catch (error) {
        console.error("Error in getConversations:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while fetching the conversations.",
        });
    }
};

// Controller to create a new conversation between users
const createConversation = async (req, res) => {
    const { participants } = req.body;  // Expecting an array of participant user IDs

    try {
        // Create a new conversation
        const newConversation = new Conversation({
            participants,
        });

        // Save the new conversation
        await newConversation.save();
        res.status(201).json({ success: true, conversation: newConversation });
    } catch (error) {
        console.error("Error in createConversation:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating the conversation.",
        });
    }
};

// Export all controller functions
module.exports = { 
    sendMessage, 
    getMessages, 
    getConversations, 
    createConversation 
};
