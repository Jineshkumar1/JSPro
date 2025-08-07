"use client";

import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, MoreVertical, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { StockQuote, getHistoricalData } from "@/app/actions/stockActions";
import { LoadingSpinner } from "./LoadingSpinner";

interface StockCardProps extends Omit<StockQuote, 'volume' | 'marketCap'> {
  chartData?: number[];
  onClick?: (symbol: string) => void;
  showChart?: boolean;
}

export function StockCard({
  symbol,
  name,
  price,
  change,
  changePercentage,
  onClick,
  showChart = true,
}: StockCardProps) {
  const [chartData, setChartData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const isPositive = change >= 0;

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const data = await getHistoricalData(symbol, '1mo');
        setChartData(data.map(item => item.close));
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (showChart) {
      fetchChartData();
    }
  }, [symbol, showChart]);

  const handleCardClick = () => {
    if (onClick) {
      onClick(symbol);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://finance.yahoo.com/quote/${symbol}`, '_blank');
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center" style={{ height: isExpanded ? 150 : 80 }}>
          <LoadingSpinner size="sm" />
        </div>
      );
    }

    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center text-text-secondary" style={{ height: isExpanded ? 150 : 80 }}>
          <div className="text-sm">No chart data</div>
        </div>
      );
    }

    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min;

    if (range === 0) {
      return (
        <div className="flex items-center justify-center text-text-secondary" style={{ height: isExpanded ? 150 : 80 }}>
          <div className="text-sm">Flat line</div>
        </div>
      );
    }

    return (
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${chartData.length - 1} ${range}`}
        preserveAspectRatio="none"
        style={{ height: isExpanded ? 150 : 80 }}
      >
        <path
          d={`M 0 ${chartData[0] - min} ${chartData
            .slice(1)
            .map((point, i) => `L ${i + 1} ${point - min}`)
            .join(" ")}`}
          fill="none"
          stroke={isPositive ? "#00C853" : "#FF3D00"}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <div 
      className={clsx(
        "rounded-lg bg-card p-internal transition-all duration-200",
        onClick && "cursor-pointer hover:bg-card/80 hover:shadow-lg",
        isExpanded && "ring-2 ring-accent"
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold cursor-pointer hover:text-accent transition-colors">
              {symbol}
            </h3>
            <button
              onClick={handleExternalClick}
              className="text-text-secondary hover:text-accent transition-colors"
              title="View on Yahoo Finance"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
            <span className="text-sm text-text-secondary truncate">{name}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">${price.toFixed(2)}</span>
            <div
              className={clsx(
                "flex items-center text-sm",
                isPositive ? "text-success" : "text-error"
              )}
            >
              {isPositive ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>${Math.abs(change).toFixed(2)}</span>
              <span>({Math.abs(changePercentage).toFixed(2)}%)</span>
            </div>
          </div>
        </div>
        <button 
          className="rounded-lg p-1 text-text-secondary hover:bg-background hover:text-text-primary"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {showChart && (
        <div className="mt-4">
          {renderChart()}
        </div>
      )}
    </div>
  );
} 