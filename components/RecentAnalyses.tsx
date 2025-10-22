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
        <div className="space-y-4">
          {displayAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getPredictionVariant(analysis.prediction) as any}>
                    {analysis.prediction}
                  </Badge>
                  <span className="text-sm font-semibold text-gray-900">
                    {analysis.overallScore}/100
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {analysis.source?.domain || truncateText(analysis.originalText, 60)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(analysis.timestamp)}
                </p>
              </div>
              <Link href={`/analyze/${analysis.id}`}>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
