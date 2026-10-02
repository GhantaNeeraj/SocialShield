import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  name: { type: String, required: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', accountSchema);
