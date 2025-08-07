"use client";

import { useState } from "react";
import { X, Search, Plus } from "lucide-react";
import { searchStocks, SearchResult } from "@/app/actions/stockActions";

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

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (holding: Omit<PortfolioHolding, 'currentPrice' | 'value' | 'return' | 'returnPercentage'>) => void;
  existingHoldings: PortfolioHolding[];
}

export function AddStockModal({ isOpen, onClose, onAddStock, existingHoldings }: AddStockModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStock, setSelectedStock] = useState<SearchResult | null>(null);
  const [shares, setShares] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchStocks(query);
        // Filter out stocks already in portfolio
        const filteredResults = results.filter(
          result => !existingHoldings.some(holding => holding.symbol === result.symbol)
        );
        setSearchResults(filteredResults.slice(0, 10));
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleStockSelect = (stock: SearchResult) => {
    setSelectedStock(stock);
    setSearchResults([]);
    setSearchQuery(stock.symbol);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStock || !shares || !avgPrice) {
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
      const newHolding: Omit<PortfolioHolding, 'currentPrice' | 'value' | 'return' | 'returnPercentage'> = {
        symbol: selectedStock.symbol,
        name: selectedStock.shortname || selectedStock.longname || selectedStock.symbol,
        shares: sharesNum,
        avgPrice: avgPriceNum,
        currentPrice: 0, // Will be updated by the portfolio
        value: 0,
        return: 0,
        returnPercentage: 0,
      };

      onAddStock(newHolding);
      resetForm();
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("Error adding stock to portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedStock(null);
    setShares("");
    setAvgPrice("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card">
          <h2 className="text-xl font-bold">Add Stock to Portfolio</h2>
          <button
            onClick={handleClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Stock Search */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Stock Symbol
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search stocks (e.g., AAPL, MSFT)"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-card text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto bg-card rounded-lg border border-background">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.symbol}-${index}`}
                    onClick={() => handleStockSelect(result)}
                    className="w-full p-3 text-left hover:bg-background transition-colors border-b border-background last:border-b-0"
                  >
                    <div className="font-medium text-text-primary">{result.symbol}</div>
                    <div className="text-sm text-text-secondary">
                      {result.shortname || result.longname}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {result.exchange} • {result.typeDisp}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isSearching && (
              <div className="mt-2 text-sm text-text-secondary">
                Searching...
              </div>
            )}
          </div>

          {/* Selected Stock Info */}
          {selectedStock && (
            <div className="bg-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-text-primary">{selectedStock.symbol}</div>
                  <div className="text-sm text-text-secondary">
                    {selectedStock.shortname || selectedStock.longname}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStock(null)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedStock || !shares || !avgPrice || isSubmitting}
            className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Portfolio
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 