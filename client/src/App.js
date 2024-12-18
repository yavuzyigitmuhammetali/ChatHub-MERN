import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnimatePresence } from "framer-motion";
import './App.css';
import { useEffect } from 'react';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    }
  }
});



const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/chat" /> : <RegisterPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/chat" /> : <LoginPage />} />
      <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <div className="background">
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ToastContainer position="top-right" autoClose={5000} />
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
    </div>
  );
};

export default App;
