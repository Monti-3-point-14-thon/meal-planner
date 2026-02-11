import SettingsForm from '../components/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Create Your Health Profile</h1>
        <p className="text-lg text-base-content/70">
          Tell us about yourself so we can create a personalized meal plan tailored to your goals.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
