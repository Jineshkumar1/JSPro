import { Dashboard } from "@/components/layout/Dashboard";
import { StockCard } from "@/components/features/StockCard";
import { TransactionList } from "@/components/features/TransactionList";
import { PortfolioSummary } from "@/components/features/PortfolioSummary";

const trendingStocks = [
  {
    symbol: "TSLA",
    name: "Tesla Inc",
    price: 462.25,
    change: 31.65,
    changePercentage: 7.35,
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    price: 144.85,
    change: -15.27,
    changePercentage: -4.67,
  },
];

const mostProfitableStocks = [
  {
    symbol: "FB",
    name: "Meta",
    price: 607.75,
    change: -7.90,
    changePercentage: -1.52,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    price: 256.27,
    change: 11.15,
    changePercentage: 3.98,
  },
  {
    symbol: "ADBE",
    name: "Adobe",
    price: 458.59,
    change: 15.18,
    changePercentage: 2.65,
  },
];

const recentTransactions = [
  {
    id: "1",
    type: "buy" as const,
    symbol: "AMZN",
    amount: 160.00,
    shares: 1,
    date: "17 Dec, 09:00 AM",
  },
  {
    id: "2",
    type: "sell" as const,
    symbol: "AAPL",
    amount: 234.99,
    shares: 1,
    date: "15 Dec, 02:26 PM",
  },
  {
    id: "3",
    type: "buy" as const,
    symbol: "SBUX",
    amount: 98.36,
    shares: 1,
    date: "11 Dec, 08:12 PM",
  },
];

const portfolioMetrics = {
  totalValue: 109395.24,
  totalReturn: 12580.50,
  returnPercentage: 11.12,
  todayReturn: 450.30,
  todayPercentage: 0.36,
};

export default function Home() {
  return (
    <Dashboard>
      <div className="space-y-8">
        {/* Trending Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Trending</h2>
            <button className="text-sm text-text-secondary hover:text-text-primary">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
            {trendingStocks.map((stock) => (
              <StockCard key={stock.symbol} {...stock} />
            ))}
          </div>
        </div>

        {/* Most Profitable Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Most profitable</h2>
            <button className="text-sm text-text-secondary hover:text-text-primary">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
            {mostProfitableStocks.map((stock) => (
              <StockCard key={stock.symbol} {...stock} />
            ))}
          </div>
        </div>

        {/* Recent Activities and Portfolio Section */}
        <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2">
          {/* Recent Activities */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent activities</h2>
              <button className="text-sm text-text-secondary hover:text-text-primary">
                View all
              </button>
            </div>
            <TransactionList transactions={recentTransactions} />
          </div>

          {/* My Portfolio */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">My portfolio</h2>
              <button className="text-sm text-text-secondary hover:text-text-primary">
                View all
              </button>
            </div>
            <PortfolioSummary metrics={portfolioMetrics} />
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
