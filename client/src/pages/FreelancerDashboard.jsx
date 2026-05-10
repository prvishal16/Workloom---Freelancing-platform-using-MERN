import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProjects, getMyProposals } from '../services/api';
import { Clock, CheckCircle, FileText } from 'lucide-react';

const ProjectSection = ({ title, items, renderItem, emptyMessage }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleItems = isExpanded ? items : items.slice(0, 3);
  
    return (
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center text-gray-500 p-10">
            {emptyMessage}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {visibleItems.map(item => renderItem(item))}
          </ul>
        )}
  
        {items.length > 3 && (
          <div className="p-4 border-t text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {isExpanded ? 'Show Less' : `Show ${items.length - 3} More`}
            </button>
          </div>
        )}
      </div>
    );
};

const ProjectListItem = ({ project }) => {
    const statusInfo = {
        'in-progress': { text: 'In Progress', icon: Clock, color: 'text-yellow-600' },
        'completed': { text: 'Completed', icon: CheckCircle, color: 'text-green-600' },
    };
    const currentStatus = statusInfo[project.status] || {};
    const StatusIcon = currentStatus.icon || Clock;

    return (
        <li className="p-6 hover:bg-gray-50 flex justify-between items-center">
            <div>
                <Link to={`/project/${project._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">{project.title}</Link>
                <div className={`flex items-center gap-2 mt-1 text-sm ${currentStatus.color}`}>
                    <StatusIcon size={16} />
                    <span>{currentStatus.text}</span>
                </div>
            </div>
            <Link to={`/project/${project._id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm">
                Open Workspace
            </Link>
        </li>
    );
};

const ProposalListItem = ({ proposal }) => {
    let statusText = 'Awaiting Response';
    let statusColor = 'text-gray-500';

    if (proposal.status === 'accepted') {
        statusText = 'Accepted';
        statusColor = 'text-green-600';
    } else if (proposal.status === 'rejected') {
        statusText = 'Rejected';
        statusColor = 'text-red-600';
    }

    return (
        <li className="p-6 hover:bg-gray-50 flex justify-between items-center">
            <div>
                <Link to={`/project/${proposal.project._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">{proposal.project.title}</Link>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <FileText size={16} />
                    <span>Your Bid: ₹{proposal.bidAmount}</span>
                </div>
            </div>
            <span className={`text-sm font-semibold ${statusColor}`}>{statusText}</span>
        </li>
    );
};


const FreelancerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, proposalsData] = await Promise.all([
          getMyProjects(),
          getMyProposals()
        ]);
        setProjects(projectsData);
        setProposals(proposalsData);
      } catch (err) {
        setError('Failed to fetch your data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center p-10">Loading your dashboard...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  const activeProjects = projects.filter(p => p.status === 'in-progress');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const submittedProposals = proposals;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      <ProjectSection
        title="Active Projects"
        items={activeProjects}
        renderItem={(project) => <ProjectListItem key={project._id} project={project} />}
        emptyMessage="You have no active projects."
      />
      
      <ProjectSection
        title="My Submitted Proposals"
        items={submittedProposals}
        renderItem={(proposal) => <ProposalListItem key={proposal._id} proposal={proposal} />}
        emptyMessage="You have not submitted any proposals."
      />

      <ProjectSection
        title="Completed Projects"
        items={completedProjects}
        renderItem={(project) => <ProjectListItem key={project._id} project={project} />}
        emptyMessage="You have not completed any projects yet."
      />
    </div>
  );
};

export default FreelancerDashboard;