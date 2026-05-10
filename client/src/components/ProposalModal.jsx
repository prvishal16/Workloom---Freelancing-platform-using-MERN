import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const ProposalModal = ({ isOpen, onClose, onSubmit, projectTitle }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverLetter || !bidAmount) {
      alert('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ coverLetter, bidAmount: Number(bidAmount) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl z-50 overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit a Proposal</h2>
            <p className="text-sm text-gray-500 mt-1">For project: <span className="font-semibold">{projectTitle}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
                <div>
                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Bid Amount (in Rupees)
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-xl">₹</span>
                        <input
                            id="bidAmount"
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="e.g., 4000"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter
                    </label>
                    <textarea
                        id="coverLetter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="8"
                        placeholder="Introduce yourself and explain why you're the best fit for this project. The client will see your profile along with this proposal."
                        required
                    ></textarea>
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 font-semibold"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
            </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProposalModal;

