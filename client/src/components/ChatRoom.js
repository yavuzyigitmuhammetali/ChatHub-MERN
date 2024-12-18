import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Typography, TextField, Button, List, AppBar, Toolbar, Fab, Skeleton, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';
import MessageBox from './MessageBox';
import { toast } from 'react-toastify';

const SOCKET_SERVER_URL = 'http://localhost:5001';

const ChatRoom = ({ roomCode, onExit }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const socketRef = useRef();
  const [username, setUsername] = useState('');
  const messagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRendering, setIsRendering] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const token = localStorage.getItem('token');

  const fetchMessages = async (pageNum = 1) => {
    try {
      const response = await api.get(`/messages/${roomCode}?page=${pageNum}&limit=30`);
      const newMessages = response.data.messages;
      setHasMore(response.data.hasMore);
      if (pageNum === 1) {
        setMessages(newMessages);
      } else {
        setMessages(prevMessages => [...newMessages, ...prevMessages]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Oda bulunamadı veya mesajlar alınamadı');
        navigate('/chat');
      } else {
        toast.error('Mesajlar alınamadı');
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setUsername(response.data.user.username);
      } catch (error) {
        toast.error('Kullanıcı bilgileri alınamadı');
      }
    };

    const initializeRoom = async () => {
      setIsLoading(true);
      await fetchUser();
      await fetchMessages();
      setIsLoading(false);

      setTimeout(() => {
        setIsRendering(false);
      }, 500);
    };

    initializeRoom();

    socketRef.current = io(SOCKET_SERVER_URL, {
      auth: {
        token: token
      }
    });

    socketRef.current.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('error', (error) => {
      toast.error(error.message);
    });

    return () => {
      socketRef.current.disconnect();
      console.log('Component unmounted');
    };
  }, [token, roomCode, navigate]);

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    socketRef.current.emit('chatMessage', { roomCode, message: messageInput });
    setMessageInput('');
  };

  const handleLeaveRoom = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leaveRoom', { roomCode });
    }
    console.log('Leaving room, calling onExit');
    onExit();
  }, [onExit, roomCode]);

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      setShouldAutoScroll(true);
      setShowScrollButton(false);
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
      setShouldAutoScroll(isScrolledToBottom);
      setShowScrollButton(!isScrolledToBottom);

      // Check if scrolled to top
      if (scrollTop === 0 && hasMore && !isLoadingMore) {
        loadMoreMessages();
      }
    }
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    await fetchMessages(nextPage);
    setPage(nextPage);
    setIsLoadingMore(false);
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress color="secondary" />
        </motion.div>
      </Box>
    );
  }

  if (isRendering) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
        }}
      >
        <AppBar 
          position="static" 
          sx={{ 
            background: 'rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(10px)' 
          }}
        >
          <Toolbar>
            <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
            <Skeleton variant="rectangular" width={100} height={36} sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }} />
          </Toolbar>
        </AppBar>
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 2, 
            overflowY: 'auto', 
            backgroundColor: 'transparent',
          }}
        >
          {[...Array(5)].map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rectangular" 
              height={60} 
              sx={{ 
                my: 1, 
                borderRadius: 2, 
                bgcolor: 'rgba(255,255,255,0.2)' 
              }} 
            />
          ))}
        </Box>
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255,255,255,0.2)' 
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Skeleton variant="rectangular" width={100} height={56} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box 
    sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      background: 'linear-gradient(135deg, #ffffff 0%, #fffffff 100%)',
      backgroundAttachment: 'fixed',
      
    }}
  >
<AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '16px', // Added more pronounced border radius
        margin: '10px', // Optional: adds some space around the AppBar
        overflow: 'hidden' // Ensures child elements respect the border radius
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        px: { xs: 1, sm: 2, md: 3 }  // Responsive padding
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              🏠 Oda: {roomCode}
            </Typography>
          </motion.div>
        </Box>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="outlined"
            onClick={handleLeaveRoom}
            startIcon={<ExitToAppIcon />}
            sx={{ 
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              borderRadius: '12px', // Added border radius to the button
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: 'white'
              }
            }}
          >
            Odayı Bırak
          </Button>
        </motion.div>
      </Toolbar>
    </AppBar>
      <Box 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          overflowY: 'auto', 
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': {
            display: 'none'  // For Chrome, Safari, newer versions of Edge
          },
          '-ms-overflow-style': 'none',  // For Internet Explorer and Edge
          'scrollbarWidth': 'none',      // For Firefox
        }}
      >
        {isLoadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Typography variant="body1" align="center" sx={{ color: 'white' }}>
              Henüz mesaj yok. Sohbet etmeye başlayın!
            </Typography>
          </motion.div>
        ) : (
          <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBox
                    message={msg.message}
                    username={msg.username}
                    color={msg.color}
                    isOwnMessage={msg.username === username}
                    timestamp={msg.timestamp}
                    birthDate={msg.birthDate}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}
      </Box>
      {showScrollButton && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <Fab
            color="primary"
            size="small"
            onClick={scrollToBottom}
            sx={{
              position: 'fixed',
              bottom: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <KeyboardArrowDownIcon />
          </Fab>
        </motion.div>
      )}
<Box 
  sx={{ 
    p: 2, 
    display: 'flex', 
    alignItems: 'center',  // Vertically center the content
    backgroundColor: 'rgba(255,255,255,0.1)', 
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(255,255,255,0.2)', 
    borderRadius: 4  // Increased border radius
  }}
>
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    style={{ flex: 1, marginRight: '16px' }}
  >
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Mesajınızı yazın..."
      value={messageInput}
      onChange={(e) => setMessageInput(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleSendMessage();
        }
      }}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 3,  // Slightly rounded TextField
          '& fieldset': {
            borderColor: 'rgba(255,255,255,0.3)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white',
          },
        },
        '& .MuiInputBase-input': {
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255,255,255,0.7)',
          }
        }
      }}
    />
  </motion.div>
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleSendMessage}
      sx={{
        minWidth: '48px',
        minHeight: '48px',
        padding: 0, // Adjust padding for icon button
        borderRadius: 24, // Circular button
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #5A5AFF 0%, #8A4FFF 100%)'
        }
      }}
    >
      <SendIcon sx={{ fontSize: '24px' }} /> {/* Send Icon */}
    </Button>
  </motion.div>
</Box>
</Box>
  );
};

export default ChatRoom;