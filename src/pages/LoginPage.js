import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import RegisterPage from './RegisterPage';


// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
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

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  }

  return (
    <>
      <Helmet>
        <title> Login | CineXplorer </title>
      </Helmet>

      <StyledRoot>
        <Box sx={{ position: 'fixed', top: { xs: 16, sm: 24, md: 40 }, left: { xs: 16, sm: 24, md: 40 }, display: 'flex', alignItems: 'center' }}>
          <Logo />
          <Box sx={{ display: mdUp ? 'flex' : 'none', alignItems: 'center', ml: 2 }}>
            <Typography variant="h3">¡Hola de nuevo!</Typography>
          </Box>
        </Box>
        

        {mdUp && (
          <StyledSection>
            <Box sx={{ maxWidth: '100%', mt: 7}}>
              <img
                src="/assets/illustrations/Cinema-Transparent2.png"
                alt="login"
                style={{ width: '100%', height: 'auto' }} // Establecer el ancho al 100% y altura automática
              />
            </Box>
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h3" gutterBottom>
              Ingresá a CineXplorer
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              ¿No tenés una cuenta? {''}
              <Link onClick={handleRegister} variant="subtitle2" sx={{ cursor: 'pointer' }} >Registráte</Link>
            </Typography>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
