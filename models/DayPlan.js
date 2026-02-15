import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const dayPlanSchema = mongoose.Schema(
  {
    weekPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeekPlan",
      required: true,
    },

    date: { type: Date, required: true }, // YYYY-MM-DD

    dailyTotals: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true }, // grams
      carbs: { type: Number, required: true }, // grams
      fat: { type: Number, required: true }, // grams
      fiber: { type: Number, required: true }, // grams
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

dayPlanSchema.plugin(toJSON);

// Virtuals: references to meals and snacks
dayPlanSchema.virtual("meals", {
  ref: "Meal",
  localField: "_id",
  foreignField: "dayPlanId",
});

dayPlanSchema.virtual("snacks", {
  ref: "Snack",
  localField: "_id",
  foreignField: "dayPlanId",
});

// Index for fast queries
dayPlanSchema.index({ weekPlanId: 1, date: 1 });

export default mongoose.models.DayPlan ||
  mongoose.model("DayPlan", dayPlanSchema);
