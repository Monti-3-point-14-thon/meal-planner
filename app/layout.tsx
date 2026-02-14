import { Inter } from "next/font/google";
import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Meal Planner - Science-Based Personalized Nutrition",
  description: "Get personalized meal plans tailored to your health goals, dietary restrictions, and cultural preferences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" data-scroll-behavior="smooth">
      <body className={font.className}>
        <main className="min-h-screen bg-base-200">
          {children}
        </main>
      </body>
    </html>
  );
}
