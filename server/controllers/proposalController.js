import Proposal from '../models/Proposal.js';
import Project from '../models/Project.js';


export const getProposalsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.client.equals(userId)) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to view these proposals' });
    }

    const proposals = await Proposal.find({ project: projectId })
      .populate('freelancer', 'name email skills profilePictureUrl');

    res.json(proposals);
  } catch (err) {
    console.error('Get proposals error:', err.message);
    res.status(500).json({ error: 'Server error while fetching proposals' });
  }
};

export const submitProposal = async (req, res) => {
  try {
    const { coverLetter, bidAmount } = req.body;
    const { projectId } = req.params; 
    const freelancerId = req.user._id;

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can submit proposals' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (project.status !== 'open') {
      return res.status(400).json({ error: 'This project is no longer open for proposals' });
    }

    const existingProposal = await Proposal.findOne({ project: projectId, freelancer: freelancerId });
    if (existingProposal) {
      return res.status(409).json({ error: 'You have already submitted a proposal for this project' });
    }

    const proposal = new Proposal({
      project: projectId,
      freelancer: freelancerId,
      coverLetter,
      bidAmount,
    });

    await proposal.save();

    res.status(201).json(proposal);
  } catch (err) {
    console.error('Submit proposal error:', err.message);
    res.status(500).json({ error: 'Server error while submitting proposal' });
  }
};

export const updateProposalStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status } = req.body; 
    const clientId = req.user._id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status update' });
    }

    const proposal = await Proposal.findById(proposalId).populate('project');
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (!proposal.project.client.equals(clientId)) {
      return res.status(403).json({ error: 'Forbidden: You are not the owner of this project' });
    }

    if (proposal.project.status !== 'open') {
        return res.status(400).json({ error: 'This project is already in progress or completed.' });
    }

    proposal.status = status;
    await proposal.save();

    if (status === 'accepted') {
      await Project.findByIdAndUpdate(proposal.project._id, {
        status: 'in-progress',
        freelancer: proposal.freelancer,
        budget: proposal.bidAmount,
      });

      await Proposal.updateMany(
        { project: proposal.project._id, _id: { $ne: proposalId } }, 
        { status: 'rejected' }
      );
    }

    res.json(proposal);
  } catch (err) {
    console.error('Update proposal status error:', err.message);
    res.status(500).json({ error: 'Server error while updating proposal' });
  }
};

export const getMyProposals = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const proposals = await Proposal.find({ freelancer: freelancerId })
      .populate('project', 'title status') 
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (err) {
    console.error('Get my proposals error:', err.message);
    res.status(500).json({ error: 'Server error while fetching proposals' });
  }
};