"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  symbol?: string;
  name?: string;
  shares?: number;
  price?: number;
  amount: number;
  timestamp: Date;
  description: string;
}

// Removed unused interface

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell' | 'deposit' | 'withdraw'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactionHistory();
  }, []);

  const loadTransactionHistory = () => {
    try {
      const savedTransactions = localStorage.getItem('portfolioHistory');
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions).map((t: Transaction) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        }));
        setTransactions(parsedTransactions);
      }
    } catch (error) {
      console.error('Error loading transaction history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'sell':
        return <TrendingDown className="h-5 w-5 text-error" />;
      case 'deposit':
        return <ArrowUp className="h-5 w-5 text-success" />;
      case 'withdraw':
        return <ArrowDown className="h-5 w-5 text-error" />;
      default:
        return <DollarSign className="h-5 w-5 text-accent" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'buy':
      case 'deposit':
        return 'text-success';
      case 'sell':
      case 'withdraw':
        return 'text-error';
      default:
        return 'text-accent';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTotalStats = () => {
    const stats = {
      totalBuys: 0,
      totalSells: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      netCashFlow: 0
    };

    transactions.forEach(transaction => {
      switch (transaction.type) {
        case 'buy':
          stats.totalBuys += transaction.amount;
          stats.netCashFlow -= transaction.amount;
          break;
        case 'sell':
          stats.totalSells += transaction.amount;
          stats.netCashFlow += transaction.amount;
          break;
        case 'deposit':
          stats.totalDeposits += transaction.amount;
          stats.netCashFlow += transaction.amount;
          break;
        case 'withdraw':
          stats.totalWithdrawals += transaction.amount;
          stats.netCashFlow -= transaction.amount;
          break;
      }
    });

    return stats;
  };

  const stats = getTotalStats();

  if (isLoading) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-64">
          <div className="text-text-secondary">Loading transaction history...</div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="text-text-secondary">Track all your portfolio activities</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-text-secondary" />
            <span className="text-sm text-text-secondary">
              {transactions.length} transactions
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="text-sm font-medium text-text-secondary">Total Buys</h3>
            </div>
            <div className="text-2xl font-bold text-success">${stats.totalBuys.toLocaleString()}</div>
          </div>
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="h-5 w-5 text-error" />
              <h3 className="text-sm font-medium text-text-secondary">Total Sells</h3>
            </div>
            <div className="text-2xl font-bold text-error">${stats.totalSells.toLocaleString()}</div>
          </div>
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUp className="h-5 w-5 text-success" />
              <h3 className="text-sm font-medium text-text-secondary">Total Deposits</h3>
            </div>
            <div className="text-2xl font-bold text-success">${stats.totalDeposits.toLocaleString()}</div>
          </div>
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDown className="h-5 w-5 text-error" />
              <h3 className="text-sm font-medium text-text-secondary">Total Withdrawals</h3>
            </div>
            <div className="text-2xl font-bold text-error">${stats.totalWithdrawals.toLocaleString()}</div>
          </div>
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-medium text-text-secondary">Net Cash Flow</h3>
            </div>
            <div className={`text-2xl font-bold ${stats.netCashFlow >= 0 ? 'text-success' : 'text-error'}`}>
              {stats.netCashFlow >= 0 ? '+' : ''}${stats.netCashFlow.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-secondary" />
            <span className="text-sm font-medium text-text-secondary">Filter:</span>
          </div>
          <div className="flex gap-2">
            {(['all', 'buy', 'sell', 'deposit', 'withdraw'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-accent text-white'
                    : 'bg-card text-text-secondary hover:bg-background'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-card rounded-lg overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
              <p className="text-text-secondary">
                {filterType === 'all' 
                  ? 'Start trading to see your transaction history here'
                  : `No ${filterType} transactions found`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <div className={`font-medium capitalize ${getTransactionColor(transaction.type)}`}>
                              {transaction.type}
                            </div>
                            {transaction.symbol && (
                              <div className="text-sm text-text-secondary">{transaction.symbol}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-text-primary">{transaction.description}</div>
                          {transaction.shares && transaction.price && (
                            <div className="text-sm text-text-secondary">
                              {transaction.shares} shares @ ${transaction.price.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'buy' || transaction.type === 'withdraw' ? '-' : '+'}
                          ${transaction.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {formatDate(transaction.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
} 