import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Button, Drawer, Typography, Stack } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
// importa los dos conjuntos de configuraciones de navegación
import navConfig from './config';
import navConfigLogged from './configLogged';
import { useAuth } from '../../../AuthContext';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  // Determinar qué conjunto de configuración de navegación usar según el estado de autenticación
  const currentNavConfig = isLoggedIn ? navConfigLogged : navConfig;

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, pb: 1, pt: 3, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Logo />
        </Box>
       
        <Typography variant="h6" sx={{ marginLeft: 2, color: 'white' }}>
          ¡Bienvenido a CineXplorer!
        </Typography>
      </Box>

      <NavSection data={currentNavConfig} />

      {!isLoggedIn && (
        <Box sx={{ px: 2.5, pb: 0, mt: 2 }}>
          <Stack alignItems="center" spacing={1} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
            <Typography variant="h7" color="white" textAlign={'center'}>
              ¿Querés guardar películas?
            </Typography>
            <Button component={RouterLink} to="/login" variant="contained">
              Iniciar sesión
            </Button>
            <Button component={RouterLink} to="/register" variant="outlined">
              Registrarse
            </Button>
          </Stack>
        </Box>
      )}
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: '#121212', // Cambiar el color de fondo aquí
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: '#121212',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
