import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, index: true },
  message: { type: String, default: '' },
  url: { type: String, default: '' },
  overall_risk: { type: Number, required: true },
  risk_level: { type: String, required: true },
  badge_color: { type: String, default: 'amber' },
  msg_risk: { type: Number, default: null },
  url_risk: { type: Number, default: null },
  msg_highlights: [
    {
      category: String,
      evidence: [String]
    }
  ],
  url_reasons: [
    {
      title: String,
      detail: String
    }
  ],
  recommendations: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Scan', scanSchema);
