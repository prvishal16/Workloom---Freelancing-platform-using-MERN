import React, {useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { getProjectMessages } from '../services/api';
import { toast } from 'react-toastify';
import { Send, X } from 'lucide-react';

const ProjectChat = ({ project, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const projectId = project._id;

  useEffect(() => {
    if (!isOpen || !projectId) return;

    socket.emit('joinProjectRoom', projectId);

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const history = await getProjectMessages(projectId);
        setMessages(history);
      } catch (error) {
        toast.error("Failed to load chat history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();

    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };
    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
      socket.emit('leaveProjectRoom', projectId);
    };
  }, [isOpen, projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    const messageData = {
      text: newMessage,
      sender: { _id: user._id, name: user.name },
    };
    
    socket.emit('sendMessage', { projectId, message: messageData });
    setNewMessage('');
  };

  const otherParticipant = user._id === project.client._id ? project.freelancer : project.client;
  if (!otherParticipant) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 md:bottom-10 md:right-10 w-[calc(100%-2rem)] max-w-md h-[60vh] bg-white rounded-xl shadow-2xl flex flex-col z-50"
        >
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
            <Link to={`/profile/${otherParticipant._id}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center font-bold text-blue-600">
                {otherParticipant.name.charAt(0)}
              </div>
              <h2 className="font-bold text-lg">{otherParticipant.name}</h2>
            </Link>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
            {loading ? <p>Loading history...</p> : messages.map((msg) => (
                <div key={msg._id || new Date(msg.createdAt).getTime()} className={`flex mb-2 ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg px-3 py-2 max-w-xs relative ${msg.sender._id === user._id ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                        <p className="pr-12" style={{wordBreak: 'break-word'}}>{msg.content}</p>
                        <span className="text-xs absolute bottom-1.5 right-2 opacity-75">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white rounded-b-xl">
            <div className="flex items-center gap-2">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700">
                <Send size={20} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectChat;