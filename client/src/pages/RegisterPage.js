import React from 'react';
import { Container, Paper } from '@mui/material';
import RegisterForm from '../components/RegisterForm';
import AnimatedPage from '../components/AnimatedPage';
const RegisterPage = () => {
  return (
    <AnimatedPage>
      <Container component="main" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <RegisterForm />
      </Container>
    </AnimatedPage>
  );
};

export default RegisterPage;
