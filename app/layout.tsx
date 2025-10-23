import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fake News Detector - AI-Powered Misinformation Analysis",
  description:
    "Detect misinformation with AI-powered analysis. Analyze news articles and text for credibility using machine learning and multi-signal detection.",
  keywords: ["fake news", "fact check", "misinformation", "AI", "machine learning"],
  openGraph: {
    title: "Fake News Detector - AI-Powered Misinformation Analysis",
    description: "Detect misinformation with AI-powered analysis",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
          {/* Header */}
          <header className="border-b border-indigo-200 dark:border-cyan-500/30 bg-white/90 dark:bg-slate-900/90 sticky top-0 z-50 backdrop-blur-lg shadow-lg dark:shadow-cyan-500/10">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="relative">
                    <Shield className="w-7 h-7 sm:w-9 sm:h-9 text-indigo-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-indigo-600 dark:bg-cyan-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  </div>
                  <span className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-tight">
                    Fake News Detector
                  </span>
                </Link>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                  <Link
                    href="/"
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors duration-200 font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin"
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors duration-200 font-medium"
                  >
                    Stats
                  </Link>
                  <ThemeToggle />
                </div>

                {/* Mobile Navigation */}
                <MobileNav />
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-indigo-200 dark:border-cyan-500/30 bg-white/70 dark:bg-slate-900/70 mt-auto backdrop-blur-md">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-gray-700 dark:text-gray-300">
                <p className="text-sm font-medium">
                  © {new Date().getFullYear()} Fake News Detector. Built with Next.js 14 & Google Gemini AI.
                </p>
                <p className="text-xs mt-2 opacity-70">
                  Always verify important information with multiple trusted sources.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
