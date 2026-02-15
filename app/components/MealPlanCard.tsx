import Link from "next/link";

interface MealPlanCardProps {
  plan: {
    _id: string;
    startDate: string;
    endDate: string;
    primaryGoal: string;
    status?: string;
    createdAt: string;
  };
}

export default function MealPlanCard({ plan }: MealPlanCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link
      href={`/meal-plan/${plan._id}`}
      className="card bg-base-100 shadow hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title">
              {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
            </h2>
            <p className="text-sm text-base-content/70">
              Created {formatDate(plan.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-primary">
              {plan.primaryGoal.replace(/_/g, " ")}
            </span>
            {plan.status === "incomplete" && (
              <span className="badge badge-warning">1-Day Test</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
