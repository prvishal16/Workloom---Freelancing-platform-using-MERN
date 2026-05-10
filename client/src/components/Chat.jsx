import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { getMessages } from '../services/api'; 
import { toast } from 'react-toastify';

const Chat = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getMessages(projectId);
        setMessages(history);
      } catch (error) {
        toast.error("Failed to load chat history.");
        console.error(error);
      }
    };
    fetchHistory();
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      text: newMessage,
      sender: {
        _id: user._id,
        name: user.name,
      },
    };

    socket.emit('sendMessage', { projectId, message: messageData });
        setNewMessage('');
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Project Chat</h2>
      <div className="bg-white p-4 rounded-lg shadow h-96 flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg._id || new Date(msg.createdAt).getTime()} 
              className={`flex mb-3 ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                  msg.sender._id === user._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="font-bold text-sm">{msg.sender.name}</p>
                <p style={{ wordBreak: 'break-word' }}>{msg.content || msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;