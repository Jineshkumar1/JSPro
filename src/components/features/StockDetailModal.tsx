"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, TrendingUp, TrendingDown, Building2, Globe } from "lucide-react";
import { getStockQuote, getHistoricalData } from "@/app/actions/stockActions";
import { LoadingSpinner } from "./LoadingSpinner";

interface StockDetailModalProps {
  symbol: string;
  isOpen: boolean;
  onClose: () => void;
}

interface QuoteData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercentage: number;
  volume: number;
  marketCap: number;
}

export function StockDetailModal({ symbol, isOpen, onClose }: StockDetailModalProps) {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && symbol) {
      fetchStockData();
    }
  }, [isOpen, symbol]);

  const fetchStockData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [quoteData, historicalData] = await Promise.all([
        getStockQuote(symbol),
        getHistoricalData(symbol, '1mo'),
      ]);

      setQuote(quoteData);
      setChartData(historicalData.map(item => item.close));
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to load stock data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isPositive = quote?.change ? quote.change >= 0 : false;

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-text-secondary">
          No chart data available
        </div>
      );
    }

    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min;

    if (range === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-text-secondary">
          Flat line
        </div>
      );
    }

    return (
      <svg
        className="w-full h-64"
        viewBox={`0 0 ${chartData.length - 1} ${range}`}
        preserveAspectRatio="none"
      >
        <path
          d={`M 0 ${chartData[0] - min} ${chartData
            .slice(1)
            .map((point, i) => `L ${i + 1} ${point - min}`)
            .join(" ")}`}
          fill="none"
          stroke={isPositive ? "#00C853" : "#FF3D00"}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card">
          <div>
            <h2 className="text-xl font-bold">{symbol}</h2>
            <p className="text-text-secondary">{quote?.name || 'Loading...'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`https://finance.yahoo.com/quote/${symbol}`, '_blank')}
              className="p-2 text-text-secondary hover:text-accent transition-colors"
              title="View on Yahoo Finance"
            >
              <ExternalLink className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-error">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Price Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4">
                  <div className="text-sm text-text-secondary">Current Price</div>
                  <div className="text-2xl font-bold">${quote?.price?.toFixed(2) || 'N/A'}</div>
                  <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>${Math.abs(quote?.change || 0).toFixed(2)}</span>
                    <span>({Math.abs(quote?.changePercentage || 0).toFixed(2)}%)</span>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4">
                  <div className="text-sm text-text-secondary">Volume</div>
                  <div className="text-lg font-semibold">
                    {quote?.volume?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-text-secondary">
                    Shares traded today
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4">
                  <div className="text-sm text-text-secondary">Market Cap</div>
                  <div className="text-lg font-semibold">
                    ${quote?.marketCap?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-text-secondary">
                    Total market value
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-card rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Price Chart (1 Month)</h3>
                {renderChart()}
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Stock Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-text-secondary">Symbol</div>
                      <div className="font-medium">{symbol}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Company Name</div>
                      <div className="font-medium">{quote?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Current Price</div>
                      <div className="font-medium">${quote?.price?.toFixed(2) || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Daily Change</div>
                      <div className={`font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
                        {isPositive ? '+' : ''}{quote?.change?.toFixed(2) || 'N/A'} ({quote?.changePercentage?.toFixed(2) || 'N/A'}%)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Market Data
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-text-secondary">Volume</div>
                      <div className="font-medium">{quote?.volume?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Market Cap</div>
                      <div className="font-medium">
                        ${quote?.marketCap?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Data Source</div>
                      <div className="font-medium">Yahoo Finance</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Last Updated</div>
                      <div className="font-medium">{new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 