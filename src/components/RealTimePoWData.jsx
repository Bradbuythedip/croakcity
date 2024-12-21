import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const COINGECKO_API_KEY = 'CG-ByorJkP4D1f5QfzdPzH4eg7w';

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

const formatNumber = (num, minimumFractionDigits = 2, maximumFractionDigits = 2) => {
  if (num === null || num === undefined) return 'N/A';
  
  if (num >= 1e9) {
    return `$${(num / 1e9).toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits
    })}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits
    })}M`;
  }
  if (num >= 1e3) {
    return `$${(num / 1e3).toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits
    })}K`;
  }
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits
  })}`;
};

const formatPercent = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return `${num.toFixed(2)}%`;
};

const TableCellWithChange = ({ value, isPercentage = false }) => {
  const formattedValue = isPercentage ? formatPercent(value) : formatNumber(value);
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  return (
    <TableCell
      align="right"
      sx={{
        color: isPositive ? '#4CAF50' : isNegative ? '#f44336' : 'inherit',
        transition: 'all 0.3s ease'
      }}
    >
      <motion.span
        key={value}
        initial={{ opacity: 0.5, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isPositive ? '+' : ''}{formattedValue}
      </motion.span>
    </TableCell>
  );
};

const RealTimePoWData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://pro-api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              ids: POW_COINS.join(','),
              order: 'market_cap_desc',
              per_page: 10,
              page: 1,
              sparkline: false,
              price_change_percentage: '1h,24h,7d',
              locale: 'en'
            },
            headers: {
              'x-cg-pro-api-key': COINGECKO_API_KEY
            }
          }
        );

        setData(response.data);
        setLastUpdate(new Date());
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch market data');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Typography variant="h4" className="text-white font-bold mb-3">
          Real-Time PoW L1 Market Data
        </Typography>
        <Typography variant="body1" className="text-gray-300">
          Live market data for top Proof of Work chains
        </Typography>
        {lastUpdate && (
          <Typography variant="caption" className="text-gray-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
        )}
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
        <div className="backdrop-blur-sm bg-black/30 rounded-xl border border-white/10 overflow-hidden">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Rank</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Name</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Price</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>1h %</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>24h %</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>7d %</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>24h Volume</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Market Cap</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((coin) => (
                  <TableRow
                    key={coin.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {coin.market_cap_rank}
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      <div className="flex items-center gap-2">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                        <span>{coin.name}</span>
                        <span className="text-gray-400 text-sm">({coin.symbol.toUpperCase()})</span>
                      </div>
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>
                      {formatNumber(coin.current_price)}
                    </TableCell>
                    <TableCellWithChange value={coin.price_change_percentage_1h_in_currency} isPercentage={true} />
                    <TableCellWithChange value={coin.price_change_percentage_24h_in_currency} isPercentage={true} />
                    <TableCellWithChange value={coin.price_change_percentage_7d_in_currency} isPercentage={true} />
                    <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {formatNumber(coin.total_volume)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {formatNumber(coin.market_cap)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <div className="text-center py-3 border-t border-white/10">
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
                • Updates every 30 seconds
              </Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimePoWData;