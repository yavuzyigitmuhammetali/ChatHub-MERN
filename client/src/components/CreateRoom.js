import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, InputAdornment } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import roomValidationSchema from '../validation/roomValidation';
import api from '../services/api';
import { toast } from 'react-toastify';

const CreateRoom = ({ onSuccess, onBack }) => {
  const {
    control,
    handleSubmit,
    setValue,
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
      await api.post('/rooms/create', data);
      toast.success('Oda başarıyla oluşturuldu');
      onSuccess(data.roomCode);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Oda oluşturma başarısız');
    }
  };

  const generateRoomCode = async () => {
    try {
      const response = await api.get('/rooms/generate-code');
      setValue('roomCode', response.data.roomCode);
    } catch (error) {
      toast.error('Oda kodu oluşturma başarısız');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 2, width: '100%', maxWidth: 400, mx: 'auto' }}
    >
      <Typography variant="h6" component="h2" align="center" gutterBottom>
        Oda Oluştur
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
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
              sx={{ mr: 1 }}
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
        <Button
          variant="outlined"
          onClick={generateRoomCode}
          size="small"
          sx={{ mt: 2, minWidth: '120px' }}
        >
          Rastgele Kod Oluştur
        </Button>
      </Box>
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="Oda Şifresi (Opsiyonel)"
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
        Oluştur
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

export default CreateRoom;
