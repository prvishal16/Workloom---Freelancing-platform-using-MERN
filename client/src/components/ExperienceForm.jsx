import React, { useState } from 'react';
import { addExperience } from '../services/api';
import { toast } from 'react-toastify';

const ExperienceForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.startDate) {
      return toast.error("Please fill out Title, Company, and Start Date.");
    }
    try {
      await addExperience(formData);
      toast.success("Experience added!");
      onSuccess();
    } catch (error) {
      toast.error(error.message || "Failed to add experience.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">Title*</label><input type="text" name="title" placeholder="e.g., Software Engineer" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded-md" /></div>
          <div><label className="text-sm font-medium">Company*</label><input type="text" name="company" placeholder="e.g., Google" value={formData.company} onChange={handleChange} required className="w-full p-2 border rounded-md" /></div>
          <div><label className="text-sm font-medium">Location</label><input type="text" name="location" placeholder="e.g., Remote" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
          <div><label className="text-sm font-medium">Start Date*</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full p-2 border rounded-md" /></div>
          <div><label className="text-sm font-medium">End Date (leave blank if current)</label><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
          <div><label className="text-sm font-medium">Description</label><textarea name="description" placeholder="Describe your role and responsibilities" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-md"></textarea></div>
          <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onCancel} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Save Experience</button>
          </div>
      </form>
    </div>
  );
};

export default ExperienceForm;