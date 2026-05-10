import Project from '../models/Project.js';
import Post from '../models/Post.js';
import Invoice from '../models/Invoice.js';

export const createProject = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const project = new Project({
      title,
      description,
      budget,
      client: req.user._id,
    });
    await project.save();

    const jobPost = new Post({
      author: req.user._id,
      postType: 'job',
      project: project._id, 
      content: {
        jobTitle: project.title,
        jobDescription: project.description,
        jobBudget: project.budget,
      },
    });
    await jobPost.save();

    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err.message);
    res.status(500).json({ error: 'Server error while creating project' });
  }
};

export const getOpenProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'open' })
      .populate('client', 'name profilePictureUrl')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error('Get open projects error:', err.message);
    res.status(500).json({ error: 'Server error while fetching projects' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name profilePictureUrl')
      .populate('freelancer', 'name profilePictureUrl skills');

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const projectObject = project.toObject();

    const invoice = await Invoice.findOne({ project: project._id });

    projectObject.invoice = invoice;

    res.json(projectObject);

  } catch (err) {
    console.error('Get project by ID error:', err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ client: req.user._id }, { freelancer: req.user._id }],
    })
      .populate('client', 'name')
      .populate('freelancer', 'name')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error('Get my projects error:', err.message);
    res.status(500).json({ error: 'Server error while fetching projects' });
  }
};