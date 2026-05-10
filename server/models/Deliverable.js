import mongoose from 'mongoose';

const DeliverableSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending-review', 'approved', 'needs-revision'],
      default: 'pending-review',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Deliverable', DeliverableSchema);