import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    lines: {
      type: Number,
      required: true,
      integer: true,
    },
    bet: {
      type: Number,
      required: true,
    },
    spin_type: {
      type: Number,
      required: true,
      integer: true,
      default: 1,
    },
    pay_lines: {
      type: [Number],
      integer: true,
      required: true,
    },
    winning: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const userHistorySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  histories: [historySchema],
}, { timestamps: true });

export default mongoose.model('User_history', userHistorySchema);
