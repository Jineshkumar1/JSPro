"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { SearchBar } from "@/components/features/SearchBar";
import { StockDetailModal } from "@/components/features/StockDetailModal";

export function Header() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  return (
    <>
      <header className="fixed left-sidebar right-0 top-0 z-30 flex h-16 items-center border-b border-card bg-background px-4">
        <div className="flex flex-1 items-center">
          <SearchBar
            onStockSelect={handleStockSelect}
            placeholder="Search stocks, news, or settings..."
          />
        </div>

        <div className="flex items-center">
          <button className="relative rounded-full p-2 text-text-secondary hover:bg-card hover:text-text-primary">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>
      </header>

      {/* Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal
          symbol={selectedStock}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
} 