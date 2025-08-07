"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, MoreVertical } from "lucide-react";
import clsx from "clsx";
import { StockQuote, getHistoricalData } from "@/app/actions/stockActions";

interface StockCardProps extends Omit<StockQuote, 'volume' | 'marketCap'> {
  chartData?: number[];
}

export function StockCard({
  symbol,
  name,
  price,
  change,
  changePercentage,
}: StockCardProps) {
  const [chartData, setChartData] = useState<number[]>([]);
  const isPositive = change >= 0;
  
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getHistoricalData(symbol, '1mo');
        setChartData(data.map(item => item.close));
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData([]);
      }
    };
    
    fetchChartData();
  }, [symbol]);

  if (chartData.length === 0) {
    return null;
  }

  const max = Math.max(...chartData);
  const min = Math.min(...chartData);
  const range = max - min;

  return (
    <div className="rounded-lg bg-card p-internal">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{symbol}</h3>
            <span className="text-sm text-text-secondary">{name}</span>
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
        <button className="rounded-lg p-1 text-text-secondary hover:bg-background hover:text-text-primary">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 h-16">
        <svg
          className="h-full w-full"
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
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
} 