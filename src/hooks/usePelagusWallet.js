import { useState, useEffect, useCallback } from 'react';

// Quai Network Chain IDs
const QUAI_ZONES = {
  PRIME: '0x1',
  CYPRUS1: '0x2',
  CYPRUS2: '0x3',
  CYPRUS3: '0x4',
  PAXOS1: '0x5',
  PAXOS2: '0x6',
  PAXOS3: '0x7',
  HYDRA1: '0x8',
  HYDRA2: '0x9',
  HYDRA3: '0xa'
};

const PELAGUS_DOWNLOAD_URL = 'https://pelaguswallet.io/';

const usePelagusWallet = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isPelagus, setIsPelagus] = useState(false);
  const [provider, setProvider] = useState(null);

  // Check if Pelagus is installed
  const isPelagusInstalled = useCallback(() => {
    if (typeof window !== 'undefined') {
      const { pelaguswallet } = window;
      return Boolean(pelaguswallet && pelaguswallet.isQuai);
    }
    return false;
  }, []);

  // Check if we're on Quai Network
  const isQuaiNetwork = useCallback((zoneId) => {
    return Object.values(QUAI_ZONES).includes(zoneId?.toLowerCase());
  }, []);

  // Initialize provider
  const initializeProvider = useCallback(async () => {
    if (typeof window !== 'undefined' && window.pelaguswallet) {
      try {
        // Request access to the wallet
        await window.pelaguswallet.request({ method: 'quai_requestAccounts' });
        
        // Create Web3Provider
        const web3Provider = window.pelaguswallet;
        setProvider(web3Provider);
        return web3Provider;
      } catch (error) {
        console.error('Error initializing provider:', error);
        throw error;
      }
    }
    return null;
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (!isPelagusInstalled()) {
        setError('Please install Pelagus wallet');
        return;
      }

      setIsPelagus(true);
      const web3Provider = await initializeProvider();
      
      if (!web3Provider) {
        setError('Could not connect to Pelagus wallet');
        return;
      }

      // Get the zone (chain) ID
      const zoneId = await web3Provider.request({ method: 'quai_zoneId' });
      if (!isQuaiNetwork(zoneId)) {
        setError('Please connect to Quai Network');
        return;
      }
      setChainId(zoneId);

      // Get accounts
      const accounts = await web3Provider.request({ method: 'quai_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setError(null);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setError('Error checking wallet connection');
    }
  }, [isPelagusInstalled, initializeProvider, isQuaiNetwork]);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!isPelagusInstalled()) {
        window.open(PELAGUS_DOWNLOAD_URL, '_blank');
        throw new Error('Please install Pelagus wallet');
      }

      const web3Provider = await initializeProvider();
      if (!web3Provider) {
        throw new Error('Could not connect to Pelagus wallet');
      }

      // Get accounts
      const accounts = await web3Provider.request({ method: 'quai_accounts' });
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      setAccount(accounts[0]);

      // Get zone ID
      const zoneId = await web3Provider.request({ method: 'quai_zoneId' });
      if (!isQuaiNetwork(zoneId)) {
        setError('Please connect to Quai Network');
        return;
      }
      setChainId(zoneId);

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
    setProvider(null);
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

  // Handle zone changes
  const handleZoneChanged = useCallback((newZoneId) => {
    if (!isQuaiNetwork(newZoneId)) {
      setError('Please connect to Quai Network');
    } else {
      setError(null);
    }
    setChainId(newZoneId);
  }, [isQuaiNetwork]);

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.pelaguswallet) {
      // Set up event listeners for Pelagus wallet
      window.pelaguswallet.on('accountsChanged', handleAccountsChanged);
      window.pelaguswallet.on('zoneChanged', handleZoneChanged);
      window.pelaguswallet.on('disconnect', disconnectWallet);

      // Cleanup function
      return () => {
        window.pelaguswallet.removeListener('accountsChanged', handleAccountsChanged);
        window.pelaguswallet.removeListener('zoneChanged', handleZoneChanged);
        window.pelaguswallet.removeListener('disconnect', disconnectWallet);
      };
    }
  }, [checkIfWalletIsConnected, handleAccountsChanged, handleZoneChanged]);

  return {
    account,
    chainId,
    isConnecting,
    error,
    isPelagus,
    provider,
    connectWallet,
    disconnectWallet,
    isQuaiNetwork
  };
};

export default usePelagusWallet;