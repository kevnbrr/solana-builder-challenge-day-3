import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { WalletButton } from './wallet-button';
import { useDonation } from '../hooks/useDonation';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DonationFormProps {
  projectOwner: PublicKey;
  onSuccess?: (signature: string) => void;
}

export function DonationForm({ projectOwner, onSuccess }: DonationFormProps) {
  const { connected } = useWallet();
  const { donate, isLoading, error, clearError } = useDonation(projectOwner);
  const [amount, setAmount] = useState('');

  // Clear error when amount changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isLoading) return;

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const signature = await donate(parsedAmount);
      setAmount('');
      onSuccess?.(signature);
    } catch (err) {
      console.error('Donation failed:', err);
    }
  };

  const handleRetry = () => {
    clearError();
    if (error?.type === 'wallet') {
      // The wallet button will handle the connection
      return;
    }
    // For other errors, we can retry the last donation attempt
    if (amount) {
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Donation Amount (SOL)
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || parseFloat(value) >= 0) {
              setAmount(value);
            }
          }}
          placeholder="0.1"
          min="0"
          step="0.1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error.message}</p>
              {error.retry && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-2 flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!connected ? (
        <div className="flex justify-center">
          <WalletButton />
        </div>
      ) : (
        <button
          type="submit"
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            'Donate'
          )}
        </button>
      )}
    </form>
  );
}