import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "LaborLink",
    template: "%s | LaborLink",
  },
  description:
    "Hire reliable local workers for moving, cleaning, landscaping, handyman jobs, and more.",
  keywords: [
    "LaborLink",
    "Local Labor",
    "Handyman",
    "Moving Help",
    "Cleaning",
    "Workers",
    "Gig Jobs",
  ],
  metadataBase: new URL("https://laborlink.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}