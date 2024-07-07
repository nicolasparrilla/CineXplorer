import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, TextField, Button, Box, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
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

export default function PassRecovery() {
  const [email, setEmail] = useState('');
  const [state, setState ] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email.trim() === '') {
      setError('El campo de correo electrónico no puede estar vacío.');
    } else if (!isValidEmail(email)) {
      setError('Debe ingresar una dirección de email válida.');
    } else {
      try {
        const response = await axios.post('http://localhost:4000/api/users/forgot-password', { email });
        setState(false);
      } catch (error) {
        setError('Hubo un error al enviar el correo. Por favor, intente nuevamente.');
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBackLogin = () => {
    navigate('/login');
  };

  const handleBackHome = () => {
    navigate('/peliculas');
  };
  
  return (
    <>
      <Helmet>
        <title> Recupero | CineXplorer </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        
        {state ? (
          <>
            <Container maxWidth="sm">
              <StyledContent>
                <Typography variant="h3" gutterBottom>
                  Recuperar contraseña
                </Typography>

                <Typography variant="body2">
                  Ingresá tu correo electrónico.
                  <Box sx={{ display: 'inline-block', ml: 0.5 }}>
                    <Link sx={{ cursor: 'pointer' }} onClick={handleBackLogin}>
                      Volver a inicio de sesión.
                    </Link>
                  </Box>
                </Typography>

                <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                  <TextField
                    name="correo"
                    label="Correo electrónico"
                    sx={{ my: 2 }}
                    onChange={handleChange}
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
                    Enviar Correo
                  </Button>
                </Stack>
              </StyledContent>
            </Container>
          </>
        ) : (
          <StyledContent2>
            <Typography variant="h3" sx={{ mb: 3 }} align="center">
              Te enviamos un correo con los pasos a seguir.
            </Typography>
            <Button size="large" variant="outlined" sx={{ width: '50%' }} onClick={handleBackHome}>
              Volver a Inicio
            </Button>
          </StyledContent2>
        )}
        
      </StyledRoot>
    </>
  );
}