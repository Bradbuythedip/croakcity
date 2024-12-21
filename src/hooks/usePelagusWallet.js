import { useState, useEffect, useCallback } from 'react';

// Wait for Pelagus to inject provider
const waitForPelagus = () => {
  return new Promise((resolve) => {
    if (window.ethereum) {
      return resolve(window.ethereum);
    }

    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (window.ethereum) {
        clearInterval(interval);
        return resolve(window.ethereum);
      }
      if (tries > 20) { // Wait for max 2 seconds
        clearInterval(interval);
        return resolve(null);
      }
    }, 100);
  });
};

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
  const isPelagusInstalled = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const provider = await waitForPelagus();
      console.log('Provider after waiting:', provider);
      if (provider) {
        // Try to detect if it's Pelagus
        const chainId = await provider.request({ method: 'eth_chainId' });
        console.log('Chain ID:', chainId);
        // We're assuming it's Pelagus if we get a response and chainId is in hex format
        return Boolean(chainId && chainId.startsWith('0x'));
      }
    }
    return false;
  }, []);

  // Check if we're on Quai Network
  const isQuaiNetwork = useCallback((zoneId) => {
    // For now, accept any chain ID during development
    return true;
    // Later we can validate specific chain IDs
    // return Object.values(QUAI_ZONES).includes(zoneId?.toLowerCase());
  }, []);

  // Initialize provider
  const initializeProvider = useCallback(async () => {
    if (typeof window !== 'undefined') {
      try {
        const provider = await waitForPelagus();
        console.log('Provider during initialization:', provider);
        
        if (!provider) {
          throw new Error('No provider found');
        }

        // Request access to the wallet
        await provider.request({ method: 'eth_requestAccounts' });
        
        setProvider(provider);
        return provider;
      } catch (error) {
        console.error('Error initializing provider:', error);
        throw error;
      }
    }
    return null;
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const hasPelagus = await isPelagusInstalled();
      if (!hasPelagus) {
        setError('Please install Pelagus wallet');
        return;
      }

      setIsPelagus(true);
      const web3Provider = await initializeProvider();
      
      if (!web3Provider) {
        setError('Could not connect to Pelagus wallet');
        return;
      }

      // Get the chain ID
      const chainId = await web3Provider.request({ method: 'eth_chainId' });
      console.log('Got chain ID:', chainId);
      setChainId(chainId);

      // Get accounts
      const accounts = await web3Provider.request({ method: 'eth_accounts' });
      console.log('Got accounts:', accounts);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setError(null);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setError('Error checking wallet connection');
    }
  }, [isPelagusInstalled, initializeProvider]);

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
    const setupWallet = async () => {
      // Wait for provider to be injected
      const provider = await waitForPelagus();
      
      if (provider) {
        console.log('Setting up event listeners on provider:', provider);
        
        // Set up event listeners
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('chainChanged', handleZoneChanged);
        
        // Initial connection check
        checkIfWalletIsConnected();
      }
    };

    setupWallet();

    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleZoneChanged);
      }
    };
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