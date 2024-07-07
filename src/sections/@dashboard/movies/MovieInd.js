import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Grid, Chip, Divider, Avatar, Button, Modal, Slider, Paper, IconButton, FormControl, FormControlLabel, Checkbox, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import { useAuth } from '../../../AuthContext';

const CustomModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledFavoriteButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.grey[800], 0.7),
  color: theme.palette.grey[800],
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[800], 0.9),
  },
  '&.added': {
    '& svg': {
      color: 'gold',
    },
  },
}));

const MovieInd = ({ id, title, cover, rate, description, director, language, createdAt, genres, cast }) => {
  const formattedDate = createdAt.toLocaleDateString('es-ES');

  const [open, setOpen] = useState(false);
  const [newRate, setNewRate] = useState(rate);

  const { isLoggedIn, authState } = useAuth();

  const [movieLists, setMovieLists] = useState(null);
  const [openAddIdModal, setOpenAddIdModal] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!authState) return;

      try {
        const response = await axios.post('http://localhost:4000/api/users/lists/', {
          userId: authState._id
        });
        const userLists = response.data.data;

        setMovieLists(userLists);
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    };

    fetchUserLists();
  }, [authState]);

  const handleOpenAddIdModal = (movieId) => {
    setOpenAddIdModal(true);
    setSelectedMovieId(movieId);
    if (movieLists) {
      const selectedListsForMovie = movieLists
        .filter(list => list.idMovies.includes(movieId.toString()))
        .map(list => list.title);
      setSelectedLists(selectedListsForMovie);
    }
  };

  const handleCloseAddIdModal = () => {
    const addMoviePromises = selectedLists.map(listTitle => {
      const selectedList = movieLists.find(list => list.title === listTitle);
      if (!selectedList) {
        console.error(`La lista '${listTitle}' no fue encontrada.`);
        return null;
      }
  
      const data = {
        userId: authState._id,
        listId: selectedList._id,
        movieId: selectedMovieId.toString()
      };
  
      return axios.post('http://localhost:4000/api/users/lists/addMovie', data);
    });
  
    Promise.all(addMoviePromises)
      .then(() => {
        const updatedLists = movieLists.map(list => ({
          ...list,
          idMovies: selectedLists.includes(list.title)
            ? [...new Set([...list.idMovies, selectedMovieId.toString()])]
            : list.idMovies.filter(id => id !== selectedMovieId.toString())
        }));
  
        setMovieLists(updatedLists);
        setOpenAddIdModal(false);
        setSelectedLists([]);
        setSelectedMovieId(null);
        setError('');
      })
      .catch(error => {
        console.error('Error al actualizar las listas:', error);
        setError('Error al actualizar las listas.');
        setOpenAddIdModal(false);
      });
  };

  const handleListChange = async (event) => {
    const { value, checked } = event.target;
  
    let updatedLists = [...selectedLists];
  
    if (checked) {
      updatedLists.push(value);
    } else {
      updatedLists = updatedLists.filter(list => list !== value);
  
      try {
        const selectedList = movieLists.find(list => list.title === value);
        if (!selectedList) {
          console.error(`La lista '${value}' no fue encontrada.`);
          return;
        }
  
        const data = {
          userId: authState._id,
          listId: selectedList._id,
          movieId: selectedMovieId.toString()
        };
  
        await axios.post('http://localhost:4000/api/users/lists/removeMovie', data);
  
        const updatedMovieLists = movieLists.map(list => 
          list.title === value 
            ? { ...list, idMovies: list.idMovies.filter(id => id !== selectedMovieId.toString()) }
            : list
        );
        setMovieLists(updatedMovieLists);
      } catch (error) {
        console.error('Error al eliminar película de la lista:', error);
        setError('Error al eliminar película de la lista.');
      }
    }
  
    setSelectedLists(updatedLists);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRateChange = (event, newValue) => {
    setNewRate(newValue);
  };

  const handleRateSubmit = () => {
    console.log("Nueva calificación:", newRate);
    handleClose();
  };

  let circleColor;
  if (rate >= 50 && rate <= 66) {
    circleColor = '#FFD700';
  } else if (rate >= 0 && rate <= 49) {
    circleColor = '#FF6347';
  } else {
    circleColor = '#00CE7A';
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <img src={cover} alt={title} style={{ width: '100%', height: 'auto', borderRadius: '16px' }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <div>
              <Typography variant="h3" gutterBottom>
                {title}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Fecha de lanzamiento:</strong> {formattedDate}
                  </Typography>
                </Grid>
              </Grid>
              <div>
                <Typography variant="body1" gutterBottom>
                  <strong>Géneros:</strong> 
                  {genres.map(genre => (
                    <Chip key={genre} label={genre} style={{ margin: '0 4px', marginRight: '2px' }} />
                  ))}
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <Avatar style={{ backgroundColor: circleColor, color: 'black', width: '48px', height: '48px', fontSize: '24px', fontWeight: 'semibold' }}>{rate}</Avatar>
                <Divider orientation="vertical" flexItem style={{ height: '32px', margin: '8px', marginLeft: '16px', marginRight: '16px', borderRightWidth: 1.9 }} />
                {isLoggedIn ? (
                  <Button variant="contained" onClick={() => handleOpenAddIdModal(id)} startIcon={<Iconify icon="eva:bookmark-fill" />}>
                    Guardar
                  </Button>
                ) : (
                  <Button variant="contained" component={Link} to="/login" startIcon={<Iconify icon="eva:bookmark-fill" />}>
                    Guardar
                  </Button>
                )}
                <Modal 
                  open={openAddIdModal} 
                  onClose={handleCloseAddIdModal} 
                  aria-labelledby="modal-title" 
                  aria-describedby="modal-description" 
                  BackdropProps={{
                    onClick: handleCloseAddIdModal
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 300,
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      borderRadius: '12px',
                      p: 4,
                    }}
                  >
                    {!isLoggedIn && (
                      <Box>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          Debe iniciar sesión para continuar.
                        </Typography>
                        <Button variant="contained" color="primary" component={Link} to="/login">
                          Iniciar sesión
                        </Button>
                      </Box>
                    )}
                    {isLoggedIn && (
                      <>
                        <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                          Listas
                        </Typography>
                        <FormControl component="fieldset" sx={{ mb: 2 }}>
                          {movieLists && movieLists.map((list) => (
                            <FormControlLabel
                              key={list._id}
                              control={<Checkbox checked={selectedLists.includes(list.title)} onChange={handleListChange} value={list.title} />}
                              label={list.title}
                            />
                          ))}
                        </FormControl>
                      </>
                    )}
                    {error && (
                      <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        {error}
                      </Typography>
                    )}
                  </Box>
                </Modal>
              </div>
              <Typography variant="body1" gutterBottom>
                <strong>Descripción:</strong> {description}
              </Typography>
              <Divider style={{ margin: '24px 0' }} />
              <Typography variant="body1" gutterBottom>
                <strong>Director:</strong> {director}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Reparto:</strong> {cast.join(', ')}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </CardContent>

      <CustomModal
        open={open}
        onClose={handleClose}
      >
        <Paper style={{ backgroundColor: '#ffffff', boxShadow: 24, padding: 24, maxWidth: 400, width: '80%' }}>
          <Typography variant="h5" gutterBottom>Calificar</Typography>
          <Slider
            value={newRate}
            onChange={handleRateChange}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={0}
            max={100}
          />
          <Button variant="contained" onClick={handleRateSubmit}>Aceptar</Button>
        </Paper>
      </CustomModal>
    </Card>
  );
};

MovieInd.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  rate: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  director: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  cast: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MovieInd;