import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name profilePictureUrl")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Get notifications error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Notifications marked as read." });
  } catch (err) {
    console.error("Mark notifications as read error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });
    res.json({ count });
  } catch (err) {
    console.error("Get unread count error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
