import { Server } from 'socket.io';
import Message from './models/Message.js';
import ProjectMessage from './models/ProjectMessage.js';

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    transports: ['websocket'],
    cors: {
      origin: ["http://localhost:5173","https://freelancerprojecthub.vercel.app/"],
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] ✅ A user connected via WebSocket. Total clients: ${io.sockets.sockets.size}`);

    socket.on('authenticate', (userId) => {
        socket.join(userId);
        console.log(`[Socket] User ${userId} authenticated and joined their private room.`);
    });
    
    socket.on('joinProjectRoom', (projectId) => {
      socket.join(projectId);
      console.log(`[Socket] Socket ${socket.id} joined project room ${projectId}`);
    });

    socket.on('leaveProjectRoom', (projectId) => {
      socket.leave(projectId);
      console.log(`[Socket] Socket ${socket.id} left project room ${projectId}`);
    });

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`[Socket] Socket ${socket.id} joined conversation room ${conversationId}`);
    });

    socket.on('sendMessage', async ({ projectId, message }) => {
      try {
        const newProjectMessage = new ProjectMessage({
          project: projectId,
          sender: message.sender._id,
          content: message.text,
        });
        await newProjectMessage.save();

        const populatedMessage = {
          ...newProjectMessage.toObject(),
          sender: { _id: message.sender._id, name: message.sender.name }
        };

        io.to(projectId).emit('receiveMessage', populatedMessage);
        console.log(`[Socket] Project message saved and broadcasted to room ${projectId}`);
      } catch (error) {
        console.error('[Socket] Error saving project message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] ❌ User disconnected. Total clients: ${io.sockets.sockets.size}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

