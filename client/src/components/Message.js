// client/src/components/Message.js

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const MessageContainer = styled(Box, { shouldForwardProp: (prop) => prop !== 'isOwn' })(({ theme, isOwn }) => ({
  display: 'flex',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1),
}));

const MessageBubble = styled(Paper, { shouldForwardProp: (prop) => prop !== 'isOwn' })(({ theme, isOwn }) => ({
  padding: theme.spacing(1, 2),
  maxWidth: '60%',
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.grey[300],
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: isOwn ? '20px 20px 0 20px' : '20px 20px 20px 0',
  boxShadow: 'none',
  wordBreak: 'break-word',
}));

const Message = ({ message, isOwn }) => {
  return (
    <MessageContainer isOwn={isOwn}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <MessageBubble elevation={3} isOwn={isOwn}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {message.username} {message.age}
          </Typography>
          <Typography variant="body1">{message.message}</Typography>
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </MessageBubble>
      </Box>
    </MessageContainer>
  );
};

export default Message;
