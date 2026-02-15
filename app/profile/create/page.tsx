"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProfileForm from "@/components/ProfileForm";

export default function ProfileCreatePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // Check if profile already exists
  useEffect(() => {
    const checkProfile = async () => {
      if (status === "loading") return;
      if (!session?.user) {
        router.push("/auth/signin");
        return;
      }

      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          // Profile exists, redirect to dashboard
          router.push("/dashboard");
        } else if (response.status === 404) {
          // No profile, stay on this page
          setIsCheckingProfile(false);
        } else {
          throw new Error("Failed to check profile");
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [session, status, router]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create profile");
      }

      // Success! Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setIsLoading(false);
      throw error; // Let ProfileForm handle the error display
    }
  };

  if (status === "loading" || isCheckingProfile) {
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome! Let's set up your profile</h1>
          <p className="text-base-content/70">
            We need a few details to personalize your meal plans
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <ul className="steps w-full">
            <li className="step step-primary">Sign In</li>
            <li className="step step-primary">Profile Setup</li>
            <li className="step">Generate Meal Plan</li>
          </ul>
        </div>

        {/* Profile Form */}
        <ProfileForm
          mode="create"
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* Optional skip (not recommended) */}
        <div className="text-center mt-6">
          <p className="text-sm text-base-content/60">
            Note: Profile setup is required to generate personalized meal plans
          </p>
        </div>
      </div>
    </div>
  );
}
