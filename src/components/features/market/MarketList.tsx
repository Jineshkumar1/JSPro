"use client";

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Star } from "lucide-react";
import clsx from "clsx";
import { StockQuote, getTrendingStocks } from '@/app/actions/stockActions';

interface MarketListProps {
  onSelectPair: (pair: StockQuote) => void;
  selectedPair?: StockQuote;
}

// Helper function to format large numbers
function formatNumber(num: number): string {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(1)}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(1)}M`;
  }
  return `$${num.toLocaleString()}`;
}

export function MarketList({ onSelectPair, selectedPair }: MarketListProps) {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const data = await getTrendingStocks();
        console.log('Fetched stock data:', JSON.stringify(data, null, 2));
        if (!data || data.length === 0) {
          setError('No stock data received');
          return;
        }
        setStocks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error('Error fetching stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    // Refresh data every minute
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-error">{error}</div>;
  }

  return (
    <div className="rounded-lg bg-card">
      <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr] gap-2 p-3 text-sm text-text-secondary">
        <div className="w-8"></div>
        <div>Asset</div>
        <div className="text-right">Price</div>
        <div className="text-right">24h</div>
        <div className="text-right">Market Cap</div>
      </div>

      <div className="space-y-px">
        {stocks.map((stock) => {
          const isSelected = selectedPair?.symbol === stock.symbol;
          const isPositive = stock.change >= 0;

          return (
            <button
              key={stock.symbol}
              onClick={() => onSelectPair(stock)}
              className={clsx(
                "w-full grid grid-cols-[auto_2fr_1fr_1fr_1fr] gap-2 p-3 text-sm hover:bg-background",
                isSelected && "bg-background"
              )}
            >
              <div className="flex w-8 items-center justify-center">
                <Star
                  className={clsx(
                    "h-4 w-4",
                    false ? "fill-accent text-accent" : "text-text-secondary"
                  )}
                />
              </div>
              <div className="flex min-w-0 items-center">
                <div className="min-w-0">
                  <div className="truncate font-medium">{stock.symbol}</div>
                  <div className="truncate text-text-secondary">{stock.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  ${stock.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </div>
                <div className="text-text-secondary">
                  Vol {formatNumber(stock.volume)}
                </div>
              </div>
              <div
                className={clsx(
                  "flex items-center justify-end whitespace-nowrap",
                  isPositive ? "text-success" : "text-error"
                )}
              >
                {isPositive ? (
                  <ArrowUp className="h-4 w-4 shrink-0" />
                ) : (
                  <ArrowDown className="h-4 w-4 shrink-0" />
                )}
                <span>{Math.abs(stock.changePercentage).toFixed(2)}%</span>
              </div>
              <div className="text-right">
                {formatNumber(stock.marketCap)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 