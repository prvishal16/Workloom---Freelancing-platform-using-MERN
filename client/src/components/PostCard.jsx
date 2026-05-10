import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, MessageCircle, Share2, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { likePost, addComment } from "../services/api";
import { socket } from "../services/socket";
import { formatDistanceToNow } from "date-fns";

const renderWithHashtags = (text) => {
  if (!text) return null;
  const parts = text.split(/(#\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('#')) {
      const tag = part.substring(1);
      return (
        <Link key={index} to={`/search?q=${tag}`} className="text-blue-600 hover:underline">
          {part}
        </Link>
      );
    }
    return part;
  });
};

const formatTimestamp = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

const PostCard = ({ post }) => {
  const { author, content, postType, createdAt, _id, project } = post;
  const { user } = useAuth();

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(2);

  useEffect(() => {
    setIsLiked(likes.includes(user?._id));
  }, [likes, user?._id]);

  useEffect(() => {
    const handleLikeUpdate = ({ postId, likes: updatedLikes }) => {
      if (postId === _id) setLikes(updatedLikes);
    };
    const handleCommentUpdate = ({ postId, comment: newComment }) => {
      if (postId === _id) {
        setComments((prevComments) => [newComment, ...prevComments]);
        setVisibleCommentsCount((prevCount) => prevCount + 1);
      }
    };

    socket.on("postLikeUpdate", handleLikeUpdate);
    socket.on("postCommentUpdate", handleCommentUpdate);

    return () => {
      socket.off("postLikeUpdate", handleLikeUpdate);
      socket.off("postCommentUpdate", handleCommentUpdate);
    };
  }, [_id]);

  const handleLike = async () => {
    const originalLikes = likes;
    const newLikes = isLiked
      ? likes.filter((id) => id !== user._id)
      : [...likes, user._id];

    setIsLiked(!isLiked);
    setLikes(newLikes);

    try {
      await likePost(_id);
    } catch (error) {
      console.error("Failed to update like status:", error);
      setIsLiked(!isLiked);
      setLikes(originalLikes);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment(_id, { text: newComment });
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const renderContent = () => {
    switch (postType) {
      case "job":
        return (
          <div className="border border-gray-200 rounded-lg p-4 mt-2">
            <h3 className="font-bold text-lg">{content.jobTitle}</h3>
            {content.jobBudget && (
              <p className="text-green-600 font-semibold">
                Budget: ₹{content.jobBudget}
              </p>
            )}
            <p className="mt-2 text-gray-700 line-clamp-3">
              {content.jobDescription}
            </p>
            {project && (
              <Link
                to={`/project/${project}`}
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
              >
                <Briefcase size={16} />
                View Job & Apply
              </Link>
            )}
          </div>
        );
      case "showcase":
        return (
          <div>
            <p className="mb-2 text-gray-700 whitespace-pre-wrap">{renderWithHashtags(content.text)}</p>
            <img
              src={content.imageUrl}
              alt="Showcase"
              className="mt-2 rounded-lg w-full object-cover"
            />
          </div>
        );
      case "text":
      default:
       return (
          <p className="text-gray-700 whitespace-pre-wrap">
            {renderWithHashtags(content.text)}
          </p>
        );
    }
  };

  const handleLoadMoreComments = () => {
    setVisibleCommentsCount(comments.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <div className="flex items-center mb-4">
        <Link to={`/profile/${author._id}`} className="flex items-center group">
          {author.profilePictureUrl ? (
            <img
              src={author.profilePictureUrl}
              alt={author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-blue-600 group-hover:ring-2 ring-blue-500 transition-all">
              {author.name.charAt(0)}
            </div>
          )}
          <div className="ml-3">
            <p className="font-semibold text-gray-900 group-hover:underline">
              {author.name}
            </p>
            <p className="text-sm text-gray-500">
              {formatTimestamp(createdAt)}
            </p>
          </div>
        </Link>
      </div>

      <div className="mb-4">{renderContent()}</div>

      <div className="border-t border-gray-200 pt-2 flex justify-around text-gray-600">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full justify-center transition-colors ${
            isLiked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <ThumbsUp size={20} className={isLiked ? "fill-current" : ""} />
          {likes.length > 0 && (
            <span className="font-semibold">{likes.length}</span>
          )}
          <span>{likes.length === 1 ? "Like" : "Likes"}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full justify-center"
        >
          <MessageCircle size={20} />
          {comments.length > 0 && (
            <span className="font-semibold">{comments.length}</span>
          )}
          <span>{comments.length === 1 ? "Comment" : "Comments"}</span>
        </button>
        <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full justify-center">
          <Share2 size={20} /> Share
        </button>
      </div>

      {showComments && (
        <div className="border-t border-gray-200 mt-3 pt-4">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
            {user?.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">{user?.name.charAt(0)}</div>
            )}
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 rounded-full font-semibold"
            >
              Post
            </button>
          </form>
          <div className="space-y-3">
            {comments.slice(0, visibleCommentsCount).map((comment) => (
              <div key={comment._id} className="flex items-start gap-2">
                 {comment.author?.profilePictureUrl ? (
                    <img src={comment.author.profilePictureUrl} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                 ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 items-center justify-center flex font-bold text-gray-600">{comment.author?.name?.charAt(0) || "?"}</div>
                 )}
                <div className="bg-gray-100 rounded-lg px-3 py-2 flex-grow">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-sm">
                      {comment.author?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(comment.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          {comments.length > visibleCommentsCount && (
            <button
              onClick={handleLoadMoreComments}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 mt-3"
            >
              View all {comments.length} comments
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;