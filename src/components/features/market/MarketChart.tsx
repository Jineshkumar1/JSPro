"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import clsx from "clsx";

interface ChartPoint {
  time: string;
  value: number;
}

interface MarketChartProps {
  symbol: string;
  data: ChartPoint[];
  change: number;
}

export function MarketChart({ symbol, data, change }: MarketChartProps) {
  const isPositive = change >= 0;

  // Calculate min and max for chart scaling
  const { path } = useMemo(() => {
    if (!data.length) return { path: "" };

    const minValue = Math.min(...data.map(d => d.value));
    const maxValue = Math.max(...data.map(d => d.value));
    const range = maxValue - minValue;
    const padding = range * 0.1; // Add 10% padding

    // Chart dimensions
    const width = 1000;
    const height = 300;

    // Scale points to fit the chart
    const points = data.map((point, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((point.value - (minValue - padding)) / (range + 2 * padding)) * height;
      return `${x},${y}`;
    });

    return {
      path: `M ${points.join(" L ")}`,
    };
  }, [data]);

  const currentPrice = data[data.length - 1]?.value;
  const timeRange = "24H";

  return (
    <div className="rounded-lg bg-card p-internal">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{symbol} Price Chart</h2>
          <div className="mt-1 flex items-center gap-4">
            <div className="text-2xl font-bold">
              ${currentPrice?.toLocaleString(undefined, { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </div>
            <div
              className={clsx(
                "flex items-center gap-1 text-sm",
                isPositive ? "text-success" : "text-error"
              )}
            >
              {isPositive ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{Math.abs(change).toFixed(2)}%</span>
              <span className="text-text-secondary">({timeRange})</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {["1H", "24H", "1W", "1M", "1Y", "ALL"].map((period) => (
            <button
              key={period}
              className={clsx(
                "rounded px-3 py-1 text-sm",
                period === timeRange
                  ? "bg-background text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[300px] w-full">
        <svg
          viewBox="0 0 1000 300"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgb(0, 200, 83, 0.2)" />
              <stop offset="100%" stopColor="rgb(0, 200, 83, 0)" />
            </linearGradient>
          </defs>
          <path
            d={path}
            fill="none"
            stroke={isPositive ? "#00C853" : "#FF3D00"}
            strokeWidth="2"
          />
          <path
            d={`${path} L 1000,300 L 0,300 Z`}
            fill="url(#chartGradient)"
            opacity="0.2"
          />
        </svg>
      </div>
    </div>
  );
} 