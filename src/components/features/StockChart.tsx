"use client";

import { useEffect, useState } from "react";
import { getStockCandles, getDateRange, FinnhubCandle } from "@/services/finnhubService";
import { LoadingSpinner } from "./LoadingSpinner";

interface StockChartProps {
  symbol: string;
  period?: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y';
  height?: number;
  showVolume?: boolean;
}

export function StockChart({
  symbol,
  period = '1M',
  height = 200,
  showVolume = false
}: StockChartProps) {
  const [chartData, setChartData] = useState<FinnhubCandle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Convert period to days and resolution
        const periodMap: Record<string, { days: number; resolution: '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M' }> = {
          '1D': { days: 1, resolution: '5' },
          '5D': { days: 5, resolution: '30' },
          '1M': { days: 30, resolution: 'D' },
          '3M': { days: 90, resolution: 'D' },
          '6M': { days: 180, resolution: 'D' },
          '1Y': { days: 365, resolution: 'W' },
        };

        const { days, resolution } = periodMap[period];
        const { from, to } = getDateRange(days);

        const data = await getStockCandles(symbol, resolution, from, to);

        if (data && data.s === 'ok' && data.c && data.c.length > 0) {
          setChartData(data);
        } else {
          setError('No chart data available');
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchChartData();
    }
  }, [symbol, period]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="flex items-center justify-center text-text-secondary" style={{ height }}>
        {error || 'No chart data available'}
      </div>
    );
  }

  const { c: closePrices, v: volumes } = chartData;

  if (closePrices.length === 0) {
    return (
      <div className="flex items-center justify-center text-text-secondary" style={{ height }}>
        No data available
      </div>
    );
  }

  // Calculate chart dimensions
  const maxPrice = Math.max(...closePrices);
  const minPrice = Math.min(...closePrices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;

  // Create SVG path for price line
  const createPricePath = (prices: number[]) => {
    if (prices.length < 2) return '';

    const points = prices.map((price, index) => {
      const x = (index / (prices.length - 1)) * 100;
      const y = 100 - (((price - (minPrice - padding)) / (priceRange + padding * 2)) * 100);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Create volume bars
  const createVolumeBars = () => {
    if (!showVolume || volumes.length === 0) return null;

    const maxVolume = Math.max(...volumes);
    const barWidth = 100 / volumes.length;

    return volumes.map((volume, index) => {
      const height = (volume / maxVolume) * 30; // Max 30% of chart height for volume
      const x = (index / volumes.length) * 100;
      const y = 100 - height;

      return (
        <rect
          key={index}
          x={`${x}%`}
          y={`${y}%`}
          width={`${barWidth}%`}
          height={`${height}%`}
          fill="rgba(255, 75, 110, 0.3)"
          stroke="none"
        />
      );
    });
  };

  // Calculate price change
  const currentPrice = closePrices[closePrices.length - 1];
  const previousPrice = closePrices[closePrices.length - 2] || closePrices[0];
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <div className="relative">
      {/* Price and change display */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">${currentPrice.toFixed(2)}</span>
          <span className={`text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="text-xs text-text-secondary">
          {period}
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height }}>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(143, 143, 143, 0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Volume bars (behind price line) */}
          {showVolume && createVolumeBars()}

          {/* Price line */}
          <path
            d={createPricePath(closePrices)}
            fill="none"
            stroke={isPositive ? "#00C853" : "#FF3D00"}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Price area fill */}
          <path
            d={`${createPricePath(closePrices)} L 100,100 L 0,100 Z`}
            fill={`url(#${isPositive ? 'positiveGradient' : 'negativeGradient'})`}
            opacity="0.1"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00C853" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF3D00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF3D00" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Chart controls */}
      <div className="mt-2 flex gap-1">
        {(['1D', '5D', '1M', '3M', '6M', '1Y'] as const).map((p) => (
          <button
            key={p}
            onClick={() => {/* Handle period change */}}
            className={`px-2 py-1 text-xs rounded ${
              period === p
                ? 'bg-accent text-white'
                : 'bg-card text-text-secondary hover:text-text-primary'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
} 