import User from "../models/User.js";
import Post from "../models/Post.js";
import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket.js";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-passwordHash -email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ author: userId })
      .populate("author", "name role profilePictureUrl")
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (err) {
    console.error("Get user profile error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { name, bio, skills, profilePictureUrl } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (bio !== undefined) update.bio = bio;
    if (skills !== undefined) update.skills = skills;
    if (profilePictureUrl !== undefined)
      update.profilePictureUrl = profilePictureUrl;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("updateMe error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const recipientId = req.params.userId;
    const requesterId = req.user._id;

    if (requesterId.equals(recipientId)) {
      return res.status(400).json({ error: "You cannot connect with yourself." });
    }
    
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ error: `A connection already exists with status: ${existingConnection.status}.` });
    }

    const newConnection = new Connection({
      requester: req.user._id,
      recipient: recipientId,
    });
    await newConnection.save();

    const notification = new Notification({
        recipient: recipientId,
        sender: req.user._id,
        type: 'new_connection_request',
        link: newConnection._id.toString(),
    });
    await notification.save();

    const io = getIO();
    io.to(recipientId).emit('newNotification', { message: `${req.user.name} wants to connect with you.` });
    
    res.status(201).json(newConnection);
  } catch (err) {
    console.error("Send connection request error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const profileUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (currentUserId.equals(profileUserId)) {
      return res.json({ status: "self" });
    }

    const connection = await Connection.findOne({
      $or: [
        { requester: currentUserId, recipient: profileUserId },
        { requester: profileUserId, recipient: currentUserId },
      ],
    });

    if (connection) {
      res.json({ status: connection.status, connection });
    } else {
      res.json({ status: "not_connected" });
    }
  } catch (err) {
    console.error("Get connection status error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Please provide both old and new passwords." });
    }

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect old password." });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error while changing password." });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ error: "Server error while deleting account." });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const user = await User.findById(req.user._id);
    user.profilePictureUrl = req.file.path; 
    await user.save();
    res.json(user);
  } catch (error) {
    console.error("--- AVATAR UPLOAD ERROR ---");
    console.error(error);
    res.status(500).json({ error: "Server error while uploading avatar." });
  }
};
