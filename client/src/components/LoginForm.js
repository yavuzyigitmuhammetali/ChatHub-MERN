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
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,242,247,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)',
        },
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4,
          fontWeight: 800,
          background: 'linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          '& svg': {
            fontSize: 35,
            color: '#4776E6'
          }
        }}
      >
        <LoginIcon /> Giriş Yap
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <TextField
          margin="normal"
          fullWidth
          label="Kullanıcı Adı"
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#4776E6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#8E54E9',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: '#4776E6' }} />
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
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#4776E6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#8E54E9',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: '#4776E6' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{
                    '&:hover': {
                      color: '#8E54E9',
                    },
                  }}
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
          disabled={isSubmitting}
          startIcon={<LoginIcon />}
          sx={{ 
            mt: 4, 
            mb: 2, 
            py: 1.8,
            fontWeight: 'bold',
            borderRadius: 3,
            textTransform: 'none',
            fontSize: '1.1rem',
            background: 'linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)',
            boxShadow: '0 4px 15px rgba(71, 118, 230, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(90deg, #4776E6 30%, #8E54E9 90%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(71, 118, 230, 0.3)',
            }
          }}
        >
          Giriş Yap
        </Button>
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<RegisterIcon />}
          onClick={() => navigate('/register')}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontSize: '1rem',
            py: 1.5,
            borderColor: '#4776E6',
            color: '#4776E6',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#8E54E9',
              color: '#8E54E9',
              background: 'rgba(142, 84, 233, 0.05)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          Hesabınız yok mu? Kayıt Ol
        </Button>
      </form>
    </Paper>
  );
};

export default LoginForm;