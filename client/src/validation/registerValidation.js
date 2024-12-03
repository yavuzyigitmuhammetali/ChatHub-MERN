import * as yup from 'yup';

const registerValidationSchema = yup.object().shape({
  username: yup.string().required('Kullanıcı adı gerekli').min(3, 'En az 3 karakter'),
  password: yup.string().required('Şifre gerekli').min(6, 'En az 6 karakter'),
  birthDate: yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr)
    .typeError('Geçerli bir tarih giriniz')
});

export default registerValidationSchema;
