import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputAdornment, IconButton, Stack, Box, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../../../AuthContext';
import Iconify from '../../../components/iconify';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { handleRegister, handleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleClick = async () => {
    if (validateInputs()) {
      const success = await handleRegister(name, email, password);
      if (success.status === 400) {
        setGeneralError(success.message);
      } else if (success) {
        await handleLogin(email, password);
        navigate('/peliculas', { replace: true });
      }
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const validateInputs = () => {
    let valid = true;
    if (name.trim() === '') {
      setNameError('El campo de nombre no puede estar vacío.');
      valid = false;
    } else {
      setNameError('');
    }
    if (email.trim() === '') {
      setEmailError('El campo de correo electrónico no puede estar vacío.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Debe ingresar una dirección de correo electrónico válida.');
      valid = false;
    } else {
      setEmailError('');
    }
    if (password.trim() === '') {
      setPasswordError('El campo de contraseña no puede estar vacío.');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <Stack spacing={3}>
        {generalError && (
          <Alert severity="error">{generalError}</Alert>
        )}

        <TextField
          id="name"
          name="name"
          type="text"
          label="Ingresa tu nombre"
          value={name}
          onChange={handleNameChange}
          error={!!nameError}
          helperText={nameError}
          required
        />

        <TextField
          id="email"
          name="email"
          type="email"
          label="Correo Electrónico"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          required
        />

        <TextField
          id="password"
          name="password"
          label="Contraseña"
          value={password}
          onChange={handlePasswordChange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!passwordError}
          helperText={passwordError}
          required
        />
      </Stack>

      <Box mt={3}>
        <LoadingButton fullWidth size="large" variant="contained" onClick={handleClick}>
          Registrarse
        </LoadingButton>
      </Box>
    </>
  );
}
