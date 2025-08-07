"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import clsx from "clsx";

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  returnAmount: number;
  returnPercentage: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <div className="rounded-lg bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-background">
              <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-text-secondary">
                Asset
              </th>
              <th className="whitespace-nowrap p-4 text-right text-sm font-medium text-text-secondary">
                Shares
              </th>
              <th className="whitespace-nowrap p-4 text-right text-sm font-medium text-text-secondary">
                Avg Price
              </th>
              <th className="whitespace-nowrap p-4 text-right text-sm font-medium text-text-secondary">
                Current Price
              </th>
              <th className="whitespace-nowrap p-4 text-right text-sm font-medium text-text-secondary">
                Value
              </th>
              <th className="whitespace-nowrap p-4 text-right text-sm font-medium text-text-secondary">
                Return
              </th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const isPositive = holding.returnAmount >= 0;

              return (
                <tr
                  key={holding.symbol}
                  className="border-b border-background last:border-0"
                >
                  <td className="whitespace-nowrap p-4">
                    <div className="font-medium">{holding.symbol}</div>
                    <div className="text-sm text-text-secondary">
                      {holding.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-4 text-right">
                    {holding.shares.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap p-4 text-right">
                    ${holding.avgPrice.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap p-4 text-right">
                    ${holding.currentPrice.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap p-4 text-right">
                    ${holding.value.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap p-4 text-right">
                    <div
                      className={clsx(
                        "flex items-center justify-end",
                        isPositive ? "text-success" : "text-error"
                      )}
                    >
                      {isPositive ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      <span>
                        ${Math.abs(holding.returnAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      {holding.returnPercentage.toFixed(2)}%
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