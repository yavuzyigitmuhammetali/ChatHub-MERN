import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import loginValidationSchema from '../validation/loginValidation';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(loginValidationSchema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      localStorage.setItem('token', response.data.token);
      login(response.data.token);
      toast.success('Giriş başarılı! Sohbete yönlendiriliyorsunuz...');
      navigate('/chat');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Giriş başarısız');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 1, width: '100%', maxWidth: 400, mx: 'auto' }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Giriş Yap
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        label="Kullanıcı Adı"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Şifre"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        sx={{ mt: 3, mb: 2 }}
      >
        Giriş Yap
      </Button>
      <Button
        fullWidth
        variant="text"
        color="secondary"
        onClick={() => navigate('/register')}
      >
        Hesabınız yok mu? Kayıt Ol
      </Button>
    </Box>
  );
};

export default LoginForm;
