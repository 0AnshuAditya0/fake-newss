"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { RecentAnalyses } from "@/components/RecentAnalyses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentAnalyses, getStats } from "@/lib/utils";
import { AnalysisResult, DashboardStats as StatsType } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsType>({
    totalAnalyses: 0,
    fakeDetected: 0,
    averageConfidence: 0,
    mostAnalyzedDomain: "N/A",
  });
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [globalChartData, setGlobalChartData] = useState<any[]>([]);

  useEffect(() => {
    // Load local stats and analyses
    const loadData = async () => {
      const loadedStats = await getStats();
      const loadedAnalyses = await getRecentAnalyses();

      setStats(loadedStats);
      setAnalyses(loadedAnalyses);

      // Calculate chart data from local analyses
      if (loadedAnalyses.length > 0) {
        const fakeCount = loadedAnalyses.filter(a => a.prediction === "FAKE").length;
        const realCount = loadedAnalyses.filter(a => a.prediction === "REAL").length;
        const uncertainCount = loadedAnalyses.filter(a => a.prediction === "UNCERTAIN").length;

        setChartData([
          { name: "Fake", value: fakeCount, color: "#EF4444" },
          { name: "Real", value: realCount, color: "#10B981" },
          { name: "Uncertain", value: uncertainCount, color: "#F59E0B" },
        ]);
      } else {
        setChartData([]);
      }
    };

    loadData();

    // Listen for cross-device sync updates
    const handleAnalysesUpdate = () => {
      loadData();
    };

    window.addEventListener('analysesUpdated', handleAnalysesUpdate);

    return () => {
      window.removeEventListener('analysesUpdated', handleAnalysesUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 py-8 sm:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            Your personal analysis statistics 📊
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <DashboardStats stats={stats} />
        </div>

        {/* Charts and Recent Analyses */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analysis Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 && chartData.some((d) => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300} className="sm:!h-[400px]">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={5}
                      className="sm:!outerRadius-[120] sm:!innerRadius-[60]"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '2px solid #4F46E5',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] sm:h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No data available yet</p>
                    <p className="text-sm mt-1">Start analyzing articles to see statistics</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Keywords/Domains */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Most Common Red Flags
                  </h4>
                  {analyses.length > 0 ? (
                    <div className="space-y-2">
                      {getTopFlags(analyses).map((flag, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-700">{flag.text}</span>
                          <span className="text-xs font-semibold text-gray-500">
                            {flag.count}x
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No data available</p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Average Scores by Signal
                  </h4>
                  {analyses.length > 0 ? (
                    <div className="space-y-2">
                      {getAverageSignals(analyses).map((signal, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">{signal.name}</span>
                            <span className="font-semibold">{signal.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{ width: `${signal.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No data available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses Table */}
        <RecentAnalyses analyses={analyses} limit={10} />
      </div>
    </div>
  );
}

function getTopFlags(analyses: AnalysisResult[]): Array<{ text: string; count: number }> {
  const flagCounts: Record<string, number> = {};

  analyses.forEach((analysis) => {
    analysis.flags.forEach((flag) => {
      flagCounts[flag] = (flagCounts[flag] || 0) + 1;
    });
  });

  return Object.entries(flagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([text, count]) => ({ text, count }));
}

function getAverageSignals(
  analyses: AnalysisResult[]
): Array<{ name: string; score: number }> {
  if (analyses.length === 0) return [];

  const totals = {
    mlScore: 0,
    sentimentScore: 0,
    clickbaitScore: 0,
    sourceScore: 0,
    biasScore: 0,
  };

  analyses.forEach((analysis) => {
    totals.mlScore += analysis.signals.mlScore;
    totals.sentimentScore += analysis.signals.sentimentScore;
    totals.clickbaitScore += analysis.signals.clickbaitScore;
    totals.sourceScore += analysis.signals.sourceScore;
    totals.biasScore += analysis.signals.biasScore;
  });

  const count = analyses.length;

  return [
    { name: "ML Model", score: Math.round(totals.mlScore / count) },
    { name: "Sentiment", score: Math.round(totals.sentimentScore / count) },
    { name: "Clickbait", score: Math.round(totals.clickbaitScore / count) },
    { name: "Source", score: Math.round(totals.sourceScore / count) },
    { name: "Bias", score: Math.round(totals.biasScore / count) },
  ];
}
