"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnalysisResult } from "@/lib/types";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Target,
  MessageSquare,
  Link as LinkIcon,
  BarChart3,
} from "lucide-react";

interface ResultCardProps {
  result: AnalysisResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const getPredictionIcon = () => {
    switch (result.prediction) {
      case "FAKE":
        return <AlertTriangle className="w-6 h-6" />;
      case "REAL":
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <HelpCircle className="w-6 h-6" />;
    }
  };

  const getPredictionColor = () => {
    switch (result.prediction) {
      case "FAKE":
        return "danger";
      case "REAL":
        return "success";
      default:
        return "warning";
    }
  };

  const getSignalColor = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Verdict Section */}
      <Card className="bg-white dark:bg-slate-900 border-indigo-200 dark:border-cyan-500/30">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
              {getPredictionIcon()}
              Analysis Verdict
            </CardTitle>
            <Badge variant={getPredictionColor() as any} className="text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 w-fit">
              {result.prediction}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Confidence Level</span>
                <span className="text-sm font-bold">{result.confidence}%</span>
              </div>
              <Progress value={result.confidence} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.explanation}</p>
        </CardContent>
      </Card>

      {/* Red Flags */}
      {result.flags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Red Flags Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.flags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{flag}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Source Info */}
      {result.source && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Source Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{result.source.domain}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Credibility: {result.source.credibility.toUpperCase()}
                </p>
              </div>
              <Badge
                variant={
                  result.source.credibility === "high"
                    ? "success"
                    : result.source.credibility === "low"
                    ? "danger"
                    : "warning"
                }
              >
                {result.source.credibility}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
