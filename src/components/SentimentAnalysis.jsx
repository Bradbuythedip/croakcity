import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const getFearGreedColor = (score) => {
  if (score >= 80) return '#25A33C'; // Extreme Greed
  if (score >= 60) return '#76C893'; // Greed
  if (score >= 40) return '#FFB703'; // Neutral
  if (score >= 20) return '#FB8500'; // Fear
  return '#DC2F02'; // Extreme Fear
};

const getFearGreedLabel = (score) => {
  if (score >= 80) return 'Extreme Greed';
  if (score >= 60) return 'Greed';
  if (score >= 40) return 'Neutral';
  if (score >= 20) return 'Fear';
  return 'Extreme Fear';
};

const getGaugeRotation = (score) => {
  // Convert 0-100 score to -90 to 90 degrees for the gauge
  return (score / 100) * 180 - 90;
};

const formatPrice = (price) => {
  if (typeof price === 'number') {
    return price < 1 ? price.toFixed(6) : price.toFixed(2);
  }
  return 'N/A';
};

const SentimentAnalysis = () => {
  const [sentimentData, setSentimentData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSentimentData = async () => {
    try {
      // Simulating better fear & greed data with more realistic values
      const mockData = [
        {
          Name: 'Quai Network',
          Symbol: 'QUAI',
          'Price (USD)': 2.45,
          'Price Change 24h': 5.8,
          'Sentiment Score': 82, // High greed due to strong network growth and social sentiment
          'Volume': '24.5M',
          'Market Cap': '245M'
        },
        {
          Name: 'Bitcoin',
          Symbol: 'BTC',
          'Price (USD)': 43250.75,
          'Price Change 24h': 2.3,
          'Sentiment Score': 76, // Greed due to sustained price action and institutional interest
          'Volume': '28.2B',
          'Market Cap': '845B'
        },
        {
          Name: 'Ethereum',
          Symbol: 'ETH',
          'Price (USD)': 2275.50,
          'Price Change 24h': -1.2,
          'Sentiment Score': 71, // Greed despite price dip due to strong fundamentals
          'Volume': '12.4B',
          'Market Cap': '273B'
        }
      ];
      
      setSentimentData(mockData);
      setLastUpdate(new Date().toLocaleString());
      setError(null);
    } catch (err) {
      setError('Failed to fetch sentiment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentimentData();
    const interval = setInterval(fetchSentimentData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card className="card mt-6">
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Card>
    );
  }

  return (
    <Card className="card mt-6">
      <Typography variant="h5" className="mb-4 font-display font-bold">
        Token Fear & Greed Index
      </Typography>
      
      <TableContainer component={Paper} className="bg-surface">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell align="right">Price (USD)</TableCell>
              <TableCell align="right">24h Change</TableCell>
              <TableCell align="right">Fear & Greed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sentimentData.map((token) => (
              <TableRow key={token.Symbol}>
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle2">{token.Name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {token.Symbol}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  ${formatPrice(token['Price (USD)'])}
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    {token['Price Change 24h'] > 0 ? (
                      <TrendingUpIcon className="text-green-500" fontSize="small" />
                    ) : (
                      <TrendingDownIcon className="text-red-500" fontSize="small" />
                    )}
                    <span className={token['Price Change 24h'] > 0 ? 'text-green-500' : 'text-red-500'}>
                      {token['Price Change 24h'].toFixed(2)}%
                    </span>
                  </Box>
                </TableCell>
                <TableCell align="right" className="min-w-[180px]">
                  <Box className="relative flex items-center justify-end gap-2">
                    <div className="w-24 h-2 rounded-full bg-gradient-to-r from-[#DC2F02] via-[#FFB703] to-[#25A33C] overflow-hidden">
                      <div 
                        className="absolute w-1 h-4 bg-white -mt-1 transform -translate-x-1/2"
                        style={{ 
                          left: `${token['Sentiment Score']}%`,
                          boxShadow: '0 0 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                    <Chip
                      label={`${token['Sentiment Score']} - ${getFearGreedLabel(token['Sentiment Score'])}`}
                      style={{
                        backgroundColor: getFearGreedColor(token['Sentiment Score']),
                        color: 'white',
                      }}
                      size="small"
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="mt-4 p-4 bg-white/5 rounded-lg">
        <Typography variant="subtitle2" className="mb-2 text-gray-300">
          Index Calculation Factors:
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Typography variant="caption" color="primary" className="font-medium">
              25% - Volatility
            </Typography>
            <Typography variant="caption" display="block" className="text-gray-400">
              Price action & momentum
            </Typography>
          </div>
          <div>
            <Typography variant="caption" color="primary" className="font-medium">
              25% - Volume Analysis
            </Typography>
            <Typography variant="caption" display="block" className="text-gray-400">
              Trading volume & liquidity
            </Typography>
          </div>
          <div>
            <Typography variant="caption" color="primary" className="font-medium">
              20% - Network Activity
            </Typography>
            <Typography variant="caption" display="block" className="text-gray-400">
              Chain metrics & usage
            </Typography>
          </div>
          <div>
            <Typography variant="caption" color="primary" className="font-medium">
              30% - Market Trends
            </Typography>
            <Typography variant="caption" display="block" className="text-gray-400">
              Social sentiment & dominance
            </Typography>
          </div>
        </div>
      </Box>
      
      {lastUpdate && (
        <Typography variant="caption" color="textSecondary" className="mt-4 block text-right">
          Last updated: {lastUpdate}
        </Typography>
      )}
    </Card>
  );
};

export default SentimentAnalysis;