import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const weekPlanSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },

    startDate: { type: Date, required: true }, // Start of week
    endDate: { type: Date, required: true }, // End of week

    primaryGoal: {
      type: String,
      enum: [
        "muscle_building",
        "weight_loss",
        "gut_health",
        "mental_performance",
        "general_health",
      ],
      required: true,
    },

    // Status: incomplete (1-day testing), complete (7-day full plan)
    status: {
      type: String,
      enum: ["incomplete", "complete"],
      default: "incomplete",
    },

    // Snapshot of profile at generation time (for historical accuracy)
    profileSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

weekPlanSchema.plugin(toJSON);

// Virtual: reference to dayPlans
weekPlanSchema.virtual("dayPlans", {
  ref: "DayPlan",
  localField: "_id",
  foreignField: "weekPlanId",
});

// Index for fast user queries
weekPlanSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.WeekPlan ||
  mongoose.model("WeekPlan", weekPlanSchema);
