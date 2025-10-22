import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnalysisResult, DashboardStats } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// LocalStorage utilities for data persistence
export function saveAnalysis(analysis: AnalysisResult): void {
  if (typeof window === "undefined") return;
  
  try {
    const existing = getRecentAnalyses();
    const updated = [analysis, ...existing].slice(0, 50); // Keep last 50
    localStorage.setItem("analyses", JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save analysis:", error);
  }
}

export function getRecentAnalyses(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem("analyses");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get analyses:", error);
    return [];
  }
}

export function getAnalysisById(id: string): AnalysisResult | null {
  const analyses = getRecentAnalyses();
  return analyses.find((a) => a.id === id) || null;
}

export function getStats(): DashboardStats {
  const analyses = getRecentAnalyses();
  
  if (analyses.length === 0) {
    return {
      totalAnalyses: 0,
      fakeDetected: 0,
      averageConfidence: 0,
      mostAnalyzedDomain: "N/A",
    };
  }

  const fakeCount = analyses.filter((a) => a.prediction === "FAKE").length;
  const totalConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0);
  
  // Find most analyzed domain
  const domainCounts: Record<string, number> = {};
  analyses.forEach((a) => {
    if (a.source?.domain) {
      domainCounts[a.source.domain] = (domainCounts[a.source.domain] || 0) + 1;
    }
  });
  
  const mostAnalyzedDomain = Object.keys(domainCounts).length > 0
    ? Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0][0]
    : "N/A";

  return {
    totalAnalyses: analyses.length,
    fakeDetected: Math.round((fakeCount / analyses.length) * 100),
    averageConfidence: Math.round(totalConfidence / analyses.length),
    mostAnalyzedDomain,
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getCredibilityColor(score: number): string {
  if (score < 40) return "text-red-600";
  if (score < 70) return "text-yellow-600";
  return "text-green-600";
}

export function getCredibilityBgColor(score: number): string {
  if (score < 40) return "bg-red-100";
  if (score < 70) return "bg-yellow-100";
  return "bg-green-100";
}

export function getCredibilityLabel(score: number): string {
  if (score < 40) return "High Risk";
  if (score < 70) return "Medium Risk";
  return "Low Risk";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "");
  } catch {
    return "";
  }
}
