import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';

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

const FearGreedIndex = () => {
  // This would normally come from an API
  // For now using mock data
  const powChains = [
    { name: 'Bitcoin', value: 55 },
    { name: 'Litecoin', value: 48 },
    { name: 'Dogecoin', value: 62 },
    { name: 'Monero', value: 35 },
    { name: 'Zcash', value: 42 },
    { name: 'RavenCoin', value: 28 },
    { name: 'Quai', value: 75 },
    { name: 'Ergo', value: 45 },
    { name: 'Kadena', value: 52 },
    { name: 'Nervos', value: 38 }
  ];

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
      
      <Grid container spacing={3}>
        {powChains.map((chain) => (
          <Grid item xs={12} sm={6} md={3} key={chain.name}>
            <FearGreedCard chain={chain.name} value={chain.value} />
          </Grid>
        ))}
      </Grid>

      <div className="mt-6 text-center">
        <Typography variant="body2" className="text-gray-400">
          0-20: Extreme Fear • 21-40: Fear • 41-60: Neutral • 61-80: Greed • 81-100: Extreme Greed
        </Typography>
      </div>
    </div>
  );
};

export default FearGreedIndex;