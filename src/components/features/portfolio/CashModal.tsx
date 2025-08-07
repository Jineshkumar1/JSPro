"use client";

import { useState } from "react";
import { X, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface CashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransaction: (amount: number) => void;
  action: 'deposit' | 'withdraw';
  currentBalance: number;
}

export function CashModal({ isOpen, onClose, onTransaction, action, currentBalance }: CashModalProps) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (action === 'withdraw' && amountNum > currentBalance) {
      alert("Insufficient cash balance for withdrawal");
      return;
    }

    setIsSubmitting(true);
    try {
      onTransaction(amountNum);
      resetForm();
    } catch (error) {
      console.error("Error processing transaction:", error);
      alert("Error processing transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAmount("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getQuickAmounts = () => {
    if (action === 'deposit') {
      return [100, 500, 1000, 5000, 10000];
    } else {
      return [100, 500, 1000, Math.floor(currentBalance / 2), currentBalance];
    }
  };

  if (!isOpen) return null;

  const isDeposit = action === 'deposit';
  const quickAmounts = getQuickAmounts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDeposit ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
              {isDeposit ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            </div>
            <h2 className="text-xl font-bold">
              {isDeposit ? 'Deposit Funds' : 'Withdraw Funds'}
            </h2>
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
          {/* Current Balance */}
          <div className="bg-card rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm text-text-secondary mb-1">Current Cash Balance</div>
              <div className="text-2xl font-bold text-accent">${currentBalance.toLocaleString()}</div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {isDeposit ? 'Deposit Amount ($)' : 'Withdrawal Amount ($)'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter ${isDeposit ? 'deposit' : 'withdrawal'} amount`}
                step="0.01"
                min="0"
                max={isDeposit ? undefined : currentBalance}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-card text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <div className="text-sm text-text-secondary mb-3">Quick Amounts</div>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-3 py-2 text-sm rounded-lg bg-card text-text-primary hover:bg-background transition-colors border border-card"
                >
                  ${quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Preview */}
          {amount && !isNaN(parseFloat(amount)) && (
            <div className="bg-card rounded-lg p-4 space-y-2">
              <div className="text-sm text-text-secondary">Transaction Preview</div>
              <div className="flex justify-between text-sm">
                <span>Current Balance:</span>
                <span>${currentBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{isDeposit ? 'Deposit Amount:' : 'Withdrawal Amount:'}</span>
                <span className={isDeposit ? 'text-success' : 'text-error'}>
                  {isDeposit ? '+' : '-'}${parseFloat(amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t border-background pt-2">
                <span>New Balance:</span>
                <span className="text-accent">
                  ${(currentBalance + (isDeposit ? parseFloat(amount) : -parseFloat(amount))).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Warning for insufficient funds */}
          {action === 'withdraw' && amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > currentBalance && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <div className="text-sm text-error">
                ⚠️ Insufficient funds. You cannot withdraw more than your current balance.
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || (action === 'withdraw' && parseFloat(amount) > currentBalance) || isSubmitting}
            className={`w-full py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isDeposit
                ? 'bg-success text-white hover:bg-success/90'
                : 'bg-error text-white hover:bg-error/90'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                {isDeposit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {isDeposit ? 'Deposit Funds' : 'Withdraw Funds'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 