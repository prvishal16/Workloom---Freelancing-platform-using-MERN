import React, { useState } from 'react';
import { changePassword } from '../services/api';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword(formData);
      toast.success(res.message);
      setFormData({ oldPassword: '', newPassword: '' }); 
    } catch (error) {
      toast.error(error.message || 'Failed to change password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Old Password</label>
        <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="w-full p-2 border rounded" required />
      </div>
      <div>
        <label className="block font-semibold">New Password</label>
        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full p-2 border rounded" required />
      </div>
      <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
        Change Password
      </button>
    </form>
  );
};

export default ChangePassword;