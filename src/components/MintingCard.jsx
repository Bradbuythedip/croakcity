import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Alert from '@mui/material/Alert';
import { ethers } from 'ethers';
import usePelagusWallet from '../hooks/usePelagusWallet';

const GlassCard = ({ children, opacity = 0.8 }) => (
  <div 
    className="rounded-xl backdrop-blur-md p-6 shadow-lg"
    style={{
      background: `rgba(30, 30, 30, ${opacity})`,
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    {children}
  </div>
);

const MintingCard = () => {
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [mintingError, setMintingError] = useState(null);
  const [hasMinted, setHasMinted] = useState(false); // Track if user has minted before
  
  // Calculate price based on whether user has minted before
  const getMintPrice = (amount) => {
    if (!hasMinted) return 0; // First mint is free
    return 1 * amount; // 1 QUAI per NFT after first mint
  };
  
  const {
    account,
    error: walletError,
    isPelagus,
    isQuaiNetwork,
    chainId,
    connectWallet,
    provider
  } = usePelagusWallet();

  useEffect(() => {
    // Reset minting error when wallet state changes
    setMintingError(null);
  }, [account, chainId]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection error:', error);
      // The error is already handled in the hook
    }
  };

  const handleMint = async () => {
    if (!account) {
      await handleConnectWallet();
      return;
    }

    if (!isPelagus) {
      return; // The hook will handle the error message
    }

    if (!isQuaiNetwork(chainId)) {
      return; // The hook will handle the error message
    }

    if (!provider) {
      setMintingError('Wallet provider not initialized');
      return;
    }

    setIsMinting(true);
    setMintingError(null);
    
    try {
      // Example contract interaction (replace with your actual contract address and ABI)
      const contractAddress = '0xYourContractAddress';
      const mintPrice = ethers.parseUnits((0.1 * mintAmount).toString(), 18); // Convert to wei

      // Create transaction object
      const transaction = {
        from: account,
        to: contractAddress,
        value: mintPrice.toString(),
        data: '0x', // Add your contract method call data here
      };

      // Send transaction using Pelagus provider
      const txHash = await provider.request({
        method: 'quai_sendTransaction',
        params: [transaction],
      });

      // Wait for transaction confirmation
      const receipt = await provider.request({
        method: 'quai_getTransactionReceipt',
        params: [txHash],
      });

      if (receipt && receipt.status === '0x1') {
        alert('Successfully minted!');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Minting error:', error);
      setMintingError(error.message || 'Failed to mint. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  const getButtonText = () => {
    if (!isPelagus) return 'Install Pelagus Wallet';
    if (!account) return 'Connect Wallet';
    if (!isQuaiNetwork(chainId)) return 'Switch to Quai Network';
    if (isMinting) return <CircularProgress size={24} className="text-white" />;
    return 'Mint Now';
  };

  const isButtonDisabled = () => {
    return isMinting || (account && !isQuaiNetwork(chainId));
  };

  return (
    <GlassCard opacity={0.85} className="max-w-lg mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <Typography variant="h4" className="font-display font-bold mb-2 text-white">
            Croak City NFT
          </Typography>
          <Typography variant="body1" className="text-gray-300">
            Mint your unique Croak City NFT on the Quai Network • <span className="text-green-400 font-medium">First Mint FREE!</span>
          </Typography>
        </div>

        {(walletError || mintingError) && (
          <Alert severity="error" className="bg-red-900/20 border border-red-500/50">
            {walletError || mintingError}
          </Alert>
        )}

        <div className="p-6 rounded-lg border border-white/10 backdrop-blur-sm"
             style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <Typography variant="h6" className="mb-4 text-white">
            Mint Amount
          </Typography>
          <Slider
            value={mintAmount}
            onChange={(_, value) => setMintAmount(value)}
            min={1}
            max={10}
            marks
            step={1}
            className="text-primary"
            disabled={!account || !isQuaiNetwork(chainId)}
          />
          <div className="flex justify-between mt-4">
            <Typography className="text-white/90">
              Price: {getMintPrice(mintAmount)} QUAI{' '}
              {!hasMinted && <span className="text-green-400">(First mint FREE!)</span>}
            </Typography>
            <Typography className="text-white/90">
              Amount: {mintAmount}
            </Typography>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
              boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
              height: 48,
              '&:disabled': {
                background: 'linear-gradient(45deg, #666 30%, #555 90%)',
              }
            }}
            disabled={true}
          >
            Minting Coming Soon
          </Button>
          
          {/* Overlay with coming soon badge */}
          <div className="absolute -top-3 right-0 transform translate-x-1/4">
            <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              Coming Soon
            </div>
          </div>
        </div>

        <div className="space-y-2 text-center text-sm">
          <Typography variant="body2" className="text-gray-400">
            Maximum 10 NFTs per transaction
          </Typography>
          <Typography variant="body2" className="text-green-400 font-medium">
            First mint is FREE! • Subsequent mints 1 QUAI each
          </Typography>
        </div>
      </div>
    </GlassCard>
  );
};

export default MintingCard;