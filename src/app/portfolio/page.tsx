"use client";

import { useState, useEffect, useCallback } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { AssetDistribution } from "@/components/features/portfolio/AssetDistribution";
import { HoldingsTable } from "@/components/features/portfolio/HoldingsTable";
import { AddStockModal } from "@/components/features/portfolio/AddStockModal";
import { EditStockModal } from "@/components/features/portfolio/EditStockModal";
import { SellStockModal } from "@/components/features/portfolio/SellStockModal";
import { CashModal } from "@/components/features/portfolio/CashModal";
import { getStockQuote } from "@/app/actions/stockActions";

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

interface PortfolioMetrics {
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  todayReturn: number;
  todayPercentage: number;
  cashBalance: number;
}

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

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    totalReturn: 0,
    returnPercentage: 0,
    todayReturn: 0,
    todayPercentage: 0,
    cashBalance: 0,
  });
  const [isAddStockModalOpen, setIsAddStockModal] = useState(false);
  const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
  const [isSellStockModalOpen, setIsSellStockModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [cashAction, setCashAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate metrics based on current holdings and cash
  const calculateMetrics = useCallback((currentHoldings: PortfolioHolding[], currentCash: number) => {
    const stockValue = currentHoldings.reduce((sum, holding) => sum + holding.value, 0);
    const totalValue = stockValue + currentCash;
    const totalCost = currentHoldings.reduce((sum, holding) => sum + (holding.shares * holding.avgPrice), 0);
    const totalReturn = stockValue - totalCost;
    const returnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    setMetrics({
      totalValue,
      totalReturn,
      returnPercentage,
      todayReturn: 0,
      todayPercentage: 0,
      cashBalance: currentCash,
    });
  }, []);

  // Save portfolio data to localStorage
  const savePortfolioData = useCallback((holdingsData: PortfolioHolding[], cashData: number) => {
    try {
      localStorage.setItem('portfolioHoldings', JSON.stringify(holdingsData));
      localStorage.setItem('portfolioCash', cashData.toString());
    } catch (error) {
      console.error('Error saving portfolio data:', error);
    }
  }, []);

  // Add transaction to history
  const addTransactionToHistory = useCallback((transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      const savedTransactions = localStorage.getItem('portfolioHistory');
      const transactions: Transaction[] = savedTransactions ? JSON.parse(savedTransactions) : [];
      
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        timestamp: new Date()
      };
      
      transactions.unshift(newTransaction);
      localStorage.setItem('portfolioHistory', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transaction history:', error);
    }
  }, []);

  // Load portfolio data from localStorage
  const loadPortfolioData = useCallback(() => {
    try {
      const savedHoldings = localStorage.getItem('portfolioHoldings');
      const savedCash = localStorage.getItem('portfolioCash');

      let initialHoldings: PortfolioHolding[] = [];
      let initialCash = 0;

      if (savedHoldings) {
        initialHoldings = JSON.parse(savedHoldings);
      }

      if (savedCash) {
        initialCash = parseFloat(savedCash);
      }

      setHoldings(initialHoldings);
      setCashBalance(initialCash);
      calculateMetrics(initialHoldings, initialCash);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateMetrics]);

  // Update current prices for all holdings
  const updateCurrentPrices = useCallback(async (currentHoldings: PortfolioHolding[]) => {
    if (currentHoldings.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const updatedHoldings = await Promise.all(
        currentHoldings.map(async (holding) => {
          try {
            const quote = await getStockQuote(holding.symbol);
            const currentPrice = quote.price;
            const value = holding.shares * currentPrice;
            const totalCost = holding.shares * holding.avgPrice;
            const returnAmount = value - totalCost;
            const returnPercentage = (totalCost > 0) ? (returnAmount / totalCost) * 100 : 0;

            return {
              ...holding,
              currentPrice,
              value,
              return: returnAmount,
              returnPercentage,
            };
          } catch (error) {
            console.error(`Error fetching price for ${holding.symbol}:`, error);
            return holding;
          }
        })
      );

      setHoldings(updatedHoldings);
      calculateMetrics(updatedHoldings, cashBalance);
      savePortfolioData(updatedHoldings, cashBalance);
    } catch (error) {
      console.error('Error updating current prices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cashBalance, calculateMetrics, savePortfolioData]);

  // Load data on component mount
  useEffect(() => {
    loadPortfolioData();
  }, []); // Empty dependency array

  // Update prices when component mounts and we have holdings
  useEffect(() => {
    if (holdings.length > 0) {
      updateCurrentPrices(holdings);
    }
  }, []); // Only run once on mount

  // Handle adding a new stock
  const handleAddStock = useCallback(async (newHolding: Omit<PortfolioHolding, 'currentPrice' | 'value' | 'return' | 'returnPercentage'>) => {
    try {
      // Get current price for the new stock
      const quote = await getStockQuote(newHolding.symbol);
      const currentPrice = quote.price;
      const value = newHolding.shares * currentPrice;
      const totalCost = newHolding.shares * newHolding.avgPrice;
      const returnAmount = value - totalCost;
      const returnPercentage = (totalCost > 0) ? (returnAmount / totalCost) * 100 : 0;

      const completeHolding: PortfolioHolding = {
        ...newHolding,
        currentPrice,
        value,
        return: returnAmount,
        returnPercentage,
      };

      const updatedHoldings = [...holdings, completeHolding];
      setHoldings(updatedHoldings);
      calculateMetrics(updatedHoldings, cashBalance);
      savePortfolioData(updatedHoldings, cashBalance);
      
      // Add transaction to history
      addTransactionToHistory({
        type: 'buy',
        symbol: newHolding.symbol,
        name: newHolding.name,
        shares: newHolding.shares,
        price: newHolding.avgPrice,
        amount: newHolding.shares * newHolding.avgPrice,
        description: `Bought ${newHolding.shares} shares of ${newHolding.symbol} at $${newHolding.avgPrice.toFixed(2)}`
      });
      
      setIsAddStockModal(false);
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Error adding stock. Please try again.');
    }
  }, [holdings, cashBalance, calculateMetrics, savePortfolioData, addTransactionToHistory]);

  const handleSellStock = useCallback((symbol: string, sharesToSell: number, sellPrice: number) => {
    const holding = holdings.find(h => h.symbol === symbol);
    if (!holding) return;

    const saleValue = sharesToSell * sellPrice;
    const remainingShares = holding.shares - sharesToSell;

    let updatedHoldings: PortfolioHolding[];
    if (remainingShares === 0) {
      // Remove the entire position
      updatedHoldings = holdings.filter(h => h.symbol !== symbol);
    } else {
      // Update the position with remaining shares
      updatedHoldings = holdings.map(h =>
        h.symbol === symbol
          ? { ...h, shares: remainingShares }
          : h
      );
    }

    // Add cash from sale
    const newCashBalance = cashBalance + saleValue;
    
    setHoldings(updatedHoldings);
    setCashBalance(newCashBalance);
    calculateMetrics(updatedHoldings, newCashBalance);
    savePortfolioData(updatedHoldings, newCashBalance);

    // Add transaction to history
    addTransactionToHistory({
      type: 'sell',
      symbol: holding.symbol,
      name: holding.name,
      shares: sharesToSell,
      price: sellPrice,
      amount: saleValue,
      description: `Sold ${sharesToSell} shares of ${holding.symbol} at $${sellPrice.toFixed(2)}`
    });

    setIsSellStockModalOpen(false);
    setSelectedHolding(null);
  }, [holdings, cashBalance, calculateMetrics, savePortfolioData, addTransactionToHistory]);

  const handleUpdateStock = useCallback((symbol: string, updatedHolding: Omit<PortfolioHolding, 'currentPrice' | 'value' | 'return' | 'returnPercentage'>) => {
    const updatedHoldings = holdings.map(holding =>
      holding.symbol === symbol
        ? { ...updatedHolding, currentPrice: holding.currentPrice, value: 0, return: 0, returnPercentage: 0 }
        : holding
    );
    setHoldings(updatedHoldings);
    calculateMetrics(updatedHoldings, cashBalance);
    savePortfolioData(updatedHoldings, cashBalance);
    setIsEditStockModalOpen(false);
    setSelectedHolding(null);
  }, [holdings, cashBalance, calculateMetrics, savePortfolioData]);

  const handleRemoveStock = useCallback((symbol: string) => {
    const holding = holdings.find(h => h.symbol === symbol);
    if (holding) {
      // Add transaction to history for removal
      addTransactionToHistory({
        type: 'sell',
        symbol: holding.symbol,
        name: holding.name,
        shares: holding.shares,
        price: holding.currentPrice,
        amount: holding.value,
        description: `Removed ${holding.shares} shares of ${holding.symbol} from portfolio`
      });
    }

    const updatedHoldings = holdings.filter(holding => holding.symbol !== symbol);
    setHoldings(updatedHoldings);
    calculateMetrics(updatedHoldings, cashBalance);
    savePortfolioData(updatedHoldings, cashBalance);
  }, [holdings, cashBalance, calculateMetrics, savePortfolioData, addTransactionToHistory]);

  const handleEditStock = useCallback((holding: PortfolioHolding) => {
    setSelectedHolding(holding);
    setIsEditStockModalOpen(true);
  }, []);

  const handleSellStockClick = useCallback((holding: PortfolioHolding) => {
    setSelectedHolding(holding);
    setIsSellStockModalOpen(true);
  }, []);

  const handleCashAction = useCallback((action: 'deposit' | 'withdraw') => {
    setCashAction(action);
    setIsCashModalOpen(true);
  }, []);

  const handleCashTransaction = useCallback((amount: number) => {
    let newCashBalance = cashBalance;

    if (cashAction === 'deposit') {
      newCashBalance += amount;
    } else if (cashAction === 'withdraw') {
      if (amount > cashBalance) {
        alert('Insufficient cash balance for withdrawal');
        return;
      }
      newCashBalance -= amount;
    }

    setCashBalance(newCashBalance);
    localStorage.setItem('portfolioCash', newCashBalance.toString());
    calculateMetrics(holdings, newCashBalance);

    // Add transaction to history
    addTransactionToHistory({
      type: cashAction,
      amount: amount,
      description: `${cashAction === 'deposit' ? 'Deposited' : 'Withdrew'} $${amount.toLocaleString()}`
    });

    setIsCashModalOpen(false);
  }, [cashBalance, cashAction, holdings, calculateMetrics, addTransactionToHistory]);

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'deposit':
        handleCashAction('deposit');
        break;
      case 'buy':
        setIsAddStockModal(true);
        break;
      case 'sell':
        if (holdings.length === 0) {
          alert('No stocks to sell. Add some stocks first.');
          return;
        }
        // Show a simple alert for now - in a real app, you might want to show a stock selection modal
        alert('Select a stock from your holdings to sell');
        break;
      case 'withdraw':
        handleCashAction('withdraw');
        break;
    }
  }, [handleCashAction, holdings]);

  if (isLoading) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-64">
          <div className="text-text-secondary">Loading portfolio...</div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="space-y-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Value</h3>
            <div className="text-3xl font-bold">${metrics.totalValue.toLocaleString()}</div>
            <div className={`text-sm ${metrics.totalReturn >= 0 ? 'text-success' : 'text-error'}`}>
              {metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn.toFixed(2)} ({metrics.returnPercentage.toFixed(2)}%)
            </div>
          </div>
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Return</h3>
            <div className={`text-3xl font-bold ${metrics.totalReturn >= 0 ? 'text-success' : 'text-error'}`}>
              {metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn.toFixed(2)}
            </div>
            <div className="text-sm text-text-secondary">
              {metrics.returnPercentage.toFixed(2)}% return
            </div>
          </div>
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Cash Balance</h3>
            <div className="text-3xl font-bold text-success">${cashBalance.toLocaleString()}</div>
            <div className="text-sm text-text-secondary">
              Available for trading
            </div>
          </div>
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Holdings</h3>
            <div className="text-3xl font-bold">{holdings.length}</div>
            <div className="text-sm text-text-secondary">Different stocks</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Asset Distribution */}
          <div className="lg:col-span-2">
            <AssetDistribution holdings={holdings} totalValue={metrics.totalValue} cashBalance={cashBalance} />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleQuickAction('deposit')}
                className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Deposit Funds
              </button>
              <button
                onClick={() => handleQuickAction('buy')}
                className="w-full bg-success text-white py-3 px-4 rounded-lg hover:bg-success/90 transition-colors"
              >
                Buy Stocks
              </button>
              <button
                onClick={() => handleQuickAction('sell')}
                className="w-full bg-error text-white py-3 px-4 rounded-lg hover:bg-error/90 transition-colors"
              >
                Sell Stocks
              </button>
              <button
                onClick={() => handleQuickAction('withdraw')}
                className="w-full bg-card text-text-primary py-3 px-4 rounded-lg hover:bg-background transition-colors border border-card"
              >
                Withdraw Funds
              </button>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Asset Holdings</h2>
            <button
              onClick={() => setIsAddStockModal(true)}
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Add Stock
            </button>
          </div>
          <HoldingsTable
            holdings={holdings}
            onRemoveStock={handleRemoveStock}
            onEditStock={handleEditStock}
            onSellStock={handleSellStockClick}
          />
        </div>
      </div>

      {/* Add Stock Modal */}
      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModal(false)}
        onAddStock={handleAddStock}
        existingHoldings={holdings}
      />

      {/* Edit Stock Modal */}
      <EditStockModal
        isOpen={isEditStockModalOpen}
        onClose={() => {
          setIsEditStockModalOpen(false);
          setSelectedHolding(null);
        }}
        onUpdateStock={handleUpdateStock}
        holding={selectedHolding}
      />

      {/* Sell Stock Modal */}
      <SellStockModal
        isOpen={isSellStockModalOpen}
        onClose={() => {
          setIsSellStockModalOpen(false);
          setSelectedHolding(null);
        }}
        onSellStock={handleSellStock}
        holding={selectedHolding}
      />

      {/* Cash Modal */}
      <CashModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        onTransaction={handleCashTransaction}
        action={cashAction}
        currentBalance={cashBalance}
      />
    </Dashboard>
  );
} 