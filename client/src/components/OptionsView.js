import React from 'react';
import { Paper, Grid, Button } from '@mui/material';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

const OptionsView = ({ currentView, setCurrentView, onRoomCreatedOrJoined, onLogout }) => {
  return (
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
            <Button variant="text" color="secondary" fullWidth onClick={onLogout}>
              Çıkış Yap
            </Button>
          </Grid>
        </Grid>
      )}
      {currentView === 'create' && (
        <CreateRoom onSuccess={onRoomCreatedOrJoined} onBack={() => setCurrentView('options')} />
      )}
      {currentView === 'join' && (
        <JoinRoom onSuccess={onRoomCreatedOrJoined} onBack={() => setCurrentView('options')} />
      )}
    </Paper>
  );
};

export default OptionsView;