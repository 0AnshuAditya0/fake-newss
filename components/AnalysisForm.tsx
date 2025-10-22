"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Link as LinkIcon, FileText, Clipboard } from "lucide-react";
import { isValidUrl } from "@/lib/utils";
import { saveAnalysis } from "@/lib/utils";

export function AnalysisForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (activeTab === "url") {
      if (!url.trim()) {
        setError("Please enter a URL");
        return;
      }
      if (!isValidUrl(url)) {
        setError("Please enter a valid URL (must start with http:// or https://)");
        return;
      }
    } else {
      if (!text.trim()) {
        setError("Please enter some text to analyze");
        return;
      }
      if (text.trim().length < 50) {
        setError("Text must be at least 50 characters long");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: activeTab === "url" ? url : undefined,
          text: activeTab === "text" ? text : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      // Save to localStorage
      saveAnalysis(data);

      // Navigate to results page
      router.push(`/analyze/${data.id}`);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg bg-white dark:bg-slate-900 border-indigo-200 dark:border-cyan-500/30">
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Analyze URL
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Analyze Text
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="url" className="space-y-4">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Enter Article URL
                </label>
                <input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-400 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Enter the URL of a news article or blog post to analyze
                </p>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="text"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Enter Text to Analyze
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handlePasteFromClipboard}
                    className="flex items-center gap-1"
                  >
                    <Clipboard className="w-3 h-3" />
                    Paste
                  </Button>
                </div>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the article text here..."
                  rows={8}
                  maxLength={5000}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-400 focus:border-transparent outline-none transition resize-none"
                  disabled={loading}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minimum 50 characters, maximum 5000 characters
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {text.length} / 5000
                  </p>
                </div>
              </div>
            </TabsContent>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-6"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Now"
              )}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
