import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const ingredientSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String }, // e.g., "200g", "1 cup"
  },
  { _id: false }
);

const snackEditSchema = mongoose.Schema(
  {
    editedAt: { type: Date, required: true },
    instruction: { type: String, required: true },
    previousName: { type: String },
    previousMacros: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const snackSchema = mongoose.Schema(
  {
    dayPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayPlan",
      required: true,
    },

    type: {
      type: String,
      enum: ["morning_snack", "afternoon_snack", "evening_snack"],
      required: true,
    },

    name: { type: String, required: true },

    ingredients: [ingredientSchema],

    instructions: { type: String },

    macros: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
      fiber: { type: Number, required: true },
    },

    nutritionalReasoning: { type: String },

    scientificSources: [{ type: String }], // URLs

    // Snack-specific fields
    portability: {
      type: String,
      enum: ["portable", "semi_portable", "not_portable"],
      default: "portable",
    },

    prepTimeMinutes: { type: Number, default: 10 },

    idealTiming: { type: String }, // e.g., "2 hours before workout"

    editHistory: [snackEditSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

snackSchema.plugin(toJSON);

// Index for fast day queries
snackSchema.index({ dayPlanId: 1, type: 1 });

export default mongoose.models.Snack || mongoose.model("Snack", snackSchema);
