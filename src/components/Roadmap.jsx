import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import AnalyticsIcon from '@mui/icons-material/Analytics';

function Roadmap() {
  return (
    <Paper className="p-8 backdrop-blur-lg bg-white/5" elevation={0}>
      <Typography variant="h5" className="mb-6 text-center font-bold text-gray-200">
        Quantitative Analytics
      </Typography>
      
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <AnalyticsIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Box className="p-3 bg-white/5 rounded-lg">
              <Typography variant="subtitle1" className="font-medium">
                Q1 2025
              </Typography>
              <Typography className="text-gray-400 text-sm">
                Initial implementation of the network explorer
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <AnalyticsIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Box className="p-3 bg-white/5 rounded-lg">
              <Typography variant="subtitle1" className="font-medium">
                Q2 2025
              </Typography>
              <Typography className="text-gray-400 text-sm">
                Enhanced cross-chain data analysis
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <AnalyticsIcon />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Box className="p-3 bg-white/5 rounded-lg">
              <Typography variant="subtitle1" className="font-medium">
                Q3 2025
              </Typography>
              <Typography className="text-gray-400 text-sm">
                Advanced network optimization tools
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Paper>
  );
}

export default Roadmap;