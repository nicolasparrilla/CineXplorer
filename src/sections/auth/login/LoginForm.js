import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputAdornment, IconButton, Stack, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../../../AuthContext'; // Importa el contexto de autenticación
import Iconify from '../../../components/iconify';

export default function LoginForm() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth(); // Usa el hook useAuth para acceder a las funciones de autenticación

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleClick = async () => {
    if (validateInputs()) {
      const success = await handleLogin(email, password);
      if (success) {
        navigate('/peliculas', { replace: true });
      } else {
        setEmailError('Correo o contraseña incorrectos');
      }
    }
  };

  const handleRecoverPassword = () => {
    navigate('/forgotpassword');
  };

  const validateInputs = () => {
    let valid = true;
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
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Correo electrónico"
          error={!!emailError}
          helperText={emailError}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          error={!!passwordError}
          helperText={passwordError}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover" href="#" onClick={handleRecoverPassword}>
          ¿Olvidaste tu contraseña?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" variant="contained" onClick={handleClick}>
        Iniciar sesión
      </LoadingButton>
    </>
  );
}
