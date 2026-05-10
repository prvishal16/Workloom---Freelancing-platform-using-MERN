import Deliverable from '../models/Deliverable.js';
import Project from '../models/Project.js';

export const uploadDeliverable = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { description } = req.body;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (req.user.role !== 'freelancer') {
        return res.status(403).json({ error: 'Forbidden: Only freelancers can upload deliverables.' });
    }

    if (!project.freelancer) {
        return res.status(400).json({ error: 'This project does not have an assigned freelancer.' });
    }

    if (!project.freelancer.equals(userId)) {
      return res.status(403).json({ error: 'Forbidden: You are not the assigned freelancer for this project.' });
    }
    

    const newDeliverable = new Deliverable({
      project: projectId,
      submittedBy: userId,
      description,
      fileUrl: req.file.path, 
    });

    await newDeliverable.save();
    res.status(201).json(newDeliverable);
  } catch (err) {
    console.error('Upload deliverable error:', err);
    res.status(500).json({ error: 'Server error while uploading deliverable.', details: err.message });
  }
};

export const getDeliverablesForProject = async (req, res) => {
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
      return res.status(403).json({ error: 'Forbidden: You are not authorized to view these deliverables' });
    }

    const deliverables = await Deliverable.find({ project: projectId })
      .populate('submittedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(deliverables);
  } catch (err) {
    console.error('Get deliverables error:', err.message);
    res.status(500).json({ error: 'Server error while fetching deliverables' });
  }
};