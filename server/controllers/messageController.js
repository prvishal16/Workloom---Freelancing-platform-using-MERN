import Message from '../models/Message.js';
import Project from '../models/Project.js';

export const getMessagesForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const isClient = project.client.equals(userId);
    const isFreelancer = project.freelancer && project.freelancer.equals(userId);
    if (!isClient && !isFreelancer) {
      return res.status(403).json({ error: 'Forbidden: You are not a participant in this project' });
    }

    const messages = await Message.find({ project: projectId })
      .populate('sender', 'name')
      .sort({ createdAt: 'asc' }); 

    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err.message);
    res.status(500).json({ error: 'Server error while fetching messages' });
  }
};