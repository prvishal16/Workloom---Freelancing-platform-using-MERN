import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOpenProjects } from '../services/api';
import { Briefcase, Clock, DollarSign } from 'lucide-react';

const FindWorkPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpenProjects = async () => {
      try {
        const data = await getOpenProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch open projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchOpenProjects();
  }, []);

  if (loading) return <div className="text-center p-10">Loading job listings...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
        <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
        <p className="text-gray-600 mt-2">Browse all open projects and find the perfect fit for your skills.</p>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No open projects found at the moment.</p>
        ) : (
          projects.map(project => (
            <JobCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

const JobCard = ({ project }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex flex-col sm:flex-row justify-between">
      <div>
        <Link to={`/project/${project._id}`} className="text-xl font-bold text-gray-900 hover:text-blue-600">
          {project.title}
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          Posted by {project.client?.name || 'a client'}
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex-shrink-0">
        <Link to={`/project/${project._id}`} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          View Details
        </Link>
      </div>
    </div>
    <div className="mt-4 border-t pt-4 flex flex-col sm:flex-row gap-4 text-gray-600 text-sm">
      <div className="flex items-center gap-2">
        <DollarSign size={16} />
        <span>Budget: ₹{project.budget}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={16} />
        <span>Posted on {new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

export default FindWorkPage;
