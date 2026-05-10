import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date, 
  },
  description: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model('Experience', ExperienceSchema);