import Experience from '../models/Experience.js';

export const addExperience = async (req, res) => {
  try {
    const newExperience = new Experience({
      ...req.body,
      user: req.user._id,
    });
    await newExperience.save();
    res.status(201).json(newExperience);
  } catch (error) {
res.status(500).json({ error: 'Server error while adding experience.', details: error.message });  }
};

export const getExperienceForUser = async (req, res) => {
  try {
    const experiences = await Experience.find({ user: req.params.userId }).sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching experience.' });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ error: 'Experience not found.' });
    if (!experience.user.equals(req.user._id)) return res.status(403).json({ error: 'User not authorized.' });
    
    await experience.deleteOne();
    res.json({ message: 'Experience removed.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting experience.' });
  }
};