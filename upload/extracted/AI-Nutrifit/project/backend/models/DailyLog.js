import mongoose from "mongoose";

// Declarative definition mapping chronological time-series tracking parameters
const DailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Foreign key reference linkage to the root User model instance
      required: true,
      index: true, // Enforces fast lookup sequences across heavy clustering environments
    },
    date: {
      type: String, // Stored as explicit YYYY-MM-DD string indicators to avoid international timezone offsets
      required: true,
    },
    steps: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Enforces a compound unique index constraint, neutralizing duplicate logging records for a single day
DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyLog", DailyLogSchema);
