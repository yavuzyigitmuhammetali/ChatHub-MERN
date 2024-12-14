import { Container, Paper, Box, IconButton } from '@mui/material';
import LoginForm from '../components/LoginForm';
import AnimatedPage from '../components/AnimatedPage';
import { Instagram, Twitter, Facebook } from '@mui/icons-material';

const LoginPage = () => {
  const socialMediaStyles = {
    fontSize: '2rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.6)',
    }
  };

  return (
    <AnimatedPage>
      <Container 
        component="main" 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh', 
          position: 'relative' 
        }}
      >
        <LoginForm />
        <Paper 
          elevation={4} 
          sx={{ 
            position: 'absolute', 
            bottom: 50, 
            left: -200, 
            display: 'flex', 
            gap: 1, 
            px: 2, 
            py: 1, 
            borderRadius: '20px', 
            backgroundColor: 'white',
            boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
          }}
        >
          <IconButton href="https://instagram.com" target="_blank" sx={{ p: 1 }}>
            <Instagram sx={{ 
              ...socialMediaStyles, 
              fontSize: '3rem', 
              color: '#E4405F', 
              '&:hover': { color: '#d62976' } 
            }} />
          </IconButton>
          <IconButton href="https://twitter.com" target="_blank" sx={{ p: 1 }}>
            <Twitter sx={{ 
              ...socialMediaStyles, 
              fontSize: '3rem', 
              color: '#1DA1F2', 
              '&:hover': { color: '#0d8ed9' } 
            }} />
          </IconButton>
          <IconButton href="https://facebook.com" target="_blank" sx={{ p: 1 }}>
            <Facebook sx={{ 
              ...socialMediaStyles, 
              fontSize: '3rem', 
              color: '#4267B2', 
              '&:hover': { color: '#2f477a' } 
            }} />
          </IconButton>
        </Paper>
      </Container>
    </AnimatedPage>
  );
};

export default LoginPage;