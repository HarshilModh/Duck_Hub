// models/MissingRequest.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const missingRequestSchema = new Schema({
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemType:      { type: String, enum: ['Course','Department','Other'], required: true },
  itemName:      { type: String, required: true },
  description:   { type: String },
  status:        { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('MissingRequest', missingRequestSchema);
