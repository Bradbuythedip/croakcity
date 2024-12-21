import { useState, useEffect, useCallback } from 'react';

// Quai Network Chain IDs
const QUAI_CHAIN_IDS = {
  PRIME: '0x2329', // 9001
  REGION1: '0x232a', // 9002
  REGION2: '0x232b', // 9003
  REGION3: '0x232c', // 9004
};

const PELAGUS_DOWNLOAD_URL = 'https://chrome.google.com/webstore/detail/pelagus/gaegollnpijhedifeeeepdoffkgfcmbc';

const usePelagusWallet = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isPelagus, setIsPelagus] = useState(false);

  const isPelagusInstalled = useCallback(() => {
    return window.ethereum?.isPelagus === true;
  }, []);

  const isQuaiNetwork = useCallback((chainId) => {
    return Object.values(QUAI_CHAIN_IDS).includes(chainId?.toLowerCase());
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (!isPelagusInstalled()) {
        setError('Please install Pelagus wallet');
        return;
      }

      setIsPelagus(true);
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        if (!isQuaiNetwork(chainId)) {
          setError('Please connect to Quai Network');
          return;
        }
        
        setChainId(chainId);
        setError(null);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setError('Error checking wallet connection');
    }
  }, [isPelagusInstalled, isQuaiNetwork]);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!isPelagusInstalled()) {
        window.open(PELAGUS_DOWNLOAD_URL, '_blank');
        throw new Error('Please install Pelagus wallet');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      // Get chain ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (!isQuaiNetwork(chainId)) {
        setError('Please connect to Quai Network');
        return;
      }
      
      setChainId(chainId);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Error connecting wallet');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setError(null);
    } else {
      disconnectWallet();
    }
  }, []);

  // Handle chain changes
  const handleChainChanged = useCallback((newChainId) => {
    if (!isQuaiNetwork(newChainId)) {
      setError('Please connect to Quai Network');
    } else {
      setError(null);
    }
    setChainId(newChainId);
  }, [isQuaiNetwork]);

  // Handle disconnection
  const handleDisconnect = useCallback(() => {
    disconnectWallet();
  }, []);

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      // Set up event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      // Cleanup function
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [checkIfWalletIsConnected, handleAccountsChanged, handleChainChanged, handleDisconnect]);

  return {
    account,
    chainId,
    isConnecting,
    error,
    isPelagus,
    connectWallet,
    disconnectWallet,
    isQuaiNetwork
  };
};

export default usePelagusWallet;