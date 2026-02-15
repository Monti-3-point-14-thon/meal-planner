import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const ingredientSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String }, // e.g., "200g", "1 cup"
  },
  { _id: false }
);

const mealEditSchema = mongoose.Schema(
  {
    editedAt: { type: Date, required: true },
    instruction: { type: String, required: true },
    previousName: { type: String },
    previousMacros: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const mealSchema = mongoose.Schema(
  {
    dayPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayPlan",
      required: true,
    },

    type: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
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

    prepTimeMinutes: { type: Number, default: 30 },

    editHistory: [mealEditSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

mealSchema.plugin(toJSON);

// Index for fast day queries
mealSchema.index({ dayPlanId: 1, type: 1 });

export default mongoose.models.Meal || mongoose.model("Meal", mealSchema);
