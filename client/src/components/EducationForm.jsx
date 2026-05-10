import React, { useState } from 'react';
import { addEducation } from '../services/api';
import { toast } from 'react-toastify';

const EducationForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.school || !formData.degree || !formData.startDate) {
        return toast.error("Please fill out the School, Degree, and Start Date fields.");
    }
    try {
      await addEducation(formData);
      toast.success("Education added!");
      onSuccess();
    } catch (error)
    {
      toast.error(error.message || "Failed to add education.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Education</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">School / University*</label><input type="text" name="school" placeholder="e.g., University of Hyderabad" value={formData.school} onChange={handleChange} required className="w-full p-2 border rounded-md" /></div>
          <div><label className="text-sm font-medium">Degree*</label><input type="text" name="degree" placeholder="e.g., Bachelor of Technology" value={formData.degree} onChange={handleChange} required className="w-full p-2 border rounded-md" /></div>
          <div><label className="text-sm font-medium">Field of Study</label><input type="text" name="fieldOfStudy" placeholder="e.g., Computer Science" value={formData.fieldOfStudy} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
          <div><label className="text-sm font-medium">Start Date*</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full p-2 border rounded-md" /></div>
          <div><label className="text-sm font-medium">End Date (leave blank if current)</label><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
          <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onCancel} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Save Education</button>
          </div>
      </form>
    </div>
  );
};

export default EducationForm;