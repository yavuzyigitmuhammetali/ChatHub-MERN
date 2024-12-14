import React from 'react';
import { Container, Paper } from '@mui/material';
import LoginForm from '../components/LoginForm';
import AnimatedPage from '../components/AnimatedPage';
const LoginPage = () => {
  return (
    <AnimatedPage>
      <Container component="main" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <LoginForm />
      </Container>
    </AnimatedPage>
  );
};

export default LoginPage;
