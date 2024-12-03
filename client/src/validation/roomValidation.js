import * as yup from 'yup';

const roomValidationSchema = yup.object().shape({
  roomCode: yup.string().required('Oda kodu gerekli').length(12, 'Oda kodu 12 karakter olmalı'),
  password: yup.string().nullable().notRequired()
});

export default roomValidationSchema;
