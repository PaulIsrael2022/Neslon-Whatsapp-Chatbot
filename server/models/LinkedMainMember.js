import mongoose from 'mongoose';

const linkedMainMemberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  medicalAidNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
}, {
  timestamps: true
});

// Indexes for efficient querying
linkedMainMemberSchema.index({ medicalAidNumber: 1 });
linkedMainMemberSchema.index({ lastName: 1, firstName: 1 });

const LinkedMainMember = mongoose.model("LinkedMainMember", linkedMainMemberSchema);

export default LinkedMainMember;