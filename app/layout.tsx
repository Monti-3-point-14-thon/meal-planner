import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutWrapper from "./components/navigation/LayoutWrapper";

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
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
