"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { searchStocks, SearchResult } from "@/app/actions/stockActions";

interface SearchBarProps {
  onStockSelect?: (symbol: string) => void;
  placeholder?: string;
}

export function SearchBar({ onStockSelect, placeholder = "Search stocks..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Popular stocks for quick access
  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "META", name: "Meta Platforms Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "NFLX", name: "Netflix Inc." },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchStocks(query);
          setResults(searchResults.slice(0, 10)); // Limit to 10 results
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleStockSelect = (symbol: string) => {
    setQuery(symbol);
    setShowResults(false);
    if (onStockSelect) {
      onStockSelect(symbol);
    } else {
      // Default behavior: open stock detail modal
      window.open(`/stock/${symbol}`, '_blank');
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg bg-card pl-10 pr-10 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          onFocus={() => setShowResults(true)}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-lg bg-card shadow-lg ring-1 ring-black/5">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-text-secondary">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <button
                  key={`${result.symbol}-${index}`}
                  onClick={() => handleStockSelect(result.symbol)}
                  className="flex w-full items-center gap-3 p-3 text-left hover:bg-background transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">
                      {result.symbol}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {result.shortname || result.longname}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {result.exchange} • {result.typeDisp}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-text-secondary">
              No stocks found
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-2 text-sm font-medium text-text-primary">
                Popular Stocks
              </div>
              <div className="space-y-1">
                {popularStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock.symbol)}
                    className="flex w-full items-center gap-2 rounded p-2 text-left hover:bg-background transition-colors"
                  >
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <div>
                      <div className="font-medium text-text-primary">
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {stock.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 