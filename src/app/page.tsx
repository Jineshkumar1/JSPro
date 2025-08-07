"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { StockCard } from "@/components/features/StockCard";
import { TransactionList } from "@/components/features/TransactionList";
import { PortfolioSummary } from "@/components/features/PortfolioSummary";
import { StockDetailModal } from "@/components/features/StockDetailModal";
import { getTrendingStocks, getDailyGainers, getDailyLosers, StockQuote } from "@/app/actions/stockActions";

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
  const [trendingStocks, setTrendingStocks] = useState<StockQuote[]>([]);
  const [dailyGainers, setDailyGainers] = useState<StockQuote[]>([]);
  const [dailyLosers, setDailyLosers] = useState<StockQuote[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch stock data on component mount
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [trending, gainers, losers] = await Promise.all([
          getTrendingStocks(),
          getDailyGainers(),
          getDailyLosers(),
        ]);

        setTrendingStocks(trending);
        setDailyGainers(gainers);
        setDailyLosers(losers);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, []);

  const handleStockClick = (symbol: string) => {
    setSelectedStock(symbol);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

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
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
            {trendingStocks.slice(0, 4).map((stock) => (
              <StockCard 
                key={stock.symbol} 
                {...stock} 
                onClick={handleStockClick}
              />
            ))}
          </div>
        </div>

        {/* Most Up (Daily Gainers) Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Most Up</h2>
            <button className="text-sm text-text-secondary hover:text-text-primary">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {dailyGainers.slice(0, 6).map((stock) => (
              <StockCard 
                key={stock.symbol} 
                {...stock} 
                onClick={handleStockClick}
              />
            ))}
          </div>
        </div>

        {/* Most Down (Daily Losers) Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Most Down</h2>
            <button className="text-sm text-text-secondary hover:text-text-primary">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {dailyLosers.slice(0, 6).map((stock) => (
              <StockCard 
                key={stock.symbol} 
                {...stock} 
                onClick={handleStockClick}
              />
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
                View details
              </button>
            </div>
            <PortfolioSummary metrics={portfolioMetrics} />
          </div>
        </div>
      </div>

      {/* Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal
          symbol={selectedStock}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Dashboard>
  );
}
