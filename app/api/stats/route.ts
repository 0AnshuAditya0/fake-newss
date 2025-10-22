import { NextResponse } from "next/server";
import { getGeminiStats } from "@/lib/gemini-service";
import { getCacheStats } from "@/lib/cache";

/**
 * GET /api/stats
 * Returns API and cache statistics for monitoring
 */
export async function GET() {
  try {
    const apiStats = getGeminiStats();
    const cacheStats = getCacheStats();

    return NextResponse.json(
      {
        api: {
          totalCalls: apiStats.totalCalls,
          cacheHits: apiStats.cacheHits,
          apiCalls: apiStats.apiCalls,
          failures: apiStats.failures,
          cacheHitRate: apiStats.cacheHitRate,
          failureRate: apiStats.failureRate,
          lastError: apiStats.lastError,
          lastErrorTime: apiStats.lastErrorTime
            ? new Date(apiStats.lastErrorTime).toISOString()
            : null,
        },
        cache: {
          totalEntries: cacheStats.totalEntries,
          validEntries: cacheStats.validEntries,
          expiredEntries: cacheStats.expiredEntries,
          maxSize: cacheStats.maxSize,
          utilizationPercent: cacheStats.utilizationPercent,
          ttlMinutes: cacheStats.ttlMinutes,
        },
        health: {
          status: apiStats.failureRate === "0%" || parseFloat(apiStats.failureRate) < 50 
            ? "healthy" 
            : "degraded",
          message: apiStats.failures === 0
            ? "All systems operational"
            : `${apiStats.failures} API failures detected`,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Stats endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve stats" },
      { status: 500 }
    );
  }
}
