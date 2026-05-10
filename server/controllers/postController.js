import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import Connection from "../models/Connection.js";
import { getIO } from "../socket.js";

export const createPost = async (req, res) => {
  try {
    const { postType, content } = req.body;
    const author = req.user;

    let hashtags = [];
    if (content.text) {
      const regex = /#(\w+)/g;
      hashtags = content.text.match(regex)?.map(tag => tag.substring(1).toLowerCase()) || [];
    }

    if (!postType || !content) {
      return res
        .status(400)
        .json({ error: "Post type and content are required." });
    }

    const newPost = new Post({
      author: author._id,
      postType,
      content,
      hashtags,
    });
    await newPost.save();

    const connections = await Connection.find({
      $or: [{ requester: author._id }, { recipient: author._id }],
      status: "accepted",
    });

    const friendIds = connections.map((conn) =>
      conn.requester.equals(author._id) ? conn.recipient : conn.requester
    );

    if (friendIds.length > 0) {
      const io = getIO();
      const notifications = friendIds.map((friendId) => ({
        recipient: friendId,
        sender: author._id,
        type: "new_post",
        link: `/post/${newPost._id}`,
      }));
      await Notification.insertMany(notifications);

      friendIds.forEach((friendId) => {
        io.to(friendId.toString()).emit("newNotification", {
          message: `${author.name} created a new post.`,
        });
      });
    }

    const populatedPost = await Post.findById(newPost._id).populate(
      "author",
      "name role profilePictureUrl"
    );
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Create post error:", err.message);
    res.status(500).json({ error: "Server error while creating post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name role profilePictureUrl")
      .populate("comments.author", "name profilePictureUrl")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (err) {
    console.error("Get all posts error:", err.message);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    if (!hasLiked && !post.author.equals(userId)) {
      const notification = new Notification({
        recipient: post.author,
        sender: userId,
        type: "new_like",
        link: `/post/${post._id}`,
      });
      await notification.save();
      const io = getIO();
      io.to(post.author.toString()).emit("newNotification", {
        message: `${req.user.name} liked your post.`,
      });
    }

    const io = getIO();
    io.emit("postLikeUpdate", { postId: post._id, likes: post.likes });
    res.json(post.likes);
  } catch (err) {
    console.error("Like post error:", err.message);
    res.status(500).json({ error: "Server error while liking post" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const sender = req.user;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment text cannot be empty." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const newComment = { author: sender._id, text: text.trim() };
    post.comments.unshift(newComment);
    await post.save();

    const populatedPost = await Post.findById(post._id).populate(
      "comments.author",
      "name profilePictureUrl"
    );
    const finalComment = populatedPost.comments[0];

    const io = getIO();
    io.emit("postCommentUpdate", { postId, comment: finalComment });

    if (!post.author.equals(sender._id)) {
      const notification = new Notification({
        recipient: post.author,
        sender: sender._id,
        type: "new_comment",
        link: `/post/${post._id}`,
      });
      await notification.save();
      io.to(post.author.toString()).emit("newNotification", {
        message: `${sender.name} commented on your post.`,
      });
    }

    res.status(201).json(finalComment);
  } catch (err) {
    console.error("Add comment error:", err.message);
    res.status(500).json({ error: "Server error while adding comment." });
  }
};
