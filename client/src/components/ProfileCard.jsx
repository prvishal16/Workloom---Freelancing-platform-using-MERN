import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  sendConnectionRequest,
  startConversation,
  respondToRequest,
  uploadProfilePicture,
} from "../services/api";
import {
  UserPlus,
  Check,
  X,
  Clock,
  Star,
  MessageSquare,
  Plus,
  Pencil,
  LoaderCircle,
} from "lucide-react";
import EducationList from "./EducationList";
import ExperienceList from "./ExperienceList";

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    <Star
      size={16}
      className={rating > 0 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
    />
    <span className="font-bold">{rating.toFixed(1)}</span>
  </div>
);

const ProfileCard = ({
  user,
  isUploading,
  onAvatarSelect,
  connectionInfo,
  experience,
  education,
  isOwnProfile,
  onEditClick,
  onDeleteExperience,
  onDeleteEducation,
  refetchProfile,
}) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleStartConversation = async () => {
    try {
      const conversation = await startConversation(user._id);
      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      toast.error("Failed to start conversation.");
    }
  };

  const handleConnect = async () => {
    try {
      await sendConnectionRequest(user._id);
      toast.success("Connection request sent!");
      refetchProfile && refetchProfile();
    } catch (err) {
      toast.error(err.message || "Failed to send request.");
    }
  };

  const handleResponse = async (status) => {
    try {
      await respondToRequest(connectionInfo?.data?._id, status);
      toast.success(`Request ${status}.`);
      refetchProfile && refetchProfile();
    } catch (error) {
      toast.error(error.message || "Failed to respond.");
    }
  };

  const renderConnectButton = () => {
    if (!currentUser || isOwnProfile) return null;

    switch (connectionInfo.status) {
      case "not_connected":
        return (
          <button
            onClick={handleConnect}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <UserPlus size={18} /> Connect
          </button>
        );
      case "pending":
        if (connectionInfo.data?.requester === currentUser._id) {
          return (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Clock size={18} /> Pending
            </button>
          );
        } else {
          return (
            <div className="text-center">
              <p className="text-sm font-semibold mb-2">Request Received</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleResponse("accepted")}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Accept
                </button>
                <button
                  onClick={() => handleResponse("declined")}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <X size={18} /> Decline
                </button>
              </div>
            </div>
          );
        }
      case "accepted":
        return (
          <button
            disabled
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Check size={18} /> Connected
          </button>
        );
      default:
        return null;
    }
  };

  const renderSkills = () => {
    if (user.role === "freelancer") {
      return (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Skills</h3>
            {isOwnProfile && (
              <button
                onClick={() => onEditClick && onEditClick("edit-profile")}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet.</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <div className="relative w-24 h-24 mx-auto mb-4">
        {user.profilePictureUrl ? (
          <img
            src={user.profilePictureUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center font-bold text-4xl text-blue-600">
            {user.name?.charAt(0)}
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <LoaderCircle className="animate-spin text-white" />
          </div>
        )}
        {isOwnProfile && !isUploading && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onAvatarSelect}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
              title="Change profile picture"
            >
              <Pencil size={16} />
            </button>
          </>
        )}
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-md text-gray-500 capitalize">{user.role}</p>
        {user.totalReviews > 0 ? (
          <div className="mt-2 text-sm text-gray-600 inline-block">
            <StarRating rating={user.averageRating} />
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-600 inline-block">
            <StarRating rating={0} />
          </div>
        )}
        <div className="mt-4 w-full flex flex-col gap-2">
          {renderConnectButton()}
          {connectionInfo.status !== "self" && (
            <button
              onClick={handleStartConversation}
              className="w-full bg-white border border-blue-600 text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} /> Message
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Bio</h3>
          {isOwnProfile && (
            <button
              onClick={() => onEditClick("edit-profile")}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
          {user.bio || "No bio provided."}
        </p>
      </div>

      {renderSkills()}

      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Experience</h3>
          {isOwnProfile && (
            <button
              onClick={() => onEditClick("experience")}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
        <ExperienceList
          experiences={experience}
          isOwnProfile={isOwnProfile}
          onDelete={onDeleteExperience}
        />
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Education</h3>
          {isOwnProfile && (
            <button
              onClick={() => onEditClick("education")}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
        <EducationList
          educations={education}
          isOwnProfile={isOwnProfile}
          onDelete={onDeleteEducation}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
