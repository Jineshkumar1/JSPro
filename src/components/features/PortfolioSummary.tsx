"use client";

import { ArrowDown, ArrowUp, DollarSign, Percent, TrendingUp } from "lucide-react";
import clsx from "clsx";

interface PortfolioMetrics {
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  todayReturn: number;
  todayPercentage: number;
}

interface PortfolioSummaryProps {
  metrics: PortfolioMetrics;
}

export function PortfolioSummary({ metrics }: PortfolioSummaryProps) {
  return (
    <div className="rounded-lg bg-card p-internal">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Portfolio Summary</h2>
        <button className="text-sm text-text-secondary hover:text-text-primary">
          View details
        </button>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline gap-2">
          <DollarSign className="h-6 w-6 shrink-0 text-accent" />
          <span className="break-all text-3xl font-bold">
            {metrics.totalValue.toLocaleString()}
          </span>
        </div>
        <div className="mt-1 text-sm text-text-secondary">Total Portfolio Value</div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-background p-3">
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <TrendingUp className="h-4 w-4 shrink-0" />
            <span>Total Return</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-medium">
              ${Math.abs(metrics.totalReturn).toLocaleString()}
            </span>
            <div
              className={clsx(
                "flex items-center text-sm",
                metrics.returnPercentage >= 0 ? "text-success" : "text-error"
              )}
            >
              {metrics.returnPercentage >= 0 ? (
                <ArrowUp className="h-4 w-4 shrink-0" />
              ) : (
                <ArrowDown className="h-4 w-4 shrink-0" />
              )}
              <span>{Math.abs(metrics.returnPercentage).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-background p-3">
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <Percent className="h-4 w-4 shrink-0" />
            <span>Today&apos;s Return</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-medium">
              ${Math.abs(metrics.todayReturn).toLocaleString()}
            </span>
            <div
              className={clsx(
                "flex items-center text-sm",
                metrics.todayPercentage >= 0 ? "text-success" : "text-error"
              )}
            >
              {metrics.todayPercentage >= 0 ? (
                <ArrowUp className="h-4 w-4 shrink-0" />
              ) : (
                <ArrowDown className="h-4 w-4 shrink-0" />
              )}
              <span>{Math.abs(metrics.todayPercentage).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 