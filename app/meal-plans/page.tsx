// Meal plan history page - Browse all past meal plans

import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import WeekPlan from "@/models/WeekPlan";
import Link from "next/link";
import MealPlanCard from "@/app/components/MealPlanCard";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const session = await auth();

  // Protect route
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Parse page number (await searchParams in Next.js 15)
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  // Fetch meal plans from MongoDB
  await connectMongo();

  const totalPlans = await WeekPlan.countDocuments({ userId: session.user.id });
  const weekPlans = await WeekPlan.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Calculate pagination
  const totalPages = Math.ceil(totalPlans / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-8 bg-base-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Meal Plan History</h1>
          <p className="text-base-content/70">
            Browse all your personalized meal plans
          </p>
        </div>

        {/* Empty State */}
        {totalPlans === 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-bold mb-2">No meal plans yet</h2>
              <p className="text-base-content/70 mb-6">
                You haven't generated any meal plans yet. Let's create your
                first one!
              </p>
              <Link href="/generate" className="btn btn-primary">
                Create Your First Meal Plan
              </Link>
            </div>
          </div>
        )}

        {/* Plans List */}
        {totalPlans > 0 && (
          <>
            <div className="grid gap-4 mb-8">
              {weekPlans.map((plan: any) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {hasPrevPage && (
                  <Link
                    href={`/history?page=${page - 1}`}
                    className="btn btn-outline"
                  >
                    ← Previous
                  </Link>
                )}

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/history?page=${pageNum}`}
                        className={`btn btn-sm ${
                          pageNum === page ? "btn-primary" : "btn-ghost"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    )
                  )}
                </div>

                {hasNextPage && (
                  <Link
                    href={`/history?page=${page + 1}`}
                    className="btn btn-outline"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}

            {/* Summary */}
            <div className="text-center mt-4 text-sm text-base-content/70">
              Showing {skip + 1}-{Math.min(skip + limit, totalPlans)} of{" "}
              {totalPlans} plans
            </div>
          </>
        )}
      </div>
    </div>
  );
}
