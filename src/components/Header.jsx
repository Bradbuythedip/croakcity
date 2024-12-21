import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from '@mui/material/CircularProgress';
import usePelagusWallet from '../hooks/usePelagusWallet';
import Tooltip from '@mui/material/Tooltip';

const Header = () => {
  const { account, isConnecting, error, connectWallet, disconnectWallet } = usePelagusWallet();

  return (
    <AppBar 
      position="sticky" 
      className="backdrop-blur-md bg-transparent shadow-none border-b border-white/10"
      elevation={0}
    >
      <Toolbar className="container mx-auto justify-between py-2">
        <div className="flex items-center space-x-2">
          <img 
            src="/images/unnamed.jpg" 
            alt="Croak City Logo" 
            className="w-12 h-12 object-cover rounded-lg border border-primary/30"
            style={{ 
              filter: 'brightness(1.1) contrast(1.1)',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <Typography variant="h6" className="font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Croak City
          </Typography>
        </div>

        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Button color="inherit" className="text-gray-300 hover:text-white">
              FAQ
            </Button>
          </nav>
          
          {account ? (
            <Tooltip title="Disconnect Wallet">
              <Button
                variant="contained"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
                onClick={disconnectWallet}
              >
                <div className="flex items-center gap-2">
                  <Typography variant="body2" className="font-medium">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </Typography>
                  <LogoutIcon fontSize="small" />
                </div>
              </Button>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                }
              }}
              startIcon={isConnecting ? <CircularProgress size={20} /> : <AccountBalanceWalletIcon />}
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {error ? 'Install Pelagus' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;