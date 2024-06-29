import { useState } from 'react';
import { Menu, Button, MenuItem, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';

const SORT_BY_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguas'},
  { value: 'goodrate', label: 'Valoración descendente' },
  { value: 'badrate', label: 'Valoración ascendente'},
  { value: 'titleAZ', label: 'Título (A-Z)' },
  { value: 'titleZA', label: 'Título (Z-A)' },
];

export default function MovieSort({ setFilteredMovies }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortOption = (sortByValue) => {
    handleClose();
    setFilteredMovies(sortByValue);
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Ordenar:&nbsp;
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === 'newest'}
            onClick={() => handleSortOption(option.value)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

