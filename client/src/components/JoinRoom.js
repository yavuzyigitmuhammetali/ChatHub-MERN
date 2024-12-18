import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  InputAdornment, 
  IconButton, 
  Stack,
  Tooltip
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  ArrowBack as BackIcon 
} from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import roomValidationSchema from '../validation/roomValidation';
import api from '../services/api';
import { toast } from 'react-toastify';

const JoinRoom = ({ onSuccess, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(roomValidationSchema),
    defaultValues: {
      roomCode: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/rooms/join', data);
      toast.success('Odaya başarıyla katıldınız');
      onSuccess(data.roomCode);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Odaya katılım başarısız');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: '100%', 
        maxWidth: 400, 
        mx: 'auto', 
        p: 3, 
        borderRadius: 2 
      }}
    >
      <Typography 
        variant="h5" 
        component="h2" 
        align="center" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          mb: 3,
          color: 'primary.main'
        }}
      >
        Odaya Katıl
      </Typography>

      <Stack 
        component="form" 
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
      >
        <Controller
          name="roomCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Oda Kodu"
              placeholder="12 haneli kodu girin"
              error={!!errors.roomCode}
              helperText={errors.roomCode?.message}
              inputProps={{ 
                maxLength: 12,
                style: { 
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {field.value.length}/12
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Oda Şifresi (Opsiyonel)"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip 
                      title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                    >
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          )}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{ 
              py: 1.5,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            Odaya Katıl
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={onBack}
            startIcon={<BackIcon />}
            sx={{ 
              py: 1.5,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            Geri
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default JoinRoom;