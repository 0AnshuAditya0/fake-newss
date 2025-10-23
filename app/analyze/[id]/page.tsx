"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CredibilityMeter } from "@/components/CredibilityMeter";
import { ResultCard } from "@/components/ResultCard";
import { TextHighlighter } from "@/components/TextHighlighter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/lib/types";
import { getAnalysisById, getRecentAnalyses, truncateText } from "@/lib/utils";
import {
  ArrowLeft,
  Share2,
  Download,
  RefreshCw,
  FileText,
  ExternalLink,
  BarChart3,
} from "lucide-react";

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [similarAnalyses, setSimilarAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalysis = async () => {
      const id = params.id as string;
    
    // First try to get from localStorage
    let analysis = getAnalysisById(id);

    if (!analysis) {
      // If not in localStorage, try to fetch from global API
      const fetchAnalysis = async () => {
        try {
          const response = await fetch("/api/global-stats");
          if (response.ok) {
            const data = await response.json();
            const globalAnalysis = data.recentAnalyses?.find((a: any) => a.id === id);
            
            if (globalAnalysis) {
              // Convert API response to AnalysisResult format
              const converted: AnalysisResult = {
                id: globalAnalysis.id,
                originalText: globalAnalysis.excerpt,
                prediction: globalAnalysis.prediction,
                confidence: globalAnalysis.confidence,
                overallScore: globalAnalysis.overallScore,
                flags: globalAnalysis.flags || [],
                signals: globalAnalysis.signals || {
                  mlScore: 50,
                  sentimentScore: 50,
                  clickbaitScore: 50,
                  sourceScore: 50,
                  biasScore: 50,
                },
                source: {
                  domain: globalAnalysis.domain,
                  credibility: "high" as const,
                },
                timestamp: globalAnalysis.timestamp,
                highlights: [],
                explanation: "Analysis from global database",
              };
              
              setResult(converted);
              
              // Get similar analyses
              const recent = (data.recentAnalyses || [])
                .filter((a: any) => a.id !== id)
                .slice(0, 3)
                .map((a: any) => ({
                  id: a.id,
                  originalText: a.excerpt,
                  prediction: a.prediction,
                  confidence: a.confidence,
                  overallScore: a.overallScore,
                  flags: a.flags || [],
                  signals: a.signals || {
                    mlScore: 50,
                    sentimentScore: 50,
                    clickbaitScore: 50,
                    sourceScore: 50,
                    biasScore: 50,
                  },
                  source: {
                    domain: a.domain,
                    credibility: "high" as const,
                  },
                  timestamp: a.timestamp,
                  highlights: [],
                  explanation: "",
                }));
              
              setSimilarAnalyses(recent);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error("Failed to fetch from global API:", error);
        }
        
        // If still not found, redirect
        router.push("/");
      };
      
      fetchAnalysis();
      return;
    }

    setResult(analysis);

    // Get similar analyses (last 3, excluding current)
    const recent = (await getRecentAnalyses())
      .filter((a) => a.id !== id)
      .slice(0, 3);
    setSimilarAnalyses(recent);

      setLoading(false);
    };

    loadAnalysis();
  }, [params.id, router]);

  const handleShare = async () => {
    if (!result) return;

    const shareData = {
      title: "Fake News Analysis Result",
      text: `Credibility Score: ${result.overallScore}/100 - ${result.prediction}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const reportContent = `
FAKE NEWS ANALYSIS REPORT
========================

Verdict: ${result.prediction}
Credibility Score: ${result.overallScore}/100
Confidence: ${result.confidence}%
Date: ${new Date(result.timestamp).toLocaleString()}

EXPLANATION:
${result.explanation}

SIGNAL BREAKDOWN:
- ML Model Score: ${result.signals.mlScore}%
- Sentiment Analysis: ${result.signals.sentimentScore}%
- Clickbait Detection: ${result.signals.clickbaitScore}%
- Source Credibility: ${result.signals.sourceScore}%
- Bias Detection: ${result.signals.biasScore}%

RED FLAGS:
${result.flags.map((flag) => `- ${flag}`).join("\n")}

${result.source ? `SOURCE: ${result.source.domain} (${result.source.credibility})` : ""}

ORIGINAL TEXT:
${result.originalText}
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-report-${result.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 py-8 sm:py-12 px-4 overflow-x-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-3 sm:mb-4 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-slate-800">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            Analysis Results
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            Detailed credibility analysis and breakdown
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Credibility Score & Signal Analysis Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Credibility Score */}
              <Card className="bg-white dark:bg-slate-900 border-indigo-200 dark:border-cyan-500/30">
                <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8">
                  <CredibilityMeter score={result.overallScore} size="lg" />
                </CardContent>
              </Card>

              {/* Signal Analysis - Compact */}
              <Card className="bg-white dark:bg-slate-900 border-indigo-200 dark:border-cyan-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Signal Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">ML Model</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{result.signals.mlScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          result.signals.mlScore < 40 ? 'bg-red-500' : result.signals.mlScore < 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${result.signals.mlScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Sentiment</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{result.signals.sentimentScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          result.signals.sentimentScore < 40 ? 'bg-red-500' : result.signals.sentimentScore < 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${result.signals.sentimentScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Clickbait</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{result.signals.clickbaitScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          result.signals.clickbaitScore < 40 ? 'bg-red-500' : result.signals.clickbaitScore < 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${result.signals.clickbaitScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Source</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{result.signals.sourceScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          result.signals.sourceScore < 40 ? 'bg-red-500' : result.signals.sourceScore < 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${result.signals.sourceScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Bias</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{result.signals.biasScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          result.signals.biasScore < 40 ? 'bg-red-500' : result.signals.biasScore < 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${result.signals.biasScore}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Result Details */}
            <ResultCard result={result} />

            {/* Text Analysis */}
            {result.highlights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Text Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Highlighted phrases indicate potential issues:
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-red-200 text-red-900 rounded">
                        Fake Indicators
                      </span>
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-900 rounded">
                        Bias
                      </span>
                      <span className="px-2 py-1 bg-indigo-200 text-indigo-900 dark:bg-cyan-200 dark:text-cyan-900 rounded">
                        Clickbait
                      </span>
                      <span className="px-2 py-1 bg-purple-200 text-purple-900 rounded">
                        Emotional Language
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg max-h-96 overflow-y-auto">
                    <TextHighlighter
                      text={truncateText(result.originalText, 1000)}
                      highlights={result.highlights}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Actions - Compact */}
            <Card className="bg-white dark:bg-slate-900 border-indigo-200 dark:border-cyan-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={handleShare}
                >
                  <Share2 className="w-3 h-3 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={handleDownload}
                >
                  <Download className="w-3 h-3 mr-2" />
                  Download
                </Button>
                <Link href="/" className="block">
                  <Button size="sm" className="w-full justify-start text-xs bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-500 dark:to-blue-600 hover:opacity-90">
                    <RefreshCw className="w-3 h-3 mr-2" />
                    New Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Similar Analyses */}
            {similarAnalyses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {similarAnalyses.map((analysis) => (
                    <Link
                      key={analysis.id}
                      href={`/analyze/${analysis.id}`}
                      className="block p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {analysis.overallScore}/100
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            analysis.prediction === "FAKE"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : analysis.prediction === "REAL"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {analysis.prediction}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {analysis.source?.domain ||
                          truncateText(analysis.originalText, 40)}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/30">
              <CardContent className="pt-6">
                <p className="text-sm text-indigo-900 dark:text-indigo-300">
                  <strong>Remember:</strong> This analysis is meant to assist your
                  judgment, not replace it. Always verify important information with
                  multiple trusted sources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
