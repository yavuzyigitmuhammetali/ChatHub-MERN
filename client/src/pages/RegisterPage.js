import React from 'react';
import { Container, Paper } from '@mui/material';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <Container component="main" >
      <Paper  sx={{ padding: 4, mt: 8 }}>
        <RegisterForm />
      </Paper>
    </Container>
  );
};

export default RegisterPage;
