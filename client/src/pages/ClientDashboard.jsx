import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProjects } from '../services/api';
import { PlusCircle, Eye, Clock, CheckCircle } from 'lucide-react';

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getMyProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch your projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="text-center p-10">Loading your projects...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-gray-600 mt-1">Manage your posted jobs and active collaborations.</p>
        </div>
        <Link
          to="/project/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Create Project</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
            <h2 className="text-xl font-semibold">Your Project Listings</h2>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center text-gray-500 p-10 border-t">
            You haven't posted any projects yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <ProjectListItem key={project._id} project={project} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ProjectListItem = ({ project }) => {
    const statusInfo = {
        open: { text: 'Open for Bids', icon: Eye, color: 'text-blue-600' },
        'in-progress': { text: 'In Progress', icon: Clock, color: 'text-yellow-600' },
        completed: { text: 'Completed', icon: CheckCircle, color: 'text-green-600' },
    };

    const currentStatus = statusInfo[project.status] || {};
    const StatusIcon = currentStatus.icon || Eye;

    return (
        <li className="p-6 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
                <Link to={`/project/${project._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">{project.title}</Link>
                <div className={`flex items-center gap-2 mt-1 text-sm ${currentStatus.color}`}>
                    <StatusIcon size={16} />
                    <span>{currentStatus.text}</span>
                </div>
            </div>
            <div className="flex-shrink-0">
                {project.status === 'open' && (
                    <Link to={`/project/${project._id}/proposals`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm">
                        View Proposals
                    </Link>
                )}
                 {project.status === 'in-progress' && (
                    <Link to={`/project/${project._id}`} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">
                        View Workspace
                    </Link>
                )}
            </div>
        </li>
    );
};


export default ClientDashboard;