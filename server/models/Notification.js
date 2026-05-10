import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
     type: String,
     enum: [
       'new_like',
       'new_comment',
       'new_connection_request',
       'connection_accepted',
       'new_proposal',
       'new_invoice',
       'invoice_paid',
       'new_post', 
     ],
      required: true,
    },
    link: {
      type: String, 
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', NotificationSchema);
