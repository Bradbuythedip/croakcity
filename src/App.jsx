import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Header from './components/Header';
import MintingCard from './components/MintingCard';
import SentimentAnalysis from './components/SentimentAnalysis';
import Roadmap from './components/Roadmap';
import Footer from './components/Footer';

const theme = createTheme({
  components: {
    MuiTimelineItem: {
      styleOverrides: {
        root: {
          '&::before': {
            flex: 0,
            padding: 0,
          },
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h2: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h3: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h4: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h5: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h6: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div 
        className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background relative"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(76, 175, 80, 0.15) 0%, transparent 30%),
            radial-gradient(circle at 80% 80%, rgba(33, 150, 243, 0.15) 0%, transparent 30%)
          `,
        }}
      >
        <div className="absolute inset-0 backdrop-blur-[100px] pointer-events-none" />
        
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block p-2 px-6 rounded-full bg-white/5 backdrop-blur-sm mb-6">
                <Typography variant="subtitle1" className="text-primary font-medium">
                  Exclusive NFT Collection
                </Typography>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Welcome to Croak City
              </h1>
              <p className="text-xl text-gray-300/90 max-w-2xl mx-auto">
                Mint your unique NFT and join the vibrant community on Quai Network.
                Be part of the next generation of digital art.
              </p>
            </div>
            
            <div className="space-y-16">
              <MintingCard />
              <SentimentAnalysis />
              <Roadmap />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
