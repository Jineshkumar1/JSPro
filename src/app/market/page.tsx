"use client";

import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { MarketSearch } from "@/components/features/market/MarketSearch";
import { MarketList } from "@/components/features/market/MarketList";
import { MarketChart } from "@/components/features/market/MarketChart";
import { StockQuote } from "@/app/actions/stockActions";

export default function MarketPage() {
  const [selectedPair, setSelectedPair] = useState<StockQuote | null>(null);

  const handlePairSelect = (pair: StockQuote) => {
    setSelectedPair(pair);
  };

  // Generate chart data for selected stock
  const generateChartData = () => {
    const points = [];
    let value = 100;
    
    // Generate 24 hourly points
    for (let i = 0; i < 24; i++) {
      // Add some randomness to create a realistic pattern
      const change = (Math.random() - 0.5) * 10;
      value += change;
      points.push({
        time: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
        value: value,
      });
    }
    
    return points;
  };

  const chartData = selectedPair ? generateChartData() : [];

  return (
    <Dashboard>
      <div className="space-y-section">
        <MarketSearch />
        <div className="grid grid-cols-1 gap-section desktop:grid-cols-[1fr_400px]">
          <div className="space-y-section">
            {selectedPair ? (
              <MarketChart
                symbol={selectedPair.symbol}
                data={chartData}
                change={selectedPair.change}
              />
            ) : (
              <div className="rounded-lg bg-card p-internal">
                <div className="flex h-64 items-center justify-center text-text-secondary">
                  Select a stock to view chart
                </div>
              </div>
            )}
            <div className="rounded-lg bg-card p-internal">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Market News</h2>
                <button className="text-sm text-text-secondary hover:text-text-primary">
                  View all
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded bg-background px-2 py-1 text-xs font-medium text-accent">
                    MARKET
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium hover:text-accent">
                      Stock Market Update: Tech Stocks Lead Gains
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                      <span>Financial News</span>
                      <span>•</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded bg-background px-2 py-1 text-xs font-medium text-accent">
                    AAPL
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium hover:text-accent">
                      Apple Reports Strong Q4 Earnings
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                      <span>Tech News</span>
                      <span>•</span>
                      <span>4 hours ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded bg-background px-2 py-1 text-xs font-medium text-accent">
                    TSLA
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium hover:text-accent">
                      Tesla Announces New Model Updates
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                      <span>Auto News</span>
                      <span>•</span>
                      <span>5 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <MarketList
              selectedPair={selectedPair || undefined}
              onSelectPair={handlePairSelect}
            />
          </div>
        </div>
      </div>
    </Dashboard>
  );
} 