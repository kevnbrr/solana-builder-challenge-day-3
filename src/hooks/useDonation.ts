import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createDonationTransaction, getProjectPDA } from '../lib/solana';
import { PublicKey } from '@solana/web3.js';

interface DonationError {
  message: string;
  type: 'wallet' | 'transaction' | 'pda' | 'network' | 'unknown';
  retry?: boolean;
}

export function useDonation(projectOwner: PublicKey) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<DonationError | null>(null);

  const clearError = () => setError(null);

  const donate = async (amount: number) => {
    if (!publicKey) {
      setError({
        message: 'Please connect your wallet first',
        type: 'wallet',
        retry: true
      });
      throw new Error('Wallet not connected');
    }

    if (amount <= 0) {
      setError({
        message: 'Please enter a valid amount',
        type: 'transaction',
        retry: true
      });
      throw new Error('Invalid amount');
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get the project PDA with retries
      let projectPDA: PublicKey;
      try {
        [projectPDA] = await getProjectPDA(projectOwner);
      } catch (err) {
        setError({
          message: 'Unable to locate project account. Please try again later.',
          type: 'pda',
          retry: true
        });
        throw new Error('Failed to get project PDA');
      }
      
      // Create and send the transaction
      let transaction;
      try {
        transaction = await createDonationTransaction(
          publicKey,
          projectPDA,
          amount,
          connection
        );
      } catch (err) {
        if (err instanceof Error && err.message.includes('insufficient balance')) {
          setError({
            message: 'Insufficient SOL balance for this donation',
            type: 'transaction',
            retry: false
          });
        } else {
          setError({
            message: 'Failed to create transaction. Please try again.',
            type: 'transaction',
            retry: true
          });
        }
        throw err;
      }

      let signature;
      try {
        signature = await sendTransaction(transaction, connection, {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
          maxRetries: 3
        });
      } catch (err) {
        setError({
          message: 'Transaction rejected. Please try again.',
          type: 'transaction',
          retry: true
        });
        throw err;
      }

      try {
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash: transaction.recentBlockhash!,
          lastValidBlockHeight: transaction.lastValidBlockHeight!
        }, 'confirmed');
        
        if (confirmation.value.err) {
          setError({
            message: 'Transaction failed to confirm. Please try again.',
            type: 'network',
            retry: true
          });
          throw new Error('Transaction failed to confirm');
        }
      } catch (err) {
        setError({
          message: 'Network error. Please try again later.',
          type: 'network',
          retry: true
        });
        throw err;
      }

      return signature;
    } catch (err) {
      if (!error) { // Only set generic error if no specific error was set
        setError({
          message: 'An unexpected error occurred. Please try again.',
          type: 'unknown',
          retry: true
        });
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    donate,
    isLoading,
    error,
    clearError
  };
}