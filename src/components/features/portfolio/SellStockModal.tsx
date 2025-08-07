"use client";

import { useState, useEffect } from "react";
import { X, TrendingDown, DollarSign } from "lucide-react";

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

interface SellStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSellStock: (symbol: string, sharesToSell: number, sellPrice: number) => void;
  holding: PortfolioHolding | null;
}

export function SellStockModal({ isOpen, onClose, onSellStock, holding }: SellStockModalProps) {
  const [sharesToSell, setSharesToSell] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when holding changes
  useEffect(() => {
    if (holding) {
      setSharesToSell("");
      setSellPrice(holding.currentPrice.toString());
    }
  }, [holding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!holding || !sharesToSell || !sellPrice) {
      alert("Please fill in all fields");
      return;
    }

    const sharesNum = parseFloat(sharesToSell);
    const sellPriceNum = parseFloat(sellPrice);

    if (isNaN(sharesNum) || isNaN(sellPriceNum) || sharesNum <= 0 || sellPriceNum <= 0) {
      alert("Please enter valid numbers");
      return;
    }

    if (sharesNum > holding.shares) {
      alert("You cannot sell more shares than you own");
      return;
    }

    setIsSubmitting(true);
    try {
      onSellStock(holding.symbol, sharesNum, sellPriceNum);
      resetForm();
    } catch (error) {
      console.error("Error selling stock:", error);
      alert("Error selling stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSharesToSell("");
    setSellPrice("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const calculateSaleValue = () => {
    if (!sharesToSell || !sellPrice) return 0;
    const shares = parseFloat(sharesToSell);
    const price = parseFloat(sellPrice);
    return isNaN(shares) || isNaN(price) ? 0 : shares * price;
  };

  const calculateProfitLoss = () => {
    if (!holding || !sharesToSell || !sellPrice) return 0;
    const shares = parseFloat(sharesToSell);
    const price = parseFloat(sellPrice);
    if (isNaN(shares) || isNaN(price)) return 0;
    
    const saleValue = shares * price;
    const costBasis = shares * holding.avgPrice;
    return saleValue - costBasis;
  };

  const getProfitLossPercentage = () => {
    if (!holding || !sharesToSell || !sellPrice) return 0;
    const shares = parseFloat(sharesToSell);
    const price = parseFloat(sellPrice);
    if (isNaN(shares) || isNaN(price)) return 0;
    
    const costBasis = shares * holding.avgPrice;
    if (costBasis === 0) return 0;
    
    const profitLoss = calculateProfitLoss();
    return (profitLoss / costBasis) * 100;
  };

  if (!isOpen || !holding) return null;

  const saleValue = calculateSaleValue();
  const profitLoss = calculateProfitLoss();
  const profitLossPercentage = getProfitLossPercentage();
  const isProfit = profitLoss >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-error/20 text-error">
              <TrendingDown className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">Sell Stock</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Stock Info */}
          <div className="bg-card rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">{holding.symbol}</div>
              <div className="text-sm text-text-secondary">{holding.name}</div>
              <div className="text-sm text-text-secondary mt-1">
                Current Price: ${holding.currentPrice.toFixed(2)}
              </div>
              <div className="text-sm text-text-secondary">
                Owned: {holding.shares.toLocaleString()} shares
              </div>
            </div>
          </div>

          {/* Shares to Sell */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Shares to Sell
            </label>
            <input
              type="number"
              value={sharesToSell}
              onChange={(e) => setSharesToSell(e.target.value)}
              placeholder={`Enter shares (max: ${holding.shares})`}
              step="0.01"
              min="0"
              max={holding.shares}
              className="w-full px-4 py-2 rounded-lg bg-card text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <div className="text-xs text-text-secondary mt-1">
              Available: {holding.shares.toLocaleString()} shares
            </div>
          </div>

          {/* Sell Price */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Sell Price per Share ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="Enter sell price"
                step="0.01"
                min="0"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-card text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
          </div>

          {/* Quick Price Buttons */}
          <div>
            <div className="text-sm text-text-secondary mb-3">Quick Prices</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                holding.currentPrice * 0.95,
                holding.currentPrice,
                holding.currentPrice * 1.05
              ].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setSellPrice(price.toFixed(2))}
                  className="px-3 py-2 text-sm rounded-lg bg-card text-text-primary hover:bg-background transition-colors border border-card"
                >
                  ${price.toFixed(2)}
                </button>
              ))}
            </div>
          </div>

          {/* Sale Preview */}
          {sharesToSell && sellPrice && !isNaN(parseFloat(sharesToSell)) && !isNaN(parseFloat(sellPrice)) && (
            <div className="bg-card rounded-lg p-4 space-y-3">
              <div className="text-sm text-text-secondary">Sale Preview</div>
              
              <div className="flex justify-between text-sm">
                <span>Sale Value:</span>
                <span className="font-medium">${saleValue.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Cost Basis:</span>
                <span>${(parseFloat(sharesToSell) * holding.avgPrice).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm font-medium border-t border-background pt-2">
                <span>Profit/Loss:</span>
                <span className={isProfit ? 'text-success' : 'text-error'}>
                  {isProfit ? '+' : ''}${profitLoss.toFixed(2)} ({profitLossPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          )}

          {/* Warning for selling all shares */}
          {sharesToSell && parseFloat(sharesToSell) === holding.shares && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <div className="text-sm text-warning">
                ⚠️ You're selling all shares of {holding.symbol}. This will remove the position from your portfolio.
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!sharesToSell || !sellPrice || isNaN(parseFloat(sharesToSell)) || isNaN(parseFloat(sellPrice)) || parseFloat(sharesToSell) <= 0 || parseFloat(sharesToSell) > holding.shares || isSubmitting}
            className="w-full bg-error text-white py-3 px-4 rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Selling...
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4" />
                Sell {sharesToSell ? parseFloat(sharesToSell).toLocaleString() : '0'} Shares
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 