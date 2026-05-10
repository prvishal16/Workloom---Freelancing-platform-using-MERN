import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['client', 'freelancer'], required: true },
  
  tagline: { type: String, default: '', trim: true }, 
  bio: { type: String, default: '' },
  profilePictureUrl: { type: String, default: '' },
  location: { type: String, default: '', trim: true }, 
  website: { type: String, default: '', trim: true },
  
  skills: { type: [String], default: [] },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

}, { 
    timestamps: true 
});

UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
}

export default mongoose.model('User', UserSchema);