"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfileForm from "@/components/ProfileForm";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "loading") return;
      if (!session?.user) {
        router.push("/auth/signin");
        return;
      }

      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        } else if (response.status === 404) {
          // No profile, redirect to create
          router.push("/profile/create");
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [session, status, router]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const result = await response.json();
      setProfile(result.profile);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error: any) {
      throw error; // Let ProfileForm handle the error display
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-base-content/70">
            Changes will apply to future meal plans. Existing plans remain unchanged.
          </p>
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="toast toast-top toast-end">
            <div className="alert alert-success">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Profile updated successfully!</span>
            </div>
          </div>
        )}

        {/* Profile Form */}
        {profile && (
          <ProfileForm
            mode="edit"
            initialData={{
              biometrics: profile.biometrics,
              dietaryRestrictions: profile.dietaryRestrictions,
              foodPreferences: profile.foodPreferences,
              culturalCuisines: profile.culturalCuisines,
              location: profile.location,
            }}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
