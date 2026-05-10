import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConversationList from '../components/ConversationList.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import { getConversations, getMyConnections, startConversation } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { MessageSquare } from 'lucide-react';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { conversationId: activeConversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return setLoading(false);
      try {
        setLoading(true);
        const [convosData, connsData] = await Promise.all([
          getConversations(),
          getMyConnections()
        ]);
        setConversations(convosData);
        setConnections(connsData);
      } catch (error) {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleStartNewConversation = async (recipientId) => {
    try {
      const newConvo = await startConversation(recipientId);
      navigate(`/messages/${newConvo._id}`);
    } catch (error) {
      toast.error("Could not start conversation.");
    }
  };

  const activeConversation = conversations.find(c => c._id === activeConversationId);

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`w-full md:w-[380px] border-r border-gray-200 flex-shrink-0 flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <ConversationList
          conversations={conversations}
          connections={connections}
          activeConversationId={activeConversationId}
          onStartConversation={handleStartNewConversation}
          isLoading={loading}
        />
      </div>

      <div className={`w-full flex-col ${activeConversationId ? 'flex' : 'hidden'} md:flex`}>
        {activeConversation ? (
          <ChatWindow key={activeConversationId} conversation={activeConversation} />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full text-center text-gray-500">
            <div className="flex flex-col items-center gap-4">
                <MessageSquare size={48} className="text-gray-300" />
                <h2 className="text-xl font-semibold">Welcome to your Messages</h2>
                <p>Select a conversation or start a new one.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;