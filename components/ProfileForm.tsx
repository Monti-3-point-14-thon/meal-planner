"use client";
import { useState } from "react";
import BiometricsInput from "@/app/components/BiometricsInput";
import CultureSelector from "@/app/components/CultureSelector";
import PreferencesInput from "@/app/components/PreferencesInput";
import RestrictionsInput from "@/app/components/RestrictionsInput";

interface UserProfileInput {
  biometrics: {
    weight: number;
    height: number;
    age: number;
    sex: "male" | "female";
  };
  dietaryRestrictions: string[];
  foodPreferences: {
    dislikes: string[];
  };
  culturalCuisines: string[];
  location: string;
}

interface ProfileFormProps {
  initialData?: UserProfileInput | null;
  onSubmit: (data: UserProfileInput) => Promise<void>;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export default function ProfileForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfileInput>(
    initialData || {
      biometrics: {
        weight: 0,
        height: 0,
        age: 0,
        sex: "male",
      },
      dietaryRestrictions: [],
      foodPreferences: {
        dislikes: [],
      },
      culturalCuisines: [],
      location: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate biometrics
    if (!formData.biometrics.weight || formData.biometrics.weight <= 0) {
      newErrors.weight = "Weight is required and must be positive";
    }
    if (!formData.biometrics.height || formData.biometrics.height <= 0) {
      newErrors.height = "Height is required and must be positive";
    }
    if (!formData.biometrics.age || formData.biometrics.age <= 0) {
      newErrors.age = "Age is required and must be positive";
    }
    if (!formData.biometrics.sex) {
      newErrors.sex = "Sex is required";
    }

    // Validate cuisines
    if (!formData.culturalCuisines || formData.culturalCuisines.length === 0) {
      newErrors.cuisines = "At least one cuisine must be selected";
    }

    // Validate location
    if (!formData.location || formData.location.trim() === "") {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setServerError(error.message || "Failed to save profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Server error display */}
      {serverError && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      {/* Biometrics Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Biometrics</h2>
          <BiometricsInput
            value={formData.biometrics}
            onChange={(biometrics) => setFormData({ ...formData, biometrics })}
            errors={errors}
          />
        </div>
      </div>

      {/* Cultural Preferences Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Cultural Preferences</h2>
          <CultureSelector
            value={{
              cuisines: formData.culturalCuisines,
              location: formData.location,
            }}
            onChange={(cultural) => {
              setFormData({
                ...formData,
                culturalCuisines: cultural.cuisines,
                location: cultural.location,
              });
            }}
            errors={{
              cuisines: errors.cuisines,
              location: errors.location,
            }}
          />
        </div>
      </div>

      {/* Food Preferences Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Food Preferences</h2>
          <p className="text-sm text-base-content/70 mb-4">
            What foods or ingredients do you prefer to avoid? (AI will avoid when possible)
          </p>
          <PreferencesInput
            value={formData.foodPreferences.dislikes}
            onChange={(dislikes) =>
              setFormData({
                ...formData,
                foodPreferences: { dislikes },
              })
            }
          />
        </div>
      </div>

      {/* Dietary Restrictions Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Dietary Restrictions</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Allergies and strict dietary requirements (AI will NEVER violate these)
          </p>
          <RestrictionsInput
            value={formData.dietaryRestrictions}
            onChange={(restrictions) =>
              setFormData({ ...formData, dietaryRestrictions: restrictions })
            }
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        {mode === "edit" && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
              Saving...
            </>
          ) : mode === "create" ? (
            "Create Profile"
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
