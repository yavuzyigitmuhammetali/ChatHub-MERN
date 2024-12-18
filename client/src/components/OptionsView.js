import React, { useState } from 'react';
import { 
  Paper, 
  Grid, 
  Button, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  IconButton 
} from '@mui/material';
import { styled } from '@mui/system';
import CreateIcon from '@mui/icons-material/AddCircleOutline';
import JoinIcon from '@mui/icons-material/GroupAddOutlined';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import ArrowRightIcon from '@mui/icons-material/ArrowForwardIos';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

// Styled Components
const GradientBackground = styled(Box)({
  minHeight: '70vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  position: 'relative',
});

const AnimatedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 1290,
  textAlign: 'center',
  animation: 'fadeIn 1s ease-in-out',
  borderRadius: '20px',
  position: 'relative',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledButton = styled(Button)({
  borderRadius: '50px',
  padding: '10px 20px',
  fontSize: '16px',
  margin: '10px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const RecentRoomsCard = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  right: '-390px',
  transform: 'translateY(-50%)',
  width: '300px',
  maxHeight: '500px',
  overflowY: 'auto',
  animation: 'slideInFromRight 0.8s ease-out',
  borderRadius: '20px',
  '@keyframes slideInFromRight': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-50%) translateX(100%)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(-50%) translateX(0)',
    },
  },
}));

const RoomItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const OptionsView = ({ 
  currentView, 
  setCurrentView, 
  onRoomCreatedOrJoined, 
  onLogout 
}) => {
  // Mock data for recent rooms - replace with actual data from your backend
  const [recentRooms] = useState([
    {
      id: '1',
      name: 'Yazılım Sohbet Odası',
      createdAt: new Date('2024-03-15T10:30:00'),
      memberCount: 5
    },
    {
      id: '2',
      name: 'Oyun Geliştiricileri',
      createdAt: new Date('2024-03-14T15:45:00'),
      memberCount: 12
    },
    {
      id: '3',
      name: 'Tasarım Atölyesi',
      createdAt: new Date('2024-03-13T09:15:00'),
      memberCount: 8
    }
  ]);

  // Helper function to format date
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    return `${diffDays} gün önce`;
  };

  return (
    <GradientBackground>
      {currentView === 'options' && (
        <>
          <AnimatedPaper elevation={6}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Oda Seçenekleri
            </Typography>
            <Grid container spacing={2} direction="column" alignItems="center">
              <Grid item xs={12} sx={{ width: '100%' }}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setCurrentView('create')}
                  startIcon={<CreateIcon />}
                >
                  Oda Oluştur
                </StyledButton>
              </Grid>
              <Grid item xs={12} sx={{ width: '100%' }}>
                <StyledButton
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => setCurrentView('join')}
                  startIcon={<JoinIcon />}
                >
                  Odaya Katıl
                </StyledButton>
              </Grid>
            </Grid>
            <Box
              sx={{
                position: "absolute",
                bottom: -250,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <StyledButton
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "red",
                  backgroundColor: "red",
                  "&:hover": {
                    backgroundColor: "darkred",
                    borderColor: "darkred",
                  },
                }}
                onClick={onLogout}
                startIcon={<LogoutIcon />}
              >
                Çıkış Yap
              </StyledButton>
            </Box>
          </AnimatedPaper>

          <RecentRoomsCard elevation={6}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Son Oluşturulan Odalar
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {recentRooms.map((room) => (
                <RoomItem key={room.id}>
                  <Box>
                    <Typography variant="subtitle1">{room.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatRelativeTime(room.createdAt)} • {room.memberCount} üye
                    </Typography>
                  </Box>
                  <IconButton edge="end" color="primary">
                    <ArrowRightIcon />
                  </IconButton>
                </RoomItem>
              ))}
            </CardContent>
          </RecentRoomsCard>
        </>
      )}
      {currentView === 'create' && (
        <AnimatedPaper elevation={6}>
          <CreateRoom
            onSuccess={onRoomCreatedOrJoined}
            onBack={() => setCurrentView('options')}
          />
        </AnimatedPaper>
      )}
      {currentView === 'join' && (
        <AnimatedPaper elevation={6}>
          <JoinRoom
            onSuccess={onRoomCreatedOrJoined}
            onBack={() => setCurrentView('options')}
          />
        </AnimatedPaper>
      )}
    </GradientBackground>
  );
};

export default OptionsView;