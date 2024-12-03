import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, InputAdornment } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import roomValidationSchema from '../validation/roomValidation';
import api from '../services/api';
import { toast } from 'react-toastify';

const JoinRoom = ({ onSuccess, onBack }) => {
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 2, width: '100%', maxWidth: 400, mx: 'auto' }}
    >
      <Typography variant="h6" component="h2" align="center" gutterBottom>
        Odaya Katıl
      </Typography>
      <Controller
        name="roomCode"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="12 Haneli Oda Kodu"
            error={!!errors.roomCode}
            helperText={errors.roomCode?.message}
            inputProps={{
              maxLength: 12,
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
            margin="normal"
            fullWidth
            label="Oda Şifresi (Varsa)"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        sx={{ mt: 3, mb: 2 }}
      >
        Katıl
      </Button>
      <Button
        fullWidth
        variant="outlined"
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Geri
      </Button>
    </Box>
  );
};

export default JoinRoom;
