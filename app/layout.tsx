import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lawly — Legal help, made simple.",
  description:
    "Describe your problem. Lawly explains your rights, gives you a step-by-step timeline, and creates the letter you can send. Free, for Quebec residents.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
