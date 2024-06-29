/* eslint-disable camelcase */

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Typography, Modal, Box, Button, FormControl, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import { fDate } from '../../../utils/formatTime';
import { useAuth } from '../../../AuthContext';
import { getImageUrl } from '../../../tmdbService';

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 14 / 9)',
});

const StyledTitle = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  height: ({ titleLines }) => (titleLines === 1 ? '22px' : '44px'),
}));

const StyledRateSquare = styled('div')(({ theme, rate }) => ({
  zIndex: 9,
  width: 40,
  height: 40,
  position: 'absolute',
  left: theme.spacing(1.5),
  bottom: theme.spacing(-2.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  backgroundColor: rate >= 5 && rate <= 6.6 ? '#FFD700' : rate >= 0 && rate <= 4.9 ? '#FF6347' : '#00CE7A',
  color: 'black',
  fontSize: '1rem',
  fontWeight: 'bold',
}));

const StyledButton = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
}));

const StyledCover = styled('img')({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const MovieCard = ({ movie, index }) => {
  const { id, title, overview, poster_path, release_date, vote_average } = movie;
  const { isLoggedIn, authState } = useAuth();

  // URL y estructura de la solicitud POST para agregar película a lista
  const addMovieToListUrl = 'http://localhost:4000/api/users/lists/addMovie';

  // Estados locales
  const [movieLists, setMovieLists] = useState(null);
  const [openAddIdModal, setOpenAddIdModal] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [error, setError] = useState('');

  // Efecto para obtener las listas de películas del usuario
  useEffect(() => {
    const fetchUserLists = async () => {
      if (!authState || !isLoggedIn) return;

      try {
        const response = await axios.post('http://localhost:4000/api/users/lists/', {
          userId: authState._id
        });
        const userLists = response.data.data;

        setMovieLists(userLists); // Establecer las listas de películas del usuario
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    };

    fetchUserLists();
  }, [authState, isLoggedIn]);

  // Efecto para manejar la apertura del modal y la selección de listas para la película
  useEffect(() => {
    if (openAddIdModal && selectedMovieId !== null) {
      const selectedListsForMovie = movieLists
        .filter(list => list.idMovies.includes(selectedMovieId.toString()))
        .map(list => list.title);
      setSelectedLists(selectedListsForMovie);
    }
  }, [openAddIdModal, selectedMovieId, movieLists]);

  // Función para abrir el modal y establecer la película seleccionada
  const handleOpenAddIdModal = (movieId) => {
    setOpenAddIdModal(true);
    setSelectedMovieId(movieId);
  };

  // Función para cerrar el modal y guardar la película en las listas seleccionadas
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
  
      return axios.post(addMovieToListUrl, data);
    });
  
    Promise.all(addMoviePromises)
      .then(() => {
        // Actualizar las listas después de agregar la película
        const updatedLists = [...movieLists];
        selectedLists.forEach(listTitle => {
          const listIndex = updatedLists.findIndex(list => list.title === listTitle);
          if (listIndex !== -1) {
            updatedLists[listIndex].idMovies.push(selectedMovieId.toString());
          }
        });
  
        setMovieLists(updatedLists);
        setOpenAddIdModal(false); // Cerrar el modal después de guardar
        setSelectedLists([]); // Limpiar la selección de listas
        setSelectedMovieId(null); // Limpiar la película seleccionada
        setError(''); // Limpiar cualquier error previo
      })
      .catch(error => {
        setOpenAddIdModal(false); // Cerrar el modal después de guardar
      });
  };

  // Función para manejar el cambio en la selección de listas
  const handleListChange = async (event) => {
    const { value, checked } = event.target;
  
    // Clonar el estado actual de selectedLists
    let updatedLists = [...selectedLists];
  
    // Si está marcado el checkbox, agregar película a la lista
    if (checked) {
      updatedLists.push(value);
    } else {
      // Si está desmarcado el checkbox, remover película de la lista
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
  
        // Llamar al endpoint para eliminar la película de la lista
        await axios.post('http://localhost:4000/api/users/lists/removeMovie', data);
  
        // Actualizar el estado local de listas después de eliminar la película
        const listIndex = updatedLists.findIndex(list => list === value);
        if (listIndex !== -1) {
          const movieIds = movieLists[listIndex].idMovies.filter(id => id !== selectedMovieId.toString());
          movieLists[listIndex].idMovies = movieIds;
          setMovieLists([...movieLists]);
        }
      } catch (error) {
        console.error('Error al eliminar película de la lista:', error);
        setError('Error al eliminar película de la lista.');
      }
    }
  
    // Actualizar el estado de selectedLists después de todos los cambios
    setSelectedLists(updatedLists);
  };

  // Función para formatear la fecha
  const formatDate = dateString => {
    if (!dateString) {
      return 'Fecha desconocida';
    }

    const date = new Date(dateString);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }

    return 'Fecha inválida';
  };

  // Función para formatear la calificación
  const formatRating = rating => {
    if (rating === null || rating === undefined) {
      return 'N/A';
    }

    return Math.round(rating * 10); // Convierte la calificación a un entero de dos cifras
  };

  // Función para manejar el clic en el blog
  const handleBlogClick = () => {
    console.log('ID del blog:', movie.id);
    console.log('Título del blog:', title);
    console.log(authState._id);
  };

  return (
    <Grid item xs={12} sm={6} md={2.4}>
      <Card sx={{ position: 'relative', height: '100%' }}>
        <StyledCardMedia>
          <Link to={`/peliculas/${movie.id}`} onClick={handleBlogClick}>
            <StyledCover alt={title} src={getImageUrl(poster_path, 'w500')} />
          </Link>
          <StyledRateSquare rate={vote_average}>{formatRating(vote_average)}</StyledRateSquare>
        </StyledCardMedia>

        <CardContent sx={{ pt: 4 }}>
          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="none"
            sx={{ fontSize: '1rem', '&:hover': { color: 'blue' } }}
          >
            <Link
              to={`/peliculas/${movie.id}`}
              onClick={handleBlogClick}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {title}
            </Link>
          </StyledTitle>

          <Typography
            gutterBottom
            variant="caption"
            sx={{
              color: 'text.disabled',
              display: 'block',
              fontSize: '0.8rem',
              mb: 7,
            }}
          >
            {formatDate(release_date)}
          </Typography>

          <StyledButton sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <CardContent>
              <Box
                key={index}
                sx={{
                  maxWidth: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isLoggedIn ? (
                  <Button variant="contained" color="primary" onClick={() => handleOpenAddIdModal(movie.id)} startIcon={<Iconify icon="eva:bookmark-fill" />}>
                    Guardar
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" component={Link} to="/login" startIcon={<Iconify icon="eva:bookmark-fill" />}>
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
                        {error && (
                          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                            {error}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                </Modal>
              </Box>
            </CardContent>
          </StyledButton>
        </CardContent>
      </Card>
    </Grid>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    release_date: PropTypes.string.isRequired,
    vote_average: PropTypes.number,
  }).isRequired,
};

export default MovieCard;

