import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import registerValidationSchema from '../validation/registerValidation';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(registerValidationSchema)
  });

  const onSubmit = async (data) => {
    try {
      // Eğer birthDate boş string ise, null olarak ayarla
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
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 1, width: '100%', maxWidth: 400, mx: 'auto' }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Kayıt Ol
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
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        sx={{ mt: 3, mb: 2 }}
      >
        Kayıt Ol
      </Button>
      <Button
        fullWidth
        variant="text"
        color="secondary"
        onClick={() => navigate('/login')}
      >
        Zaten hesabınız var mı? Giriş Yap
      </Button>
    </Box>
  );
};

export default RegisterForm;
