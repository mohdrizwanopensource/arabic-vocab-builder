import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arabic Vocab Builder | Flashcards",
  description: "Gentle, modern pastel flashcard web-app for learning vocabulary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#f7f5ee] text-[#2c3e38]">
        {children}
      </body>
    </html>
  );
}
