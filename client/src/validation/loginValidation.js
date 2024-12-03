import * as yup from 'yup';

const loginValidationSchema = yup.object().shape({
  username: yup.string().required('Kullanıcı adı gerekli'),
  password: yup.string().required('Şifre gerekli')
});

export default loginValidationSchema;
