import Conversation from '../models/Conversation.js';
import DirectMessage from '../models/DirectMessage.js';
import { getIO } from '../socket.js';

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name profilePictureUrl')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    console.error("Get conversations error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMessagesForConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.some(p => p.equals(userId))) {
            return res.status(403).json({ error: 'Forbidden: You are not a participant in this conversation.' });
        }

        const messages = await DirectMessage.find({ conversationId })
            .populate('sender', 'name')
            .sort({ createdAt: 'asc' });

        res.json(messages);

    } catch (err) {
        console.error("Get messages error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const startConversation = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const senderId = req.user._id;

        if (!recipientId) {
            return res.status(400).json({ error: 'Recipient ID is required.' });
        }

        if (senderId.equals(recipientId)) {
            return res.status(400).json({ error: 'You cannot start a conversation with yourself.' });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (conversation) {
            return res.status(200).json(conversation);
        }

        conversation = new Conversation({
            participants: [senderId, recipientId],
        });

        await conversation.save();
        res.status(201).json(conversation);

    } catch (err) {
        console.error("Start conversation error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        const senderId = req.user._id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.some(p => p.equals(senderId))) {
            return res.status(403).json({ error: 'Forbidden: You are not a participant.' });
        }

        const message = new DirectMessage({ conversationId, sender: senderId, content });
        await message.save();

        conversation.updatedAt = Date.now();
        await conversation.save();

        const populatedMessage = await DirectMessage.findById(message._id).populate('sender', 'name profilePictureUrl');
        
        const io = getIO();
        io.to(conversationId).emit('newDirectMessage', populatedMessage);
        
        const recipient = conversation.participants.find(p => !p.equals(senderId));
        if (recipient) {
            io.to(recipient.toString()).emit('newMessageNotification');
        }
        res.status(201).json(populatedMessage);
    } catch (err) {
        console.error("Send message error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};