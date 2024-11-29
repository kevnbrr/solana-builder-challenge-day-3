import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

export function WalletButton() {
  const { connected } = useWallet();

  return (
    <WalletMultiButton className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
      <Wallet className="w-5 h-5" />
      {connected ? 'Connected' : 'Connect Wallet'}
    </WalletMultiButton>
  );
}