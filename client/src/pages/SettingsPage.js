import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Avatar,
  Collapse,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ExpandMore, ExpandLess, Delete, Info } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = () => {
  const { logout } = useAuth();
  const [language, setLanguage] = useState('en');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [expandSection, setExpandSection] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const toggleSection = (section) => {
    setExpandSection(expandSection === section ? null : section);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <Box
      p={3}
      sx={{
        maxWidth: 600,
        margin: 'auto',
        borderRadius: 4,
        boxShadow: 3,
        backgroundColor: isDarkTheme ? '#1e1e1e' : '#fff',
        color: isDarkTheme ? '#fff' : '#000',
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Avatar
          alt="User Avatar"
          src="/static/avatar.jpg"
          sx={{ width: 100, height: 100, margin: 'auto' }}
        />
        <Typography variant="h5" fontWeight="bold" mt={2}>
          John Doe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          john.doe@example.com
        </Typography>
      </Box>

      {/* Settings Sections */}
      <Grid container spacing={2}>
        {/* Language Settings */}
        <Grid item xs={12}>
          <Box
            onClick={() => toggleSection('language')}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <Typography variant="h6">Language</Typography>
            <IconButton>
              {expandSection === 'language' ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandSection === 'language'}>
            <FormControl fullWidth>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                value={language}
                onChange={handleLanguageChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="tr">Türkçe</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
              </Select>
            </FormControl>
          </Collapse>
        </Grid>

        {/* Theme Settings */}
        <Grid item xs={12}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkTheme}
                  onChange={handleThemeToggle}
                  color="primary"
                />
              }
              label="Dark Theme"
            />
          </motion.div>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={handleNotificationsToggle}
                  color="primary"
                />
              }
              label="Enable Notifications"
            />
          </motion.div>
        </Grid>

     

        <Grid item xs={12}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<Delete />}
              onClick={openDeleteDialog}
            >
              Delete Account
            </Button>
          </motion.div>
        </Grid>
      </Grid>

      {/* Account Deletion Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => alert('Account deleted!')} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
