"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/lib/types";
import { formatDate, truncateText } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface RecentAnalysesProps {
  analyses: AnalysisResult[];
  limit?: number;
}

export function RecentAnalyses({ analyses, limit = 10 }: RecentAnalysesProps) {
  const displayAnalyses = analyses.slice(0, limit);

  if (displayAnalyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No analyses yet. Start by analyzing your first article!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPredictionVariant = (prediction: string) => {
    switch (prediction) {
      case "FAKE":
        return "danger";
      case "REAL":
        return "success";
      default:
        return "warning";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Analyses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 overflow-x-hidden w-full">
          {displayAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition gap-2 w-full"
            >
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <Badge variant={getPredictionVariant(analysis.prediction) as any} className="w-fit text-xs sm:text-sm">
                    {analysis.prediction}
                  </Badge>
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    {analysis.overallScore}/100
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
                  {analysis.source?.domain || truncateText(analysis.originalText, 50)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatDate(analysis.timestamp)}
                </p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <Link href={`/analyze/${analysis.id}`} className="w-full sm:w-auto">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
