import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  InputAdornment, 
  IconButton, 
  Paper,
  Stack,
  Tooltip
} from '@mui/material';
import { 
  Shuffle as ShuffleIcon, 
  ContentCopy as CopyIcon, 
  ArrowBack as BackIcon 
} from '@mui/icons-material';

import roomValidationSchema from '../validation/roomValidation';
import api from '../services/api';
import { toast } from 'react-toastify';

const CreateRoom = ({ onSuccess, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
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
    setIsGenerating(true);
    try {
      const response = await api.get('/rooms/generate-code');
      setValue('roomCode', response.data.roomCode);
      toast.success('Rastgele oda kodu oluşturuldu');
    } catch (error) {
      toast.error('Oda kodu oluşturma başarısız');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyRoomCode = () => {
    const roomCode = getValues('roomCode');
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast.success('Oda kodu panoya kopyalandı');
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: '100%', 
        maxWidth: 400, 
        mx: 'auto', 
        p: 5, 
        borderRadius: 5 
      }}
    >
      <Typography 
        variant="h5" 
        component="h2" 
        align="center" 
        gutterBottom 
        sx={{ fontWeight: 600, mb: 3 }}
      >
        Oda Oluştur
      </Typography>

      <Box 
        component="form" 
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2}>
          <Controller
            name="roomCode"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  {...field}
                  fullWidth
                  label="Oda Kodu"
                  placeholder="12 haneli kod"
                  error={!!errors.roomCode}
                  helperText={errors.roomCode?.message}
                  inputProps={{ maxLength: 12 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {field.value.length}/12
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tooltip title="Rastgele Kod Oluştur">
                          <span>
                            <IconButton 
                              onClick={generateRoomCode}
                              disabled={isGenerating}
                              edge="start"
                              size="small"
                            >
                              <ShuffleIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {field.value && (
                          <Tooltip title="Kodu Kopyala">
                            <span>
                              <IconButton 
                                onClick={copyRoomCode}
                                edge="end"
                                size="small"
                                sx={{ ml: 1 }}
                              >
                                <CopyIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="password"
                label="Oda Şifresi (Opsiyonel)"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{ py: 1.5 }}
            >
              Oda Oluştur
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={onBack}
              startIcon={<BackIcon />}
              sx={{ py: 1.5 }}
            >
              Geri
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default CreateRoom;