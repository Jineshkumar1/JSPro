"use client";

import { ArrowUp, ArrowDown, Trash2, Edit, TrendingDown } from "lucide-react";

interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  return: number;
  returnPercentage: number;
}

interface HoldingsTableProps {
  holdings: PortfolioHolding[];
  onRemoveStock: (symbol: string) => void;
  onEditStock: (holding: PortfolioHolding) => void;
  onSellStock: (holding: PortfolioHolding) => void;
}

export function HoldingsTable({ holdings, onRemoveStock, onEditStock, onSellStock }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6">
        <div className="text-center text-text-secondary">
          <div className="text-2xl mb-2">📈</div>
          <div>No stocks in your portfolio yet</div>
          <div className="text-sm mt-1">Add some stocks to start tracking your investments</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Shares
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Avg Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Return
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background">
            {holdings.map((holding) => {
              const isPositive = holding.return >= 0;
              return (
                <tr key={holding.symbol} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-text-primary">{holding.symbol}</div>
                      <div className="text-sm text-text-secondary">{holding.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {holding.shares.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    ${holding.avgPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    ${holding.currentPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    ${holding.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
                      {isPositive ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      <span>${Math.abs(holding.return).toFixed(2)}</span>
                      <span>({holding.returnPercentage.toFixed(2)}%)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSellStock(holding)}
                        className="text-error hover:text-error/80 transition-colors"
                        title="Sell shares"
                      >
                        <TrendingDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditStock(holding)}
                        className="text-accent hover:text-accent/80 transition-colors"
                        title="Edit position"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onRemoveStock(holding.symbol)}
                        className="text-error hover:text-error/80 transition-colors"
                        title="Remove from portfolio"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 