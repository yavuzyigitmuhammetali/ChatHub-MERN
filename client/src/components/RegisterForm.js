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
  Cake as CakeIcon,
  Visibility, 
  VisibilityOff,
  AppRegistration as RegisterIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import registerValidationSchema from '../validation/registerValidation';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(registerValidationSchema)
  });

  const onSubmit = async (data) => {
    try {
      if (data.birthDate === '') {
        data.birthDate = null;
      }
      const response = await api.post('/auth/register', data);
      localStorage.setItem('token', response.data.token);
      login(response.data.token);
      toast.success('Kayıt başarılı! Sohbet sayfasına yönlendiriliyorsunuz...');
      navigate('/chat');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Kayıt başarısız');
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
        <RegisterIcon fontSize="large" /> Kayıt Ol
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
        
        <TextField
          margin="normal"
          fullWidth
          label="Doğum Tarihi"
          type="date"
          InputLabelProps={{
            shrink: true
          }}
          {...register('birthDate')}
          error={!!errors.birthDate}
          helperText={errors.birthDate?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CakeIcon color="action" />
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
          startIcon={<RegisterIcon />}
          sx={{ 
            mt: 3, 
            mb: 2, 
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Kayıt Ol
        </Button>
        
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          startIcon={<LoginIcon />}
          onClick={() => navigate('/login')}
          sx={{
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Zaten hesabınız var mı? Giriş Yap
        </Button>
      </form>
    </Paper>
  );
};

export default RegisterForm;