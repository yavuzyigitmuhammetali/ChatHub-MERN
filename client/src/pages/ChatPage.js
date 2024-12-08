import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
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

        // Simulate rendering delay for smoother transition
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

  const navigateToSettings = () => {
    navigate('/settings');
  };

  if (isLoading) {
    return (
      <Container
        component="main"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (isRendering) {
    return (
      <Container component="main">
        <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
          <Skeleton variant="text" width="100%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={48} />
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sohbet Uygulaması
          </Typography>
          <IconButton color="inherit" onClick={navigateToSettings}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {currentView === 'chat' ? (
        <Paper elevation={3} sx={{ padding: 3, mt: 2 }}>
          <ChatRoom roomCode={roomCode} onExit={handleRoomExit} />
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
          {currentView === 'options' && (
            <Grid container spacing={3} direction="column" alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setCurrentView('create')}
                >
                  Oda Oluştur
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setCurrentView('join')}
                >
                  Odaya Katıl
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button variant="text" color="secondary" fullWidth onClick={handleLogout}>
                  Çıkış Yap
                </Button>
              </Grid>
            </Grid>
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
