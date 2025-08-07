"use client";

import { Dashboard } from "@/components/layout/Dashboard";
import { AssetDistribution } from "@/components/features/portfolio/AssetDistribution";
import { HoldingsTable } from "@/components/features/portfolio/HoldingsTable";
import { TransactionList } from "@/components/features/TransactionList";

// Sample data
const assets = [
  { symbol: "BTC", value: 42436.78, color: "#F7931A" },
  { symbol: "ETH", value: 21284.56, color: "#627EEA" },
  { symbol: "SOL", value: 15673.90, color: "#00FFA3" },
  { symbol: "USDT", value: 10000.00, color: "#26A17B" },
];

const holdings = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    shares: 1.2,
    avgPrice: 41234.56,
    currentPrice: 35364.00,
    value: 42436.78,
    returnAmount: 2958.91,
    returnPercentage: 5.97,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    shares: 13.7,
    avgPrice: 2187.65,
    currentPrice: 1554.35,
    value: 21284.56,
    returnAmount: 1324.89,
    returnPercentage: 4.42,
  },
  {
    symbol: "SOL",
    name: "Solana",
    shares: 159.2,
    avgPrice: 92.45,
    currentPrice: 98.45,
    value: 15673.90,
    returnAmount: 955.20,
    returnPercentage: 6.49,
  },
  {
    symbol: "USDT",
    name: "Tether",
    shares: 10000,
    avgPrice: 1.00,
    currentPrice: 1.00,
    value: 10000.00,
    returnAmount: 0,
    returnPercentage: 0,
  },
];

const recentTransactions = [
  {
    id: "1",
    type: "buy" as const,
    symbol: "BTC",
    amount: 5243.67,
    shares: 0.12,
    date: "Today, 2:30 PM",
  },
  {
    id: "2",
    type: "sell" as const,
    symbol: "ETH",
    amount: 3128.45,
    shares: 1.37,
    date: "Today, 1:45 PM",
  },
  {
    id: "3",
    type: "buy" as const,
    symbol: "SOL",
    amount: 1567.39,
    shares: 15.92,
    date: "Today, 11:30 AM",
  },
];

export default function PortfolioPage() {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <Dashboard>
      <div className="space-y-section">
        <div className="grid grid-cols-1 gap-section tablet:grid-cols-2">
          <AssetDistribution assets={assets} totalValue={totalValue} />
          <div className="rounded-lg bg-card p-internal">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-lg bg-background p-3 text-sm font-medium text-text-primary hover:bg-background/80">
                Deposit Funds
              </button>
              <button className="rounded-lg bg-background p-3 text-sm font-medium text-text-primary hover:bg-background/80">
                Withdraw Funds
              </button>
              <button className="rounded-lg bg-background p-3 text-sm font-medium text-text-primary hover:bg-background/80">
                Buy Crypto
              </button>
              <button className="rounded-lg bg-background p-3 text-sm font-medium text-text-primary hover:bg-background/80">
                Sell Crypto
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-section">
          <HoldingsTable holdings={holdings} />
          <TransactionList transactions={recentTransactions} />
        </div>
      </div>
    </Dashboard>
  );
} 