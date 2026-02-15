import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  // Redirect based on authentication status
  if (session?.user) {
    redirect("/dashboard");
  } else {
    redirect("/auth/signin");
  }
}
