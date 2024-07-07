/* eslint-disable camelcase */

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Typography, Modal, Box, Button, FormControl, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
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
  const addMovieToListUrl = 'http://localhost:4000/api/users/lists/addMovie';

  const [movieLists, setMovieLists] = useState(null);
  const [openAddIdModal, setOpenAddIdModal] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!authState || !isLoggedIn) return;

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
  }, [authState, isLoggedIn]);

  useEffect(() => {
    if (openAddIdModal && selectedMovieId !== null && movieLists) {
      const selectedListsForMovie = movieLists
        .filter(list => list.idMovies.includes(selectedMovieId.toString()))
        .map(list => list.title);
      setSelectedLists(selectedListsForMovie);
    }
  }, [openAddIdModal, selectedMovieId, movieLists]);

  const handleOpenAddIdModal = (movieId) => {
    setOpenAddIdModal(true);
    setSelectedMovieId(movieId);
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
  
      return axios.post(addMovieToListUrl, data);
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

  const formatRating = rating => {
    if (rating === null || rating === undefined) {
      return 'N/A';
    }

    return Math.round(rating * 10);
  };

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