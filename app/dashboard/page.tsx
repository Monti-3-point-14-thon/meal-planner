import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import UserProfile from "@/models/UserProfile";
import WeekPlan from "@/models/WeekPlan";
import Link from "next/link";
import MealPlanCard from "@/app/components/MealPlanCard";

export default async function DashboardPage() {
  const session = await auth();

  // Protect route - redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user has a profile
  await connectMongo();
  const profile = await UserProfile.findOne({ userId: session.user.id }).lean();

  // If no profile, redirect to profile creation
  if (!profile) {
    redirect("/profile/create");
  }

  // Fetch recent 3 meal plans
  const recentPlans = await WeekPlan.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {session.user.name}!</h1>
            <p className="text-base-content/70 mt-1">Your personalized meal planning dashboard</p>
          </div>

          {/* User profile + sign out */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} />
                ) : (
                  <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{session.user.email}</span>
              </li>
              <li>
                <Link href="/settings/profile">Profile Settings</Link>
              </li>
              <li>
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="w-full text-left">Sign Out</button>
                </form>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content - Placeholder sections */}
        <div className="grid gap-6">
          {/* Quick actions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="flex gap-4 mt-4">
                <Link href="/generate" className="btn btn-primary">
                  Generate Meal Plan
                </Link>
                <Link href="/history" className="btn btn-outline">
                  View All Plans
                </Link>
              </div>
            </div>
          </div>

          {/* Recent plans */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Recent Meal Plans</h2>
                {recentPlans.length > 0 && (
                  <Link href="/history" className="btn btn-sm btn-ghost">
                    View All
                  </Link>
                )}
              </div>

              {recentPlans.length === 0 ? (
                <div className="py-8 text-center text-base-content/60">
                  <p>No meal plans yet. Let's create your first one!</p>
                  <p className="text-sm mt-2">Your profile is set up and ready to go!</p>
                  <Link href="/generate" className="btn btn-primary btn-sm mt-4">
                    Generate Your First Plan
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPlans.map((plan: any) => (
                    <MealPlanCard
                      key={plan._id.toString()}
                      plan={{
                        _id: plan._id.toString(),
                        startDate: plan.startDate,
                        endDate: plan.endDate,
                        primaryGoal: plan.primaryGoal,
                        status: plan.status,
                        createdAt: plan.createdAt,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile summary */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Your Profile</h2>
                <Link href="/settings/profile" className="btn btn-sm btn-ghost">
                  Edit
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-base-content/70">Weight</p>
                  <p className="font-semibold">{profile.biometrics.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Height</p>
                  <p className="font-semibold">{profile.biometrics.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Age</p>
                  <p className="font-semibold">{profile.biometrics.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Cuisines</p>
                  <p className="font-semibold">{profile.culturalCuisines.length} selected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
