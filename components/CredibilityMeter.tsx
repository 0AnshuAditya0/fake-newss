"use client";

import React, { useEffect, useState } from "react";
import { getCredibilityColor, getCredibilityLabel } from "@/lib/utils";

interface CredibilityMeterProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function CredibilityMeter({ score, size = "md" }: CredibilityMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate the score
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getColor = (score: number) => {
    if (score < 40) return "#EF4444"; // red
    if (score < 70) return "#F59E0B"; // yellow
    return "#10B981"; // green
  };

  // Responsive sizes - smaller on mobile
  const radius = size === "lg" ? 90 : size === "md" ? 70 : 50;
  const strokeWidth = size === "lg" ? 10 : size === "md" ? 8 : 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const textSize = size === "lg" ? "text-3xl sm:text-4xl md:text-5xl" : size === "md" ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl";
  const labelSize = size === "lg" ? "text-base sm:text-lg" : size === "md" ? "text-sm sm:text-base" : "text-xs sm:text-sm";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={getColor(displayScore)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            style={{
              strokeDashoffset,
              transition: "stroke-dashoffset 0.3s ease",
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold ${textSize} ${getCredibilityColor(displayScore)}`}>
            {displayScore}
          </div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </div>
      <div className={`mt-4 font-semibold ${labelSize} ${getCredibilityColor(score)}`}>
        {getCredibilityLabel(score)}
      </div>
    </div>
  );
}
