import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Advanced Math Quiz",
  description: "A demo for advanced math quiz grading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-indigo-600 text-white p-4 w-full">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">Math Quiz Grader</div>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/advanced" className="hover:underline">
                Advanced Challenges
              </Link>
            </div>
          </div>
        </nav>
        <div className="w-full -mt-16">{children}</div>
      </body>
    </html>
  );
}
