import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Typography, TextField, Button, List, AppBar, Toolbar, Fab, Skeleton, CircularProgress } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isRendering) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="rectangular" width={100} height={36} sx={{ ml: 'auto' }} />
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', backgroundColor: '#f0f2f5' }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={60} sx={{ my: 1, borderRadius: 1 }} />
          ))}
        </Box>
        <Box sx={{ p: 2, display: 'flex', backgroundColor: '#fff', borderTop: '1px solid #ccc' }}>
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ mr: 2 }} />
          <Skeleton variant="rectangular" width={100} height={56} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Oda: {roomCode}
          </Typography>
          <Button color="inherit" onClick={handleLeaveRoom}>
            Odayı Bırak
          </Button>
        </Toolbar>
      </AppBar>
      <Box 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          overflowY: 'auto', 
          backgroundColor: '#f0f2f5',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {messages.length === 0 ? (
          <Typography variant="body1" align="center">
            Henüz mesaj yok. Sohbet etmeye başlayın!
          </Typography>
        ) : (
          <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, index) => (
              <MessageBox
                key={msg.id || index}
                message={msg.message}
                username={msg.username}
                color={msg.color}
                isOwnMessage={msg.username === username}
                timestamp={msg.timestamp}
                birthDate={msg.birthDate}
              />
            ))}
          </List>
        )}
      </Box>
      {showScrollButton && (
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
          }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )}
      <Box sx={{ p: 2, display: 'flex', backgroundColor: '#fff', borderTop: '1px solid #ccc' }}>
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
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Gönder
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;
