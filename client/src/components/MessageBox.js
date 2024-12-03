import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import moment from 'moment';
import clsx from 'clsx';
import './MessageBox.css';

const MessageBox = ({ message, username, color, isOwnMessage, timestamp, birthDate }) => {
  // Yaş hesaplama fonksiyonu
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    return moment().diff(moment(birthDate), 'years');
  };

  const age = calculateAge(birthDate);

  return (
    <Box
      className={clsx('message-box', { 'own-message': isOwnMessage })}
      sx={{
        display: 'flex',
        flexDirection: isOwnMessage ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        mb: 2
      }}
    >
      <Avatar sx={{ bgcolor: color, mr: isOwnMessage ? 0 : 2, ml: isOwnMessage ? 2 : 0 }}>
        {username.charAt(0).toUpperCase()}
      </Avatar>
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          maxWidth: '70%',
          borderRadius: 3,
          backgroundColor: isOwnMessage ? '#DCF8C6' : '#FFFFFF',
        }}
      >
        <Box sx={{ mb: 0.5 }}>
          <Typography
            variant="subtitle2"
            component="span"
            sx={{ fontWeight: 'bold', color: color }}
          >
            {username}
            {age !== null && (
              <Typography
                variant="caption"
                component="span"
                sx={{ ml: 0.5, color: 'text.secondary' }}
              >
                ({age})
              </Typography>
            )}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 0.5, wordBreak: 'break-word' }}>
          {message}
        </Typography>
        <Typography
          variant="caption"
          component="div"
          sx={{ textAlign: 'right', color: 'text.secondary' }}
        >
          {moment(timestamp).format('HH:mm')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MessageBox;
