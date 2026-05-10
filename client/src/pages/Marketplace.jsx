import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOpenProjects } from '../services/api'; 
const Marketplace = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getOpenProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  if (loading) {
    return <div className="text-center p-10">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Open Projects</h1>
      {projects.length === 0 ? (
        <p>No open projects found at the moment. Please check back later!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/project/${project._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
    >
      <h2 className="text-xl font-bold text-blue-600 mb-2">{project.title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-green-600">Budget: ₹{project.budget}</span>
        <span className="text-gray-500">
          Posted by: {project.client?.name || 'N/A'}
        </span>
      </div>
    </Link>
  );
};

export default Marketplace;