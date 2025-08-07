"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

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

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: (symbol: string, updatedHolding: Omit<PortfolioHolding, 'currentPrice' | 'value' | 'return' | 'returnPercentage'>) => void;
  holding: PortfolioHolding | null;
}

export function EditStockModal({ isOpen, onClose, onUpdateStock, holding }: EditStockModalProps) {
  const [shares, setShares] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when holding changes
  useEffect(() => {
    if (holding) {
      setShares(holding.shares.toString());
      setAvgPrice(holding.avgPrice.toString());
    }
  }, [holding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!holding || !shares || !avgPrice) {
      alert("Please fill in all fields");
      return;
    }

    const sharesNum = parseFloat(shares);
    const avgPriceNum = parseFloat(avgPrice);

    if (isNaN(sharesNum) || isNaN(avgPriceNum) || sharesNum <= 0 || avgPriceNum <= 0) {
      alert("Please enter valid numbers");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedHolding: Omit<PortfolioHolding, 'currentPrice' | 'value' | 'return' | 'returnPercentage'> = {
        symbol: holding.symbol,
        name: holding.name,
        shares: sharesNum,
        avgPrice: avgPriceNum,
        currentPrice: 0, // Will be updated by the portfolio
        value: 0,
        return: 0,
        returnPercentage: 0,
      };

      onUpdateStock(holding.symbol, updatedHolding);
      resetForm();
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Error updating stock in portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShares("");
    setAvgPrice("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !holding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card">
          <h2 className="text-xl font-bold">Edit Stock Position</h2>
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
            </div>
          </div>

          {/* Number of Shares */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Number of Shares
            </label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="Enter number of shares"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 rounded-lg bg-card text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          {/* Average Price */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Average Price per Share ($)
            </label>
            <input
              type="number"
              value={avgPrice}
              onChange={(e) => setAvgPrice(e.target.value)}
              placeholder="Enter average price"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 rounded-lg bg-card text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          {/* Total Investment Preview */}
          {shares && avgPrice && !isNaN(parseFloat(shares)) && !isNaN(parseFloat(avgPrice)) && (
            <div className="bg-card rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-1">Total Investment</div>
              <div className="text-lg font-semibold text-text-primary">
                ${(parseFloat(shares) * parseFloat(avgPrice)).toFixed(2)}
              </div>
            </div>
          )}

          {/* Current vs New Investment Comparison */}
          {shares && avgPrice && !isNaN(parseFloat(shares)) && !isNaN(parseFloat(avgPrice)) && (
            <div className="bg-card rounded-lg p-4 space-y-2">
              <div className="text-sm text-text-secondary">Investment Comparison</div>
              <div className="flex justify-between text-sm">
                <span>Current Investment:</span>
                <span>${(holding.shares * holding.avgPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>New Investment:</span>
                <span>${(parseFloat(shares) * parseFloat(avgPrice)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Difference:</span>
                <span className={parseFloat(shares) * parseFloat(avgPrice) - (holding.shares * holding.avgPrice) >= 0 ? 'text-success' : 'text-error'}>
                  {parseFloat(shares) * parseFloat(avgPrice) - (holding.shares * holding.avgPrice) >= 0 ? '+' : ''}
                  ${(parseFloat(shares) * parseFloat(avgPrice) - (holding.shares * holding.avgPrice)).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!shares || !avgPrice || isSubmitting}
            className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Position
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 