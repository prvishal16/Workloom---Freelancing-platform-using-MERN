import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProposalsForProject, updateProposalStatus, getProjectById } from '../services/api';
import { Check, X } from 'lucide-react';

const ViewProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectData, proposalsData] = await Promise.all([
        getProjectById(projectId),
        getProposalsForProject(projectId)
      ]);
      setProject(projectData);
      setProposals(proposalsData);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResponse = async (proposalId, status) => {
    try {
      await updateProposalStatus(proposalId, status);
      toast.success(`Proposal has been ${status}!`);
      navigate('/client'); 
    } catch (err) {
      toast.error(err.message || 'Failed to update proposal.');
    }
  };

  if (loading) return <div className="text-center p-10">Loading proposals...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-gray-500">Proposals for project:</p>
        <h1 className="text-3xl font-bold">{project?.title}</h1>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">No Proposals Yet</h2>
          <p className="text-gray-500 mt-2">Check back later to see submissions from freelancers.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal._id}
              proposal={proposal}
              onRespond={handleResponse}
              isProjectOpen={project?.status === 'open'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProposalCard = ({ proposal, onRespond, isProjectOpen }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <Link to={`/profile/${proposal.freelancer._id}`} className="text-xl font-bold text-gray-900 hover:text-blue-600">
                    {proposal.freelancer.name}
                </Link>
                <p className="text-sm text-gray-500">Submitted a proposal</p>
            </div>
            <span className="text-2xl font-bold text-green-600">${proposal.bidAmount}</span>
        </div>
        <div className="prose prose-sm max-w-none mt-4 text-gray-700 whitespace-pre-wrap">
            <p>{proposal.coverLetter}</p>
        </div>
      </div>
      
      {isProjectOpen && (
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4">
          <button
            onClick={() => onRespond(proposal._id, 'declined')}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            <X size={18} /> Decline
          </button>
          <button
            onClick={() => onRespond(proposal._id, 'accepted')}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            <Check size={18} /> Accept & Hire
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewProposals;