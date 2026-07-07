import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NabhaVerse Studio Foundation",
  description: "Monorepo foundation scaffold for future NabhaVerse product development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
