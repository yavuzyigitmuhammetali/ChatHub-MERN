import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  InputAdornment, 
  IconButton 
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff,
  Login as LoginIcon,
  AppRegistration as RegisterIcon
} from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginValidationSchema from '../validation/loginValidation';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

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
    <Paper 
      elevation={6} 
      sx={{ 
        p: 4, 
        maxWidth: 450, 
        mx: 'auto', 
        my: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        borderRadius: 3,
        background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: 'primary.main',
          display: 'flex', 
          alignItems: 'center',
          gap: 2 
        }}
      >
        <LoginIcon fontSize="large" /> Giriş Yap
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <TextField
          margin="normal"
          fullWidth
          label="Kullanıcı Adı"
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          margin="normal"
          fullWidth
          label="Şifre"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={<LoginIcon />}
          sx={{ 
            mt: 3, 
            mb: 2, 
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Giriş Yap
        </Button>
        
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          startIcon={<RegisterIcon />}
          onClick={() => navigate('/register')}
          sx={{
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Hesabınız yok mu? Kayıt Ol
        </Button>
      </form>
    </Paper>
  );
};

export default LoginForm;