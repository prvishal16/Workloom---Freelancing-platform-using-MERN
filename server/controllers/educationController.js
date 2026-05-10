import Education from '../models/Education.js';

export const addEducation = async (req, res) => {
  try {
    const newEducation = new Education({
      ...req.body,
      user: req.user._id,
    });
    await newEducation.save();
    res.status(201).json(newEducation);
  } catch (error) {
    res.status(500).json({ error: 'Server error while adding education.' });
  }
};

export const getEducationForUser = async (req, res) => {
  try {
    const educations = await Education.find({ user: req.params.userId }).sort({ startDate: -1 });
    res.json(educations);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching education.' });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) return res.status(404).json({ error: 'Education not found.' });
    if (!education.user.equals(req.user._id)) return res.status(403).json({ error: 'User not authorized.' });

    await education.deleteOne();
    res.json({ message: 'Education removed.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting education.' });
  }
};