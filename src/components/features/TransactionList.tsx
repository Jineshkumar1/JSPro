"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

interface Transaction {
  id: string;
  type: "buy" | "sell";
  symbol: string;
  amount: number;
  shares: number;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="rounded-lg bg-card p-internal">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Latest Transactions</h2>
        <button className="text-sm text-text-secondary hover:text-text-primary">
          View all
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg bg-background p-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  transaction.type === "buy"
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                )}
              >
                {transaction.type === "buy" ? (
                  <ArrowDownRight className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="font-medium">{transaction.symbol}</div>
                <div className="text-sm text-text-secondary">
                  {transaction.shares} shares
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={clsx(
                  "font-medium",
                  transaction.type === "buy" ? "text-error" : "text-success"
                )}
              >
                {transaction.type === "buy" ? "-" : "+"}${transaction.amount.toFixed(2)}
              </div>
              <div className="text-sm text-text-secondary">{transaction.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 