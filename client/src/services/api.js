import axios from 'axios';

const handleError = (error) => {
  const detailedError = error.response?.data?.details;
  if (detailedError) {
      console.error("API Error Details:", detailedError);
      throw new Error(detailedError); 
  }
  
  const message = error.response?.data?.error || error.response?.data?.message || error.message;
  console.error("API Error:", message);
  throw new Error(message);
};


export const createProject = async (projectData) => {
  try {
    const res = await axios.post('/api/projects', projectData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getOpenProjects = async () => {
  try {
    const res = await axios.get('/api/projects');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProjectById = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const submitProposal = async (projectId, proposalData) => {
  try {
    const res = await axios.post(`/api/projects/${projectId}/proposals`, proposalData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProposalsForProject = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/proposals`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateProposalStatus = async (proposalId, status) => {
  try {
    const res = await axios.patch(`/api/proposals/${proposalId}`, { status });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMyProjects = async () => {
  try {
    const res = await axios.get('/api/projects/my');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const getTasksForProject = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/tasks`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createTask = async (projectId, taskData) => {
  try {
    const res = await axios.post(`/api/projects/${projectId}/tasks`, taskData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateTaskStatus = async (projectId, taskId, status) => {
  try {
    const res = await axios.patch(`/api/projects/${projectId}/tasks/${taskId}`, { status });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const getDeliverablesForProject = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/deliverables`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const uploadDeliverable = async (projectId, formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const res = await axios.post(`/api/projects/${projectId}/deliverables`, formData, config);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMessages = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/messages`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createPost = async (postData) => {
  try {
    const res = await axios.post('/api/posts', postData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllPosts = async () => {
  try {
    const res = await axios.get('/api/posts');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const likePost = async (postId) => {
  try {
    const res = await axios.post(`/api/posts/${postId}/like`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const addComment = async (postId, commentData) => {
  try {
    const res = await axios.post(`/api/posts/${postId}/comment`, commentData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const res = await axios.get(`/api/users/${userId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const sendConnectionRequest = async (userId) => {
  try {
    const res = await axios.post(`/api/users/${userId}/connect`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPendingRequests = async () => {
  try {
    const res = await axios.get('/api/connections/pending');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const respondToRequest = async (connectionId, status) => {
  try {
    const res = await axios.patch(`/api/connections/${connectionId}`, { status });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getConnectionStatus = async (userId) => {
  try {
    const res = await axios.get(`/api/users/${userId}/connection-status`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMyProposals = async () => {
  try {
    const res = await axios.get('/api/proposals/my');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const searchAll = async (query) => {
  try {
    const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const startConversation = async (recipientId) => {
  try {
    const res = await axios.post('/api/conversations', { recipientId });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getConversations = async () => {
  try {
    const res = await axios.get('/api/conversations');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMessagesForConversation = async (conversationId) => {
  try {
    const res = await axios.get(`/api/conversations/${conversationId}/messages`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const sendDirectMessage = async (conversationId, content) => {
    try {
        const res = await axios.post(`/api/conversations/${conversationId}/messages`, { content });
        return res.data;
    } catch (error) {
        handleError(error);
    }
};

export const getMyConnections = async () => {
  try {
    const res = await axios.get('/api/connections');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getNotifications = async () => {
  try {
    const res = await axios.get('/api/notifications');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const markNotificationsAsRead = async () => {
  try {
    const res = await axios.patch('/api/notifications/read');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUnreadNotificationCount = async () => {
  try {
      const res = await axios.get('/api/notifications/unread-count');
      return res.data;
  } catch (error) {
      handleError(error);
  }
};
export const getProjectMessages = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/project-messages`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getReviewsForUser = async (userId) => {
  try {
    const res = await axios.get(`/api/users/${userId}/reviews`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createReview = async (projectId, reviewData) => {
  try {
    const res = await axios.post(`/api/projects/${projectId}/reviews`, reviewData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getInvoiceForProject = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/invoices`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createInvoice = async (projectId, invoiceData) => {
  try {
    const res = await axios.post(`/api/projects/${projectId}/invoices`, invoiceData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createStripePaymentIntent = async (invoiceId) => {
  try {
    const res = await axios.post('/api/payments/create-payment-intent', { invoiceId });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyPayment = async (paymentData) => {
    try {
        const res = await axios.post('/api/payments/verify', paymentData);
        return res.data;
    } catch (error) {
        handleError(error);
    }
};

export const changePassword = async (passwordData) => {
  try {
    const res = await axios.patch('/api/users/me/change-password', passwordData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteAccount = async () => {
  try {
    const res = await axios.delete('/api/users/me');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateMe = async (userData) => {
  try {
    const res = await axios.patch('/api/users/me', userData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getExperienceForUser = async (userId) => {
  try {
    const res = await axios.get(`/api/experience/user/${userId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const addExperience = async (experienceData) => {
  try {
    const res = await axios.post('/api/experience', experienceData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteExperience = async (id) => {
  try {
    const res = await axios.delete(`/api/experience/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getEducationForUser = async (userId) => {
  try {
    const res = await axios.get(`/api/education/user/${userId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const addEducation = async (educationData) => {
  try {
    const res = await axios.post('/api/education', educationData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteEducation = async (id) => {
  try {
    const res = await axios.delete(`/api/education/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const uploadProfilePicture = async (formData) => {
  try {
    const res = await axios.post('/api/users/me/avatar', formData);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const checkUserReview = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}/reviews/me`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};