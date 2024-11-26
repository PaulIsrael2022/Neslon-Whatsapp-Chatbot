import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['WHATSAPP', 'EMAIL'],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipients: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED'],
        default: 'PENDING',
      },
      deliveredAt: Date,
      failureReason: String,
    }],
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: function() {
        return this.type === 'EMAIL';
      },
    },
    media: {
      data: Buffer,
      contentType: String,
      filename: String,
    },
    scheduledFor: {
      type: Date,
      default: Date.now,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      frequency: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
      },
      interval: Number, // e.g., every 2 days, every 3 weeks
      endDate: Date,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    template: {
      type: String, // Reference to a template ID if using predefined templates
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
notificationSchema.index({ 'recipients.user': 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ 'recipients.status': 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;