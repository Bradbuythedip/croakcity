import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';
import axios from 'axios';

const COINGECKO_API_KEY = 'CG-ByorJkP4D1f5QfzdPzH4eg7w';

// List of PoW coins we want to track
const POW_COINS = [
  'bitcoin',
  'litecoin',
  'dogecoin',
  'monero',
  'zcash',
  'ravencoin',
  'ergo',
  'kadena',
  'nervos-network',
  'quai-network'
];

const getEmotionColor = (value) => {
  if (value >= 0 && value <= 20) return '#E74C3C'; // Extreme Fear - Red
  if (value > 20 && value <= 40) return '#E67E22'; // Fear - Orange
  if (value > 40 && value <= 60) return '#F1C40F'; // Neutral - Yellow
  if (value > 60 && value <= 80) return '#2ECC71'; // Greed - Light Green
  return '#27AE60'; // Extreme Greed - Green
};

const getEmotionText = (value) => {
  if (value >= 0 && value <= 20) return 'Extreme Fear';
  if (value > 20 && value <= 40) return 'Fear';
  if (value > 40 && value <= 60) return 'Neutral';
  if (value > 60 && value <= 80) return 'Greed';
  return 'Extreme Greed';
};

const FearGreedCard = ({ chain, value }) => {
  const emotionColor = getEmotionColor(value);
  const emotionText = getEmotionText(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 rounded-lg backdrop-blur-sm border border-white/10"
      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
    >
      <div className="text-center">
        <Typography variant="h6" className="text-white mb-2">
          {chain}
        </Typography>
        <div className="relative inline-block">
          <CircularProgress
            variant="determinate"
            value={100}
            size={80}
            thickness={4}
            sx={{ color: 'rgba(255, 255, 255, 0.1)' }}
          />
          <CircularProgress
            variant="determinate"
            value={value}
            size={80}
            thickness={4}
            sx={{
              color: emotionColor,
              position: 'absolute',
              left: 0,
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Typography
              variant="h6"
              component="div"
              className="text-white font-bold"
            >
              {value}
            </Typography>
          </div>
        </div>
        <Typography
          variant="body2"
          className="mt-2"
          style={{ color: emotionColor }}
        >
          {emotionText}
        </Typography>
      </div>
    </motion.div>
  );
};

const calculateSentiment = (coin) => {
  // Calculate sentiment based on various metrics
  const priceChangeWeight = 0.4;
  const volumeChangeWeight = 0.3;
  const marketCapChangeWeight = 0.3;

  const priceChange = Math.min(Math.max(coin.price_change_percentage_24h || 0, -100), 100);
  const volumeChange = Math.min(Math.max(coin.volume_change_24h || 0, -100), 100);
  const marketCapChange = Math.min(Math.max(coin.market_cap_change_percentage_24h || 0, -100), 100);

  // Convert changes to 0-100 scale
  const priceScore = ((priceChange + 100) / 2);
  const volumeScore = ((volumeChange + 100) / 2);
  const marketCapScore = ((marketCapChange + 100) / 2);

  // Weighted average
  const sentiment = Math.round(
    priceScore * priceChangeWeight +
    volumeScore * volumeChangeWeight +
    marketCapScore * marketCapChangeWeight
  );

  return Math.min(Math.max(sentiment, 0), 100);
};

const FearGreedIndex = () => {
  const [powChains, setPowChains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://pro-api.coingecko.com/api/v3/coins/markets`, {
          params: {
            vs_currency: 'usd',
            ids: POW_COINS.join(','),
            order: 'market_cap_desc',
            sparkline: false,
            price_change_percentage: '24h',
            locale: 'en',
          },
          headers: {
            'x-cg-pro-api-key': COINGECKO_API_KEY
          }
        });

        const chainsData = response.data.map(coin => ({
          name: coin.name,
          value: calculateSentiment(coin),
          priceChange24h: coin.price_change_percentage_24h,
          currentPrice: coin.current_price,
          marketCap: coin.market_cap
        }));

        setPowChains(chainsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch market data');
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Typography variant="h4" className="text-white font-bold mb-3">
          PoW Market Sentiment
        </Typography>
        <Typography variant="body1" className="text-gray-300">
          Fear & Greed Index for Top PoW Chains
        </Typography>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <CircularProgress />
          <Typography variant="body2" className="text-gray-400 mt-4">
            Loading market data...
          </Typography>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <Typography variant="body1" className="text-red-400">
            {error}
          </Typography>
        </div>
      ) : (
        <>
          <Grid container spacing={3}>
            {powChains.map((chain) => (
              <Grid item xs={12} sm={6} md={3} key={chain.name}>
                <FearGreedCard
                  chain={chain.name}
                  value={chain.value}
                />
                <div className="mt-2 text-center">
                  <Typography variant="caption" className="text-gray-400">
                    Price: ${chain.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <br />
                    24h: <span className={chain.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {chain.priceChange24h?.toFixed(2)}%
                    </span>
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>

          <div className="mt-6 text-center space-y-2">
            <Typography variant="body2" className="text-gray-400">
              0-20: Extreme Fear • 21-40: Fear • 41-60: Neutral • 61-80: Greed • 81-100: Extreme Greed
            </Typography>
            <div className="flex items-center justify-center gap-2">
              <Typography variant="caption" className="text-gray-500">
                Powered by
              </Typography>
              <a
                href="https://www.coingecko.com/en/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                CoinGecko API
              </a>
              <Typography variant="caption" className="text-gray-500">
                • Updates every 5 minutes
              </Typography>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FearGreedIndex;