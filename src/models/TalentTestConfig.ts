import mongoose from 'mongoose';

const TalentTestConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Precision Baseline Assessment',
  },
  description: {
    type: String,
    required: true,
    default: 'Comprehensive diagnostic test to identify student strengths and areas for improvement',
  },
  price: {
    type: Number,
    required: true,
    default: 100,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  duration: {
    type: String,
    default: '45 minutes',
  },
  subjects: {
    type: [String],
    default: ['Mathematics', 'Science', 'English'],
  },
  features: {
    type: [String],
    default: [
      'Detailed diagnostic report',
      'Personalized learning recommendations',
      'Subject-wise performance analysis',
      'Instant results delivery via email',
    ],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const TalentTestConfig = mongoose.models.TalentTestConfig || mongoose.model('TalentTestConfig', TalentTestConfigSchema);

export default TalentTestConfig;
