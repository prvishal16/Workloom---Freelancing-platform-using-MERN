import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getUserProfile,
  getConnectionStatus,
  getReviewsForUser,
  getExperienceForUser,
  deleteExperience,
  getEducationForUser,
  deleteEducation,
  uploadProfilePicture,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';

import PostCard from "../components/PostCard.jsx";
import ReviewList from "../components/ReviewList.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import EditProfile from "../components/EditProfile.jsx";
import ChangePassword from "../components/ChangePassword.jsx";
import DeleteAccount from "../components/DeleteAccount.jsx";
import ExperienceForm from '../components/ExperienceForm.jsx';
import EducationForm from '../components/EducationForm.jsx';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [connectionInfo, setConnectionInfo] = useState({ status: null, data: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null); 
  const [isUploading, setIsUploading] = useState(false);

  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const isOwnProfile = currentUser?._id === userId;

  const fetchProfileData = useCallback(async () => {
    try {
      const [profileData, statusData, reviewsData, expData, eduData] = await Promise.all([
        getUserProfile(userId),
        isOwnProfile ? Promise.resolve({ status: 'self', connection: null }) : getConnectionStatus(userId),
        getReviewsForUser(userId),
        getExperienceForUser(userId),
        getEducationForUser(userId),
      ]);
      setProfile(profileData);
      setConnectionInfo({ status: statusData.status, data: statusData.connection });
      setReviews(reviewsData);
      setExperience(expData);
      setEducation(eduData);
    } catch (err) {
      setError("Failed to load profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, isOwnProfile]);

  useEffect(() => {
    setLoading(true);
    fetchProfileData();
  }, [userId]);

  const handleDeleteExperience = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(id);
        setExperience(prev => prev.filter(item => item._id !== id));
        toast.success("Experience removed.");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleDeleteEducation = async (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await deleteEducation(id);
        setEducation(prev => prev.filter(item => item._id !== id));
        toast.success("Education entry removed.");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    
    setIsUploading(true);
    try {
      const updatedUser = await uploadProfilePicture(formData);
      updateUser(updatedUser);
      await fetchProfileData();
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="text-center p-10">Loading profile...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center p-10">User not found.</div>;

  const { user, posts } = profile;

  const renderRightPanel = () => {
    switch(editMode) {
        case 'edit-profile':
            return <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Edit Profile</h2><EditProfile onSuccess={() => { setEditMode(null); fetchProfileData(); }} /></div>;
        case 'experience':
            return <ExperienceForm onCancel={() => setEditMode(null)} onSuccess={() => { setEditMode(null); fetchProfileData(); }} />;
        case 'education':
            return <EducationForm onCancel={() => setEditMode(null)} onSuccess={() => { setEditMode(null); fetchProfileData(); }} />;
        case 'settings':
            return <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-2xl font-bold mb-4">Account Settings</h2><ChangePassword /><DeleteAccount /></div>;
        default:
            return (
                <>
                    <div className="mb-8"><h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2><ReviewList reviews={reviews} /></div>
                    <h2 className="text-2xl font-bold mb-4">Activity</h2>
                    {posts.length > 0 ? posts.map(post => <PostCard key={post._id} post={post} />) : <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">This user hasn't posted anything yet.</div>}
                </>
            );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-4">
        <ProfileCard 
          user={user} 
          isUploading={isUploading}
          onAvatarSelect={handleAvatarUpload}
          connectionInfo={connectionInfo}
          experience={experience}
          education={education}
          isOwnProfile={isOwnProfile}
          onEditClick={(mode) => setEditMode(mode)}
          onDeleteExperience={handleDeleteExperience}
          onDeleteEducation={handleDeleteEducation}
          refetchProfile={fetchProfileData}
        />
      </div>
      <div className="md:col-span-8">
        {isOwnProfile && (
            <div className="bg-white rounded-lg shadow-md mb-6">
              <nav className="flex gap-4 p-4 border-b">
                <button onClick={() => setEditMode(null)} className={`font-semibold p-2 ${!editMode ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>My Profile</button>
                <button onClick={() => setEditMode('edit-profile')} className={`font-semibold p-2 ${editMode === 'edit-profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Edit Details</button>
                <button onClick={() => setEditMode('settings')} className={`font-semibold p-2 ${editMode === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Account Settings</button>
              </nav>
            </div>
        )}
        {renderRightPanel()}
      </div>
    </div>
  );
};

export default ProfilePage;