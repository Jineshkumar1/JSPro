"use client";

import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { MarketSearch } from "@/components/features/market/MarketSearch";
import { MarketList } from "@/components/features/market/MarketList";
import { MarketChart } from "@/components/features/market/MarketChart";

interface MarketPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  isWatchlisted?: boolean;
}

// Sample data - in a real app, this would come from an API
const marketPairs: MarketPair[] = [
  {
    symbol: "BTC/USD",
    name: "Bitcoin",
    price: 43521.30,
    change: 2.34,
    volume: 28945123456,
    marketCap: 846123456789,
    isWatchlisted: true,
  },
  {
    symbol: "ETH/USD",
    name: "Ethereum",
    price: 2284.15,
    change: -1.23,
    volume: 15678912345,
    marketCap: 274567891234,
    isWatchlisted: false,
  },
  {
    symbol: "SOL/USD",
    name: "Solana",
    price: 98.45,
    change: 5.67,
    volume: 4567891234,
    marketCap: 41234567890,
    isWatchlisted: true,
  },
  {
    symbol: "AVAX/USD",
    name: "Avalanche",
    price: 35.78,
    change: 3.45,
    volume: 2345678901,
    marketCap: 12345678901,
    isWatchlisted: false,
  },
  {
    symbol: "DOT/USD",
    name: "Polkadot",
    price: 7.23,
    change: -2.12,
    volume: 1234567890,
    marketCap: 9876543210,
    isWatchlisted: false,
  },
  {
    symbol: "LINK/USD",
    name: "Chainlink",
    price: 14.56,
    change: 4.78,
    volume: 987654321,
    marketCap: 7654321098,
    isWatchlisted: true,
  },
  {
    symbol: "MATIC/USD",
    name: "Polygon",
    price: 0.89,
    change: -0.45,
    volume: 876543210,
    marketCap: 6543210987,
    isWatchlisted: false,
  },
];

const marketNews = [
  {
    id: 1,
    title: "Bitcoin Surges Past $43,000 as Market Sentiment Improves",
    source: "CryptoNews",
    time: "2 hours ago",
    tag: "BTC",
  },
  {
    id: 2,
    title: "Ethereum Layer 2 Solutions See Record Growth in Daily Transactions",
    source: "BlockchainDaily",
    time: "4 hours ago",
    tag: "ETH",
  },
  {
    id: 3,
    title: "Solana DeFi Ecosystem Reaches New Milestone in Total Value Locked",
    source: "DeFiInsider",
    time: "5 hours ago",
    tag: "SOL",
  },
  {
    id: 4,
    title: "Major Financial Institution Announces Crypto Custody Service",
    source: "CryptoNews",
    time: "6 hours ago",
    tag: "MARKET",
  },
];

// Generate more realistic chart data
function generateChartData() {
  const points = [];
  let value = 43000;
  
  // Generate 24 hourly points
  for (let i = 0; i < 24; i++) {
    // Add some randomness to create a realistic pattern
    const change = (Math.random() - 0.5) * 200;
    value += change;
    points.push({
      time: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: value,
    });
  }
  
  return points;
}

export default function MarketPage() {
  const [selectedPair, setSelectedPair] = useState<MarketPair>(marketPairs[0]);
  const chartData = generateChartData();

  const handlePairSelect = (pair: MarketPair) => {
    setSelectedPair(pair);
  };

  return (
    <Dashboard>
      <div className="space-y-section">
        <MarketSearch />
        <div className="grid grid-cols-1 gap-section desktop:grid-cols-[1fr_400px]">
          <div className="space-y-section">
            <MarketChart
              symbol={selectedPair.symbol}
              data={chartData}
              change={selectedPair.change}
            />
            <div className="rounded-lg bg-card p-internal">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Market News</h2>
                <button className="text-sm text-text-secondary hover:text-text-primary">
                  View all
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {marketNews.map((news) => (
                  <div key={news.id} className="flex items-start gap-3">
                    <div className="rounded bg-background px-2 py-1 text-xs font-medium text-accent">
                      {news.tag}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium hover:text-accent">
                        {news.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <MarketList
              pairs={marketPairs}
              selectedPair={selectedPair}
              onSelectPair={handlePairSelect}
            />
          </div>
        </div>
      </div>
    </Dashboard>
  );
} 