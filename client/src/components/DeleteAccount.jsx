import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteAccount } from '../services/api';
import { toast } from 'react-toastify';
import { LogOut } from 'lucide-react';

const DeleteAccount = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmationText, setConfirmationText] = useState('');

  const canDelete = confirmationText === user?.name;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      await deleteAccount();
      toast.success('Account deleted successfully.');
      logout();
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to delete account.');
    }
  };

  if (!user) return null;

  return (
    <>
        <div className="border-t mt-8 pt-6">
            <h3 className="text-xl font-bold text-gray-800">Sign Out</h3>
            <p className="text-gray-600 my-2">Log out of your account on this device.</p>
            <button 
                onClick={handleLogout} 
                className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
                <LogOut size={16} /> Log Out
            </button>
        </div>
        
        <div className="border-t mt-6 pt-6">
            <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
            <p className="text-gray-600 my-2">
                To permanently delete your account, please type your full name, <strong className="text-gray-800">{user.name}</strong>, into the box below.
            </p>
            <input 
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full p-2 border rounded border-gray-300 mb-4"
            />
            <button 
                onClick={handleDelete}
                disabled={!canDelete}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Delete My Account
            </button>
        </div>
    </>
  );
};

export default DeleteAccount;