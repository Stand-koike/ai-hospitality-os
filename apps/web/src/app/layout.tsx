import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "藍 ai",
  description: "Guest-centered Hospitality OS — Phase 1 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
