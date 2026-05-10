import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationsAsRead } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageCircle, UserPlus, CheckCircle, FileText, Newspaper } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification }) => {
    const icons = {
        new_like: <ThumbsUp className="text-blue-500" />,
        new_comment: <MessageCircle className="text-green-500" />,
        new_connection_request: <UserPlus className="text-purple-500" />,
        connection_accepted: <CheckCircle className="text-green-500" />,
        new_proposal: <FileText className="text-yellow-500" />,
        new_post: <Newspaper className="text-indigo-500" />,
    };

    const text = {
        new_like: "liked your post.",
        new_comment: "commented on your post.",
        new_connection_request: "wants to connect with you.",
        connection_accepted: "accepted your connection request.",
        new_proposal: "submitted a proposal on your project.",
        new_post: "created a new post."
    };
    
    const senderName = notification.sender?.name || 'An unknown user';
    const senderId = notification.sender?._id;

    return (
        <li className={`p-4 flex items-start gap-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
            <div className="flex-shrink-0 mt-1">
                {icons[notification.type]}
            </div>
            <div className="flex-grow">
                <p className="text-gray-800">
                    {senderId ? (
                        <Link to={`/profile/${senderId}`} className="font-bold hover:underline">
                            {senderName}
                        </Link>
                    ) : (
                        <span className="font-bold">{senderName}</span>
                    )}
                    {' '}{text[notification.type]}
                </p>
                <div className="text-sm mt-1 flex justify-between">
                    <span className="text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                    <Link to={notification.link} className="font-semibold text-blue-600 hover:underline">
                        View Details
                    </Link>
                </div>
            </div>
        </li>
    );
};


const NotificationsPage = ({ onPageOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMarkNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        if (onPageOpen) onPageOpen(); 
      } catch (error) {
        toast.error("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchAndMarkNotifications();
  }, [onPageOpen]);

  if (loading) return <div className="text-center p-10">Loading notifications...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {notifications.length === 0 ? (
          <p className="text-gray-500 p-8 text-center">You have no notifications yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map(noti => <NotificationItem key={noti._id} notification={noti} />)}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;