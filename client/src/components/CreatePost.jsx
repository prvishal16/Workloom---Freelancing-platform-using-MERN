import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../services/api';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      return toast.error("Post content cannot be empty.");
    }

    setIsSubmitting(true);
    try {
      const postData = {
        postType: 'text',
        content: { text },
      };
      const newPost = await createPost(postData);
      toast.success("Post created successfully!");
      setText(''); 
      onPostCreated(newPost);
    } catch (err) {
      toast.error(err.message || "Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <div className="flex items-start gap-4">
        {user?.profilePictureUrl ? (
          <img src={user.profilePictureUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
            {user?.name.charAt(0)}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
            placeholder="What's on your mind?"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;