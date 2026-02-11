// Landing page with CTA to start meal planning
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Get Your Personalized Meal Plan</h1>
          <p className="py-6">
            Science-backed nutrition tailored to your goals, dietary restrictions,
            and cultural preferences. Created with AI, refined by you.
          </p>
          <Link href="/settings" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
