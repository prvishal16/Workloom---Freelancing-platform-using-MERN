import Connection from '../models/Connection.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket.js';

export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await Connection.find({ recipient: userId, status: 'pending' })
      .populate('requester', 'name role profilePictureUrl');
      
    res.json(requests);
  } catch (err) {
    console.error("Get pending requests error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const respondToRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { status } = req.body; 
    const userId = req.user._id;

    if (!['accepted', 'declined'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status update.' });
    }

    const request = await Connection.findById(connectionId);
    if (!request) {
      return res.status(404).json({ error: 'Connection request not found.' });
    }

    if (!request.recipient.equals(userId)) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to respond to this request.' });
    }

    if (request.status !== 'pending') {
        return res.status(400).json({ error: `This request has already been ${request.status}.` });
    }

    request.status = status;
    await request.save();

    if (status === 'accepted') {
        const notification = new Notification({
            recipient: request.requester,
            sender: req.user._id,
            type: 'connection_accepted',
            link: `/profile/${req.user._id}`,
        });
        await notification.save();

        const io = getIO();
        io.to(request.requester.toString()).emit('newNotification', { message: `${req.user.name} accepted your connection request.` });
    }
    
    res.json(request);
  } catch (err) {
    console.error("Respond to request error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


export const getMyConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    });

    const friendIds = connections.map(conn =>
      conn.requester.equals(userId) ? conn.recipient : conn.requester
    );

    const friends = await User.find({
      '_id': { $in: friendIds }
    }).select('name role profilePictureUrl');

    res.json(friends);
  } catch (err) {
    console.error("Get my connections error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};