import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
  CircularProgress,
  Skeleton,
  Paper,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';
import OptionsView from '../components/OptionsView';
import ChatRoom from '../components/ChatRoom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import SkeletonView from '../components/SkeletonView';
import { keyframes } from '@mui/system';

// Slide down animation
const slideDown = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
`;

const GradientHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)',
  borderBottomLeftRadius: theme.spacing(4),
  borderBottomRightRadius: theme.spacing(4),
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  animation: `${slideDown} 0.5s ease-out`, // Apply the animation
}));

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
        <SkeletonView />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={4}
        sx={{
          borderRadius: '0px 0px 33px 33px', // Sağ alt ve sol alt köşelere kavis
          overflow: 'hidden', // Kavisin dışına taşan içerikler için
        }}
      >
        <GradientHeader>
          <Typography variant="h5" fontWeight="bold">
            Sohbet Uygulaması
          </Typography>
          <IconButton color="inherit" onClick={navigateToSettings}>
            <SettingsIcon fontSize="large" />
          </IconButton>
        </GradientHeader>
      </Paper>

      {currentView === 'chat' ? (
        <ChatRoom roomCode={roomCode} onExit={handleRoomExit} />
      ) : (
        <OptionsView
          currentView={currentView}
          setCurrentView={setCurrentView}
          onRoomCreatedOrJoined={handleRoomCreatedOrJoined}
          onLogout={handleLogout}
        />
      )}
    </Container>
  );
};

export default ChatPage;
