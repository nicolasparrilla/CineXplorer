import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Stack, Typography, Box, Popover, MenuItem, TextField, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Iconify from '../../../components/iconify';

export default function ListSelector({ movieLists, setMovieLists, onDeleteList }) {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [editedListIndex, setEditedListIndex] = useState(null);
  const [editedListTitle, setEditedListTitle] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleOpenPopover = (event, index) => {
    setPopoverAnchorEl(event.currentTarget);
    setEditedListIndex(index);
    setEditedListTitle(movieLists[index].title);
    setEditMode(false);
  };

  const handleClosePopover = () => {
    setPopoverAnchorEl(null);
    setEditedListIndex(null);
    setEditedListTitle('');
    setEditMode(false);
  };

  const handleEdit = () => {
    if (editedListTitle.trim() !== '') {
      const updatedLists = [...movieLists];
      updatedLists[editedListIndex].title = editedListTitle;
      setMovieLists(updatedLists);
      handleClosePopover();
    }
  };

  const handleDelete = (listId) => {
    onDeleteList(listId);
    handleClosePopover();
  };

  const handleListTitleChange = (event) => {
    setEditedListTitle(event.target.value);
  };

  const handleEditClick = () => {
    setEditMode(true); // Abre el modo de edición al hacer clic en Editar
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleEdit();
    }
  };

  return (
    <Card sx={{ backgroundColor: 'white', p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom mb={2}>
        Seleccione una lista de películas:
      </Typography>
      <Stack direction="column" spacing={2}>
        {movieLists.map((list, index) => (
          <React.Fragment key={index}>
            <Stack direction="row" alignItems="center">
              <Button
                component={Link}
                to={`/listas/${list.id}`} // Utiliza el ID en la URL
                variant="contained"
                color="primary"
                size="large"
                sx={{ height: 60, fontSize: '1.3rem', flexGrow: 1 }}
              >
                {list.title}
              </Button>
              {/*
              <IconButton size="large" color="inherit" sx={{ opacity: 0.48 }} onClick={(event) => handleOpenPopover(event, index)}>
                <Iconify icon={'eva:more-vertical-fill'} />
              </IconButton> */}
            </Stack>
            {index !== movieLists.length - 1 && (
              <Box
                sx={{
                  borderBottom: '1px dashed #bdbdbd',
                  width: '100%',
                  my: 1,
                }}
              />
            )}
            {/*
            <Popover
              open={Boolean(popoverAnchorEl && editedListIndex === index)}
              anchorEl={popoverAnchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  p: 1,
                  '& .MuiMenuItem-root': {
                    px: 1,
                    typography: 'body2',
                    borderRadius: 0.75,
                  },
                },
              }}
            >
              {editMode && ( // Muestra el TextField solo si está en modo de edición
                <TextField
                  value={editedListTitle}
                  onChange={handleListTitleChange}
                  onKeyPress={handleKeyPress}
                  fullWidth
                  variant="standard"
                  sx={{ mb: 1}}
                />
              )}
              {editMode && ( // Muestra el botón de aplicar cambios solo si está en modo de edición
                <MenuItem onClick={handleEdit}>
                  <Iconify icon={'eva:checkmark'} sx={{ mr: 2 }} />
                  Aplicar cambios
                </MenuItem>
              )}
              {!editMode && ( // Muestra el botón de editar si no está en modo de edición
                <MenuItem onClick={handleEditClick}>
                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                  Edit
                </MenuItem>
              )}
              {!editMode && ( // Muestra el botón de eliminar solo si no está en modo de edición
                <MenuItem onClick={() => handleDelete(list.id)} sx={{ color: 'error.main' }}>
                  <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                  Delete
                </MenuItem>
              )}
            </Popover>
            */}
          </React.Fragment>
        ))}
      </Stack>
    </Card>
  );
}

ListSelector.propTypes = {
  movieLists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Asegúrate de tener un ID en la lista
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  setMovieLists: PropTypes.func.isRequired,
  onDeleteList: PropTypes.func.isRequired,
};