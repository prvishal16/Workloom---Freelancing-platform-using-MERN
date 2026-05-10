import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDeliverablesForProject, uploadDeliverable } from '../services/api';
import { toast } from 'react-toastify';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Deliverables = ({ project }) => {
  const [deliverables, setDeliverables] = useState([]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchDeliverables = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDeliverablesForProject(project._id);
      setDeliverables(data);
    } catch (error) {
      toast.error('Could not fetch deliverables.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [project._id]);

  useEffect(() => {
    fetchDeliverables();
  }, [fetchDeliverables]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error('Please select a file to upload.');
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('deliverable', file);
    formData.append('description', description);

    try {
      await uploadDeliverable(project._id, formData);
      toast.success('Deliverable uploaded successfully!');
      setFile(null);
      setDescription('');
      if(document.getElementById('file-input')) {
        document.getElementById('file-input').value = null;
      }
      fetchDeliverables();
    } catch (error) {
      toast.error(error.message || 'File upload failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const freelancerId = project.freelancer?._id || project.freelancer;
  const isFreelancer = user?.role === 'freelancer' && user?._id === freelancerId;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Deliverables</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        {isFreelancer && (
          <form onSubmit={handleSubmit} className="mb-6 border-b pb-6">
            <h3 className="text-lg font-semibold mb-2">Submit New Deliverable</h3>
            <div className="mb-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional: Add a description for your file"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="2"
              ></textarea>
            </div>
            <div className="flex items-center gap-4">
              <input type="file" id="file-input" onChange={handleFileChange} className="flex-grow block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submitting ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Loading deliverables...</p>
        ) : deliverables.length === 0 ? (
          <p>No deliverables have been submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {deliverables.map((item) => (
              <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {item.fileUrl.split(/[/\\]/).pop()}
                  </a>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="text-right text-sm">
                  <p>by {item.submittedBy.name}</p>
                  <p className="text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Deliverables;