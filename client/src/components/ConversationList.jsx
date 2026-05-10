import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ConversationList = ({ conversations, connections, activeConversationId, onStartConversation, isLoading }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const displayList = useMemo(() => {
    const convoMap = new Map();
    conversations.forEach(convo => {
      const other = convo.participants.find(p => p._id !== user._id);
      if (other) {
        convoMap.set(other._id, { type: 'conversation', data: convo, user: other });
      }
    });
    connections.forEach(conn => {
      if (!convoMap.has(conn._id)) {
        convoMap.set(conn._id, { type: 'connection', data: conn, user: conn });
      }
    });
    return Array.from(convoMap.values())
        .filter(item => item.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [conversations, connections, user, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Messages</h2>
        <input 
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mt-3 p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : displayList.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="font-semibold">No conversations found.</p>
            <p className="text-sm mt-2">Connect with people to start messaging.</p>
          </div>
        ) : (
          displayList.map(item => {
            const isActive = item.type === 'conversation' && item.data._id === activeConversationId;
            return (
              <Link
                key={item.user._id}
                to={item.type === 'conversation' ? `/messages/${item.data._id}` : '#'}
                onClick={(e) => {
                    if(item.type === 'connection') {
                        e.preventDefault();
                        onStartConversation(item.user._id);
                    }
                }}
                className={`flex items-center gap-3 p-3 border-b border-gray-200 hover:bg-gray-100 ${isActive ? 'bg-blue-100' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center font-bold text-blue-600">
                  {item.user.name.charAt(0)}
                </div>
                <div className="flex-grow overflow-hidden">
                    <p className="font-semibold truncate">{item.user.name}</p>
                    {item.type === 'connection' && <p className="text-sm text-gray-400">Start conversation</p>}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;