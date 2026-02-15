import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const userProfileSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1:1 relationship with User
    },

    // Biometrics
    biometrics: {
      weight: { type: Number, required: true }, // kg
      height: { type: Number, required: true }, // cm
      age: { type: Number, required: true },
      sex: { type: String, enum: ["male", "female"], required: true },
    },

    // Dietary restrictions (hard restrictions - MUST follow)
    dietaryRestrictions: [{ type: String }], // e.g., ["Gluten-free", "Dairy-free"]

    // Food preferences (soft preferences - avoid when possible)
    foodPreferences: {
      dislikes: [{ type: String }], // e.g., ["mushrooms", "cilantro"]
    },

    // Cultural cuisines
    culturalCuisines: [{ type: String }], // e.g., ["Italian", "Japanese", "Mexican"]

    // Location
    location: { type: String }, // e.g., "Netherlands"

    // Flexible fields for future expansion (wife's input)
    trainingContext: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    healthContext: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userProfileSchema.plugin(toJSON);

// Virtual: reference to weekPlans (for future queries)
userProfileSchema.virtual("weekPlans", {
  ref: "WeekPlan",
  localField: "_id",
  foreignField: "userProfileId",
});

export default mongoose.models.UserProfile ||
  mongoose.model("UserProfile", userProfileSchema);
