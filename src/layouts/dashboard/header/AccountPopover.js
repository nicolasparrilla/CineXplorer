import { useState } from 'react';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/system';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { useAuth } from '../../../AuthContext';

const MENU_OPTIONS = [
  {
    label: 'Inicio',
    icon: 'eva:home-fill',
  },
  {
    label: 'Cuenta',
    icon: 'eva:person-fill',
  },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { authState, isLoggedIn, handleLogout } = useAuth();
  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={(event) => setOpen(event.currentTarget)}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={authState?.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {authState?.name || 'Usuario'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {authState?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed', mx: 0 }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => {
            if (option.label === 'Inicio') {
              return (
                <MenuItem key={option.label} component={Link} to="/" onClick={handleClose}>
                  {option.label}
                </MenuItem>
              );
            }
            /*
            if (isLoggedIn && (option.label === 'Cuenta' || option.label === 'Ajustes')) {
              return (
                <MenuItem key={option.label} onClick={handleClose}>
                  {option.label}
                </MenuItem>
              );
            }
            */
            return null;
          })}
          {!isLoggedIn && (
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              <MenuItem onClick={handleClose}>
                Iniciar sesión
              </MenuItem>
            </Link>
          )}
        </Stack>

        {isLoggedIn && (
          <Divider sx={{ borderStyle: 'dashed', mx: 0 }} />
        )}

        {isLoggedIn && (
          <MenuItem component={Link} to="/" onClick={handleLogout} sx={{ m: 1 }}>
            Cerrar sesión
          </MenuItem>
        )}
      </Popover>
    </>
  );
}