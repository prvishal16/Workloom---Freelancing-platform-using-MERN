import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../services/api';
import { toast } from 'react-toastify';

const EditProfile = ({ onSuccess }) => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    try {
      const updatedUser = await updateMe({ ...formData, skills: skillsArray });
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      if (onSuccess) onSuccess();tabs
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block font-semibold">Bio</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border rounded" rows="4"></textarea>
      </div>
      <div>
        <label className="block font-semibold">Skills (comma separated)</label>
        <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full p-2 border rounded" />
      </div>
      <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
        Save Changes
      </button>
    </form>
  );
};

export default EditProfile;