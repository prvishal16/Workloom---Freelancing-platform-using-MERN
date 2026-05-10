import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    getProjectById, 
    getTasksForProject, 
    createTask, 
    updateTaskStatus, 
    createReview, 
    submitProposal, 
    getMyProposals, 
    createInvoice, 
    checkUserReview, 
    createStripePaymentIntent,
    getReviewsForUser 
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import TaskBoard from "../components/TaskBoard.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";
import Deliverables from "../components/Deliverables.jsx";
import ProjectChat from "../components/ProjectChat.jsx";
import Billing from "../components/Billing.jsx";
import ProposalModal from "../components/ProposalModal.jsx";
import { MessageSquare, Clock, DollarSign, FileText, ListTodo, Briefcase, CheckCircle, LoaderCircle, Star } from "lucide-react";
import { motion } from 'framer-motion';

// --- HELPER COMPONENTS ---

const LeaveReviewForm = ({ project, onReviewSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const { user } = useAuth();
    const revieweeId = user._id === project.client._id ? project.freelancer?._id : project.client._id;
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!revieweeId) { return toast.error("Could not determine who to review."); }
      try {
        await createReview(project._id, { rating, comment, revieweeId });
        toast.success("Thank you for your review!");
        if (onReviewSubmit) onReviewSubmit();
      } catch (error) {
        toast.error(error.message || "Failed to submit review.");
      }
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6 my-8 text-left">
        <h3 className="font-bold text-xl mb-4">Leave a Review for {user._id === project.client._id ? project.freelancer.name : project.client.name}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Rating</label>
            <div className="flex">
              {[...Array(5)].map((_, i) => ( <button type="button" key={i} onClick={() => setRating(i + 1)} className="focus:outline-none"> <svg className={`w-8 h-8 ${i < rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.445a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.445a1 1 0 00-1.175 0l-3.366 2.445c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.073 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /> </svg> </button> ))}
            </div>
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." className="w-full p-2 border border-gray-300 rounded-md" rows="4" required />
          <button type="submit" className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Submit Review</button>
        </form>
      </div>
    );
};

const ReviewDisplayCard = ({ title, review }) => {
    if (!review) return null;
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h3 className="font-bold text-xl mb-2">{title}</h3>
            <div className="flex items-center my-2">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
            </div>
            <p className="text-gray-600 italic">"{review.comment}"</p>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { projectId } = useParams();
  const { user } = useAuth();

  const fetchProjectData = useCallback(async () => {
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);

      const isParticipant = user && (user._id === projectData.client._id || user._id === projectData.freelancer?._id);
      
      // Fetch all related data in parallel for efficiency
      const [reviewStatus, clientReviews, freelancerReviews, proposalsData, tasksData] = await Promise.all([
        checkUserReview(projectId),
        getReviewsForUser(projectData.client._id),
        projectData.freelancer?._id ? getReviewsForUser(projectData.freelancer._id) : Promise.resolve([]),
        user?.role === 'freelancer' ? getMyProposals() : Promise.resolve([]),
        (isParticipant && ["in-progress", "completed"].includes(projectData.status)) ? getTasksForProject(projectId) : Promise.resolve([])
      ]);
      
      // Combine all reviews and set them
      setReviews([...(clientReviews || []), ...(freelancerReviews || [])]);
      setHasReviewed(reviewStatus.hasReviewed);
      setTasks(tasksData || []);
      
      if (user?.role === 'freelancer') {
        setHasSubmitted(proposalsData.some(p => p.project._id === projectId));
      }
    } catch (err) {
      setError("Failed to fetch project details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId, user]);

  useEffect(() => {
    setLoading(true);
    fetchProjectData();
  }, [projectId]);

  const handleInitiatePayment = async () => {
    if (!project.invoice) return toast.error("No invoice found.");
    try {
      const { clientSecret } = await createStripePaymentIntent(project.invoice._id);
      setClientSecret(clientSecret);
    } catch (error) { toast.error(error.message || 'Could not initiate payment.'); }
  };

  const handlePaymentSuccess = () => {
    setIsProcessingPayment(true);
    setTimeout(async () => {
        await fetchProjectData();
        setIsProcessingPayment(false);
    }, 2500);
  };

  const handleReviewSubmit = async () => {
    await fetchProjectData();
    setHasReviewed(true);
  };

  const handleInvoiceCreate = async (amount) => {
    try {
      await createInvoice(projectId, { amount });
      toast.success('Invoice created successfully!');
      fetchProjectData();
    } catch (error) { toast.error(error.message || 'Failed to create invoice.'); }
  };
  
  const handleProposalSubmit = async (proposalData) => {
      try {
        await submitProposal(projectId, proposalData);
        toast.success("Your proposal has been submitted!");
        setIsProposalModalOpen(false);
        setHasSubmitted(true);
      } catch (error) { toast.error(error.message || "Failed to submit proposal."); }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
      try {
        await updateTaskStatus(projectId, taskId, newStatus);
        toast.success("Task status updated!");
        await fetchProjectData();
      } catch (error) { toast.error(error.message || "Failed to update task."); }
  };

  const handleCreateTask = async (title) => {
      try {
        await createTask(projectId, { title });
        toast.success("New task added!");
        setIsAddTaskModalOpen(false);
        await fetchProjectData();
      } catch (error) { toast.error(error.message || "Failed to add task."); }
  };

  if (loading) return <div className="text-center p-10">Loading Project...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!project) return <div className="text-center p-10">Project not found.</div>;

  const isProjectParticipant = user && (user._id === project.client._id || user._id === project.freelancer?._id);
  const otherParticipant = user?._id === project.client._id ? project.freelancer : project.client;
  const myReview = reviews.find(r => r.reviewer?._id === user?._id);
  const reviewOfMe = reviews.find(r => r.reviewee === user?._id && r.project === projectId);

  const TabButton = ({ tabName, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tabName
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
      title={label} 
    >
      <Icon size={16} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  const renderBillingContent = () => {
    if (isProcessingPayment) {
      return ( <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center bg-white p-8 rounded-lg shadow-md"> <LoaderCircle className="mx-auto h-12 w-12 text-blue-500 animate-spin" /> <p className="font-semibold text-lg mt-4">Processing payment...</p> <p className="text-gray-500">Please do not close this page.</p> </motion.div> );
    }
    if (project.status === 'completed') {
      return ( <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center bg-white p-8 rounded-lg shadow-md"> <CheckCircle className="mx-auto h-12 w-12 text-green-500" /> <h2 className="mt-4 text-2xl font-bold">Payment Complete!</h2> <p className="text-gray-600">The project is now complete.</p> </motion.div> );
    }
    return ( <Billing project={project} invoice={project.invoice} user={user} onInitiatePayment={handleInitiatePayment} clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess} onInvoiceCreate={handleInvoiceCreate} /> );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {isProjectParticipant ? (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <p className="text-sm text-gray-500">Project Workspace</p>
              <h1 className="text-4xl font-bold mt-1">{project.title}</h1>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
                <div className="flex items-center gap-2"><Clock size={16} /><span>Status: <span className="font-semibold capitalize">{project.status.replace("-", " ")}</span></span></div>
                <div className="flex items-center gap-2"><DollarSign size={16} /><span>Budget: <span className="font-semibold text-green-600">₹{project.budget}</span></span></div>
              </div>
              <div className="mt-4 border-t pt-4 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {project.client?.profilePictureUrl ? <img src={project.client.profilePictureUrl} alt={project.client.name} className="w-10 h-10 rounded-full ring-2 ring-white object-cover" /> : <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-600 ring-2 ring-white" title={project.client.name}>{project.client.name.charAt(0)}</div>}
                  {project.freelancer && ( project.freelancer.profilePictureUrl ? <img src={project.freelancer.profilePictureUrl} alt={project.freelancer.name} className="w-10 h-10 rounded-full ring-2 ring-white object-cover" /> : <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-600 ring-2 ring-white" title={project.freelancer.name}>{project.freelancer.name.charAt(0)}</div> )}
                </div>
              </div>
            </div>

            {project.status === "completed" && (
                <div>
                    { !hasReviewed && <LeaveReviewForm project={project} onReviewSubmit={handleReviewSubmit} /> }
                    { hasReviewed && <ReviewDisplayCard title="Your Submitted Review" review={myReview} /> }
                    <ReviewDisplayCard title={`Review from ${otherParticipant.name}`} review={reviewOfMe} />
                </div>
            )}
            
            <div className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-2">
              <TabButton tabName="overview" label="Overview" icon={Briefcase} />
              <TabButton tabName="tasks" label="Tasks" icon={ListTodo} />
              <TabButton tabName="deliverables" label="Deliverables" icon={FileText} />
              <TabButton tabName="billing" label="Billing & Payment" icon={DollarSign} />
            </div>
            <div>
              {activeTab === "overview" && ( <div className="bg-white rounded-lg shadow-md p-6 prose max-w-none"><h3 className="font-bold text-xl mb-2">Project Brief</h3><p>{project.description}</p></div> )}
              {activeTab === "tasks" && ( <div><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-xl">Task Board</h3><button onClick={() => setIsAddTaskModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm">+ Add Task</button></div><TaskBoard tasks={tasks} onStatusChange={handleTaskStatusChange} /></div> )}
              {activeTab === "deliverables" && ( <div><h3 className="font-bold text-xl mb-4">Deliverables</h3><Deliverables project={project} /></div> )}
              {activeTab === "billing" && renderBillingContent()}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
             <h1 className="text-4xl font-bold">{project.title}</h1>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-gray-600 border-b pb-4">
              <div className="flex items-center gap-2"><DollarSign size={16} /><span>Budget: <span className="font-semibold text-green-600">₹{project.budget}</span></span></div>
              <div className="flex items-center gap-2"><Briefcase size={16} /><span>Posted by: <Link to={`/profile/${project.client._id}`} className="font-semibold text-blue-600 hover:underline">{project.client.name}</Link></span></div>
            </div>
            {project.status === 'in-progress' && project.freelancer && ( <div className="my-6 text-center bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg"><p className="font-semibold">This project is currently in progress with <Link to={`/profile/${project.freelancer._id}`} className="font-bold hover:underline">{project.freelancer.name}</Link>.</p><p className="text-sm">Proposals are no longer being accepted.</p></div> )}
            {project.status === 'completed' && project.freelancer && ( <div className="my-6 text-center bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg"><p className="font-semibold">This project has been completed by <Link to={`/profile/${project.freelancer._id}`} className="font-bold hover:underline">{project.freelancer.name}</Link>.</p></div> )}
            <div className="prose max-w-none mt-6"><h3 className="font-bold text-xl mb-2">Project Description (Overview)</h3><p>{project.description}</p></div>
            <div className="mt-8 border-t pt-6 text-center">
              {user?.role === 'freelancer' && project.status === 'open' && !hasSubmitted && (<button onClick={() => setIsProposalModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg">Submit a Proposal</button>)}
              {user?.role === 'freelancer' && hasSubmitted && (<div className="inline-flex items-center gap-2 text-lg font-semibold text-gray-600 bg-gray-100 py-3 px-6 rounded-lg"><CheckCircle size={22} className="text-green-500" />Proposal Submitted</div>)}
            </div>
          </div>
        )}
      </div>
      
      {isProjectParticipant && otherParticipant && (
        <>
          <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-110 z-40" title={`Chat with ${otherParticipant.name}`}>
            <MessageSquare size={28} />
          </button>
          <ProjectChat project={project} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
      )}
      <AddTaskModal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)} onSubmit={handleCreateTask} />
      <ProposalModal isOpen={isProposalModalOpen} onClose={() => setIsProposalModalOpen(false)} onSubmit={handleProposalSubmit} projectTitle={project?.title} />
    </>
  );
};

export default ProjectDetail;