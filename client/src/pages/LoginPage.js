import React from 'react';
import { Container, Paper } from '@mui/material';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <Container component="main">
      <Paper e sx={{ padding: 4, mt: 8 }}>
        <LoginForm />
      </Paper>
    </Container>
  );
};

export default LoginPage;
