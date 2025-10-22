import { AnalysisForm } from "@/components/AnalysisForm";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Shield, Zap, CheckCircle, BarChart3, Globe, Target } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-transparent py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full mb-6 backdrop-blur-sm border-2 border-indigo-300 dark:border-cyan-400 shadow-2xl">
              <Shield className="w-10 h-10 text-indigo-600 dark:text-cyan-400 animate-pulse" strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-white mb-6 drop-shadow-lg">
              Detect Misinformation with{" "}
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                AI-Powered Analysis
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 font-medium">
              Powered by <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">Google Gemini AI</span> with 90%+ accuracy.
              Verify news credibility in real-time and protect yourself from misinformation.
            </p>
          </div>

          {/* Analysis Form */}
          <AnalysisForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-colors duration-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
              Comprehensive analysis using Google Gemini AI and multiple detection methods
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl border-2 border-indigo-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-cyan-500/20 hover:scale-105 hover:border-indigo-400 dark:hover:border-cyan-400 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                AI-Powered Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Google Gemini AI analyzes factual accuracy, emotional manipulation, and misinformation patterns with 90%+ accuracy.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border-2 border-indigo-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-cyan-500/20 hover:scale-105 hover:border-indigo-400 dark:hover:border-cyan-400 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                Real-Time Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get instant credibility scores and intelligent explanations. Analyze articles by URL or paste text directly.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border-2 border-indigo-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-cyan-500/20 hover:scale-105 hover:border-indigo-400 dark:hover:border-cyan-400 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                Source Verification
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Cross-references sources and assesses domain credibility with comprehensive fact-checking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:bg-gradient-to-br dark:from-indigo-900/40 dark:to-purple-900/40">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-indigo-200 dark:border-cyan-500/30">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">5+</div>
              <div className="text-gray-800 dark:text-white font-bold text-lg">Detection Signals</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Multiple analysis methods
              </p>
            </div>

            <div className="p-8 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-indigo-200 dark:border-cyan-500/30">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">90%+</div>
              <div className="text-gray-800 dark:text-white font-bold text-lg">Accuracy Rate</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Using Google Gemini AI
              </p>
            </div>

            <div className="p-8 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-indigo-200 dark:border-cyan-500/30">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">&lt;3s</div>
              <div className="text-gray-800 dark:text-white font-bold text-lg">Avg Response Time</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Lightning-fast analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Simple, fast, and accurate fake news detection
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Submit Content</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enter a URL or paste text to analyze
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Gemini AI processes and analyzes content
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Get Results</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Receive credibility score and detailed report
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Make Decisions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use insights to verify information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-500 dark:to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Fight Misinformation?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start analyzing news articles and protect yourself from fake news today.
          </p>
          <ScrollToTopButton />
        </div>
      </section>
    </div>
  );
}
