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
  const mintPrice = 0.1; // QUAI per NFT
  
  const {
    account,
    error: walletError,
    isPelagus,
    isQuaiNetwork,
    chainId,
    connectWallet,
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

    setIsMinting(true);
    setMintingError(null);
    
    try {
      // Here you would normally:
      // 1. Get the contract instance
      // 2. Call the mint function
      // 3. Wait for transaction confirmation
      
      // For now, we'll simulate the minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Minting will be implemented when the smart contract is deployed');
    } catch (error) {
      console.error('Minting error:', error);
      setMintingError('Failed to mint. Please try again.');
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
            Mint your unique Croak City NFT on the Quai Network
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
              Price: {(mintPrice * mintAmount).toFixed(2)} QUAI
            </Typography>
            <Typography className="text-white/90">
              Amount: {mintAmount}
            </Typography>
          </div>
        </div>

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
          onClick={handleMint}
          disabled={isButtonDisabled()}
        >
          {getButtonText()}
        </Button>

        <div className="text-center text-sm">
          <Typography variant="body2" className="text-gray-400">
            Maximum 10 NFTs per transaction
          </Typography>
        </div>
      </div>
    </GlassCard>
  );
};

export default MintingCard;