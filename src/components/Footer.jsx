import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import DiscordIcon from '@mui/icons-material/Chat';

const Footer = () => {
  return (
    <footer className="mt-24 relative z-10">
      <div className="border-t border-white/10 backdrop-blur-md bg-background/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Typography variant="h6" className="font-display font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Croak City
              </Typography>
              <Typography variant="body2" className="text-gray-400 max-w-md">
                Join the revolution of digital art on the Quai Network. 
                Croak City NFTs represent the future of decentralized creativity.
              </Typography>
            </div>
            
            <div>
              <Typography variant="subtitle1" className="font-semibold mb-4 text-white">
                Quick Links
              </Typography>
              <div className="space-y-2">
                <Button color="inherit" className="text-gray-400 hover:text-white block">
                  Mint NFT
                </Button>
                <Button color="inherit" className="text-gray-400 hover:text-white block">
                  Collection
                </Button>
                <Button color="inherit" className="text-gray-400 hover:text-white block">
                  Roadmap
                </Button>
              </div>
            </div>
            
            <div>
              <Typography variant="subtitle1" className="font-semibold mb-4 text-white">
                Community
              </Typography>
              <div className="flex gap-4">
                <IconButton
                  component={Link}
                  href="https://twitter.com/croakcity"
                  target="_blank"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <TwitterIcon className="text-white" />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://t.me/croakcity"
                  target="_blank"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <TelegramIcon className="text-white" />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://discord.gg/croakcity"
                  target="_blank"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <DiscordIcon className="text-white" />
                </IconButton>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Typography variant="body2" className="text-gray-400">
                © 2024 Croak City. All rights reserved.
              </Typography>
              <div className="flex gap-6">
                <Button color="inherit" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </Button>
                <Button color="inherit" className="text-gray-400 hover:text-white text-sm">
                  Terms of Service
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;