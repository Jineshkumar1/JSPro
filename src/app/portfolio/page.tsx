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
import { useAuth } from "@/contexts/AuthContext";
import { fetchPortfolioSnapshot, setCashBalance as setCashBalanceDb, upsertHolding, deleteHolding, updateHoldingShares, addTransaction as addTxn } from "@/services/portfolio";

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
  const { user } = useAuth()
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

  // Persist portfolio to Supabase for signed-in users
  const savePortfolioData = useCallback(async (holdingsData: PortfolioHolding[], cashData: number) => {
    try {
      if (!user) return
      const snapshot = await fetchPortfolioSnapshot(user.id)
      await setCashBalanceDb(snapshot.portfolioId, cashData)
      await Promise.all(
        holdingsData.map(h =>
          upsertHolding(snapshot.portfolioId, {
            symbol: h.symbol,
            name: h.name,
            shares: h.shares,
            avgPrice: h.avgPrice,
            currentPrice: h.currentPrice,
          })
        )
      )
    } catch (error) {
      console.error('Error saving portfolio data:', error)
    }
  }, [user]);

  // Add transaction to history (Supabase)
  const addTransactionToHistory = useCallback(async (t: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      if (!user) return
      const snapshot = await fetchPortfolioSnapshot(user.id)
      await addTxn(snapshot.portfolioId, {
        type: t.type,
        symbol: t.symbol,
        name: t.name,
        shares: t.shares,
        price: t.price,
        amount: t.amount,
        description: t.description,
      })
    } catch (error) {
      console.error('Error saving transaction history:', error)
    }
  }, [user]);

  // Load portfolio data from Supabase for signed-in users
  const loadPortfolioData = useCallback(async () => {
    try {
      if (!user) {
        setHoldings([])
        setCashBalance(0)
        setIsLoading(false)
        return
      }
      const snapshot = await fetchPortfolioSnapshot(user.id)
      const mapped: PortfolioHolding[] = snapshot.holdings.map(h => {
        const value = h.shares * (h.currentPrice ?? 0)
        const cost = h.shares * h.avgPrice
        const ret = value - cost
        const retPct = cost > 0 ? (ret / cost) * 100 : 0
        return {
          symbol: h.symbol,
          name: h.name,
          shares: h.shares,
          avgPrice: h.avgPrice,
          currentPrice: h.currentPrice ?? 0,
          value,
          return: ret,
          returnPercentage: retPct,
        }
      })
      setHoldings(mapped)
      setCashBalance(snapshot.cashBalance)
      calculateMetrics(mapped, snapshot.cashBalance)
    } catch (error) {
      console.error('Error loading portfolio data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user, calculateMetrics]);

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

  // Load data when auth/user is ready or changes
  useEffect(() => {
    loadPortfolioData();
  }, [user, loadPortfolioData]);

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

  const handleCashTransaction = useCallback(async (amount: number) => {
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
    try {
      if (user) {
        const snapshot = await fetchPortfolioSnapshot(user.id)
        await setCashBalanceDb(snapshot.portfolioId, newCashBalance)
      }
    } catch {}
    calculateMetrics(holdings, newCashBalance);

    // Add transaction to history
    addTransactionToHistory({
      type: cashAction,
      amount: amount,
      description: `${cashAction === 'deposit' ? 'Deposited' : 'Withdrew'} $${amount.toLocaleString()}`
    });

    setIsCashModalOpen(false);
  }, [user, cashBalance, cashAction, holdings, calculateMetrics, addTransactionToHistory]);

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