import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { socket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { getMessagesForConversation, sendDirectMessage } from '../services/api';
import { toast } from 'react-toastify';
import { Send, ArrowLeft } from 'lucide-react';

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const conversationId = conversation._id;
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!conversationId) return;
    
    socket.emit('joinConversation', conversationId);

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const history = await getMessagesForConversation(conversationId);
        setMessages(history);
      } catch (error) {
        toast.error("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    
    const handleNewMessage = (message) => {
        if (message.conversationId === conversationId) {
            setMessages(prev => [...prev, message]);
        }
    };
    socket.on('newDirectMessage', handleNewMessage);

    return () => {
      socket.off('newDirectMessage', handleNewMessage);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await sendDirectMessage(conversationId, newMessage);
      setNewMessage('');
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };
  
  const otherParticipant = conversation.participants.find(p => p._id !== user._id);
  if (loading) return <div className="flex items-center justify-center h-full"><p>Loading messages...</p></div>;

  return (
    <div className="flex flex-col h-full">
        <div className="p-3 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
            <button onClick={() => navigate('/messages')} className="p-2 rounded-full hover:bg-gray-200 md:hidden">
                <ArrowLeft size={20} />
            </button>
            <Link to={`/profile/${otherParticipant._id}`} className="flex items-center gap-3 hover:bg-gray-200 p-2 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center font-bold text-blue-600">
                    {otherParticipant.name.charAt(0)}
                </div>
                <h2 className="font-bold text-lg">{otherParticipant.name}</h2>
            </Link>
        </div>

        <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
            {messages.map(msg => (
                <div key={msg._id} className={`flex mb-2 ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg px-3 py-2 max-w-lg relative ${msg.sender._id === user._id ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                        {msg.sender._id !== user._id && <p className="font-bold text-sm text-blue-500">{msg.sender.name}</p>}
                        <p className="pr-12" style={{wordBreak: 'break-word'}}>{msg.content}</p>
                        <span className="text-xs absolute bottom-1 right-2 opacity-75">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
            <div className="flex items-center gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"><Send size={20} /></button>
            </div>
        </form>
    </div>
  );
};

export default ChatWindow;