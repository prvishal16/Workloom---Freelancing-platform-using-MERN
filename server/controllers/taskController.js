import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.status !== 'in-progress') {
      return res.status(400).json({ error: 'Tasks can only be added to projects that are in progress' });
    }

    const isClient = project.client.equals(userId);
    const isFreelancer = project.freelancer && project.freelancer.equals(userId);

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to add tasks to this project' });
    }

    const task = new Task({
      project: projectId,
      title,
    });

    await task.save();

    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err.message);
    res.status(500).json({ error: 'Server error while creating task' });
  }
};

export const getTasksForProject = async (req, res) => {
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
      return res.status(403).json({ error: 'Forbidden: You are not authorized to view these tasks' });
    }

    const tasks = await Task.find({ project: projectId }).sort({ createdAt: 'asc' });

    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err.message);
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const task = await Task.findById(taskId).populate('project');
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const project = task.project;
    const isClient = project.client.equals(userId);
    const isFreelancer = project.freelancer && project.freelancer.equals(userId);

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to modify this task' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error('Update task status error:', err.message);
    res.status(500).json({ error: 'Server error while updating task' });
  }
};