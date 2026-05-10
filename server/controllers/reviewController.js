import Review from '../models/Review.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name role profilePictureUrl')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { rating, comment, revieweeId } = req.body;
    const reviewerId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const isReviewerParticipant = project.client.equals(reviewerId) || (project.freelancer && project.freelancer.equals(reviewerId));
    if (!isReviewerParticipant) {
      return res.status(403).json({ error: 'You are not a participant in this project.' });
    }
    if (reviewerId.equals(revieweeId)) {
      return res.status(400).json({ error: 'You cannot review yourself.' });
    }

    const newReview = new Review({
      project: projectId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
    });
    await newReview.save();

    const reviewee = await User.findById(revieweeId);
    const newTotalReviews = reviewee.totalReviews + 1;
    const newAverageRating = 
      ((reviewee.averageRating * reviewee.totalReviews) + rating) / newTotalReviews;

    reviewee.totalReviews = newTotalReviews;
    reviewee.averageRating = newAverageRating.toFixed(2); 
    await reviewee.save();

    res.status(201).json(newReview);
  } catch (err) {
    console.error("Create review error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkUserReview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const reviewerId = req.user._id;
    const existingReview = await Review.findOne({ project: projectId, reviewer: reviewerId });
    res.json({ hasReviewed: !!existingReview });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};