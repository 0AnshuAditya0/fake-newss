"use client";

import React from "react";
import { Highlight } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TextHighlighterProps {
  text: string;
  highlights: Highlight[];
}

export function TextHighlighter({ text, highlights }: TextHighlighterProps) {
  if (highlights.length === 0) {
    return <p className="text-gray-700 leading-relaxed">{text}</p>;
  }

  // Create a map of text positions to highlights
  const highlightMap = new Map<string, Highlight>();
  highlights.forEach((h) => {
    highlightMap.set(h.text.toLowerCase(), h);
  });

  // Split text and highlight matches
  let result: React.ReactNode[] = [];
  let lastIndex = 0;
  const textLower = text.toLowerCase();

  // Find all highlight positions
  const positions: Array<{ start: number; end: number; highlight: Highlight }> = [];
  
  highlights.forEach((highlight) => {
    const searchText = highlight.text.toLowerCase();
    let index = textLower.indexOf(searchText);
    
    while (index !== -1 && positions.length < 20) {
      positions.push({
        start: index,
        end: index + searchText.length,
        highlight,
      });
      index = textLower.indexOf(searchText, index + 1);
    }
  });

  // Sort by position
  positions.sort((a, b) => a.start - b.start);

  // Remove overlapping highlights
  const filteredPositions = positions.filter((pos, i) => {
    if (i === 0) return true;
    return pos.start >= positions[i - 1].end;
  });

  // Build the result
  filteredPositions.forEach((pos, i) => {
    // Add text before highlight
    if (pos.start > lastIndex) {
      result.push(
        <span key={`text-${i}`}>{text.substring(lastIndex, pos.start)}</span>
      );
    }

    // Add highlighted text
    const highlightedText = text.substring(pos.start, pos.end);
    const colorClass = getHighlightColor(pos.highlight.type);

    result.push(
      <TooltipProvider key={`highlight-${i}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <mark
              className={`${colorClass} px-1 rounded cursor-help transition-all hover:opacity-80`}
            >
              {highlightedText}
            </mark>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">{pos.highlight.reason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    lastIndex = pos.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(<span key="text-end">{text.substring(lastIndex)}</span>);
  }

  return <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{result}</div>;
}

function getHighlightColor(type: Highlight["type"]): string {
  switch (type) {
    case "fake":
      return "bg-red-200 text-red-900";
    case "bias":
      return "bg-yellow-200 text-yellow-900";
    case "clickbait":
      return "bg-indigo-200 text-indigo-900 dark:bg-cyan-200 dark:text-cyan-900";
    case "sentiment":
      return "bg-purple-200 text-purple-900";
    default:
      return "bg-gray-200 text-gray-900";
  }
}
