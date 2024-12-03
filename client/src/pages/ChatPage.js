import React, { useState, useEffect, useCallback } from 'react';
import { Container, Paper, Button, Typography, Box, CircularProgress, Skeleton } from '@mui/material';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';
import ChatRoom from '../components/ChatRoom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
  const [currentView, setCurrentView] = useState('options');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRendering, setIsRendering] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRooms = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/auth/me');
        const currentRoom = response.data.user.currentRoom;
        if (currentRoom) {
          setRoomCode(currentRoom.roomCode);
          setCurrentView('chat');
        }
        setIsLoading(false);
        
        // Bileşenlerin render olması için ek süre
        setTimeout(() => {
          setIsRendering(false);
        }, 500);
      } catch (error) {
        toast.error('Kullanıcı odaları alınamadı');
        setIsLoading(false);
        setIsRendering(false);
      }
    };

    fetchUserRooms();
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('Çıkış yapıldı');
    navigate('/login');
  };

  const handleRoomCreatedOrJoined = (code) => {
    setRoomCode(code);
    setCurrentView('chat');
    toast.success('Odaya yönlendiriliyorsunuz...');
  };

  const handleBack = () => {
    setCurrentView('options');
  };

  const handleRoomExit = useCallback(() => {
    setCurrentView('options');
    setRoomCode('');
  }, []);

  if (isLoading) {
    return (
      <Container component="main" maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isRendering) {
    return (
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={48} />
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      {currentView === 'chat' ? (
        <Paper elevation={3}>
          <ChatRoom roomCode={roomCode} onExit={handleRoomExit} />
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
          {currentView === 'options' && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Sohbet Uygulamasına Hoş Geldiniz
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setCurrentView('create')}
              >
                Oda Oluştur
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setCurrentView('join')}
              >
                Odaya Katıl
              </Button>
              <Button
                variant="text"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleLogout}
              >
                Çıkış Yap
              </Button>
            </Box>
          )}
          {currentView === 'create' && (
            <CreateRoom onSuccess={handleRoomCreatedOrJoined} onBack={handleBack} />
          )}
          {currentView === 'join' && (
            <JoinRoom onSuccess={handleRoomCreatedOrJoined} onBack={handleBack} />
          )}
        </Paper>
      )}
    </Container>
  );
};

export default ChatPage;
