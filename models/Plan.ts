import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cpu: {
    type: String,
    required: true,
  },
  gpu: {
    type: String,
    required: true,
  },
  ram: {
    type: String,
    required: true,
  },
  storage: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
