import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postType: {
      type: String,
      enum: ['text', 'job', 'showcase'],
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    content: {
      text: { type: String },
      imageUrl: { type: String },
      jobTitle: { type: String },
      jobDescription: { type: String },
      jobBudget: { type: Number },
    },
    hashtags: { 
    type: [String], 
    index: true 
  },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [{
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);