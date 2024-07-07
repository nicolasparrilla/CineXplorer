import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import Logo from '../components/logo';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  
}));

const StyledContent2 = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  alignItems:"center"
}));

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');
  
    useEffect(() => {
      if (!token) {
        navigate('/login');
      }
    }, [token, navigate]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      try {
        const response = await axios.post('http://localhost:4000/api/users/reset-password', { token, newPassword: password });
        setSuccess(true);
      } catch (error) {
        setError('Hubo un error al cambiar la contraseña. Por favor, intente nuevamente.');
      }
    };
  
    if (success) {
      return (
        <StyledContent2>
          <Typography variant="h3" sx={{ mb: 3 }} align="center">
            Tu contraseña ha sido cambiada exitosamente.
          </Typography>
          <Button size="large" variant="outlined" sx={{ width: '50%' }} onClick={() => navigate('/login')}>
            Ir a Inicio de Sesión
          </Button>
        </StyledContent2>
      );
    }
  
    return (
      <>
        <Helmet>
          <title> Restablecer Contraseña | CineXplorer </title>
        </Helmet>
  
        <StyledRoot>
          <Logo
            sx={{
              position: 'fixed',
              top: { xs: 16, sm: 24, md: 40 },
              left: { xs: 16, sm: 24, md: 40 },
            }}
          />
  
          <Container maxWidth="sm">
            <StyledContent>
              <Typography variant="h3" gutterBottom>
                Restablecer contraseña
              </Typography>
  
              <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                <TextField
                  name="password"
                  label="Nueva contraseña"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                />
                <TextField
                  name="confirmPassword"
                  label="Confirmar nueva contraseña"
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!error}
                  helperText={error}
                />
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                  disableElevation
                >
                  Cambiar Contraseña
                </Button>
              </Stack>
            </StyledContent>
          </Container>
        </StyledRoot>
      </>
    );
}