import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Grid, Stack, Typography, Button } from '@mui/material';
import MoviesSearch from '../sections/@dashboard/movies/MoviesSearch';
import MovieSort from '../sections/@dashboard/movies/MovieSort';
import MovieFilterSidebar, { FILTER_GENRE_OPTIONS } from '../sections/@dashboard/movies/MovieFilterSidebar';
import MovieCard from '../sections/@dashboard/movies/MovieCard';
import { fetchMovies, searchMovies, searchMoviesByDirector, searchMoviesByActor, fetchMoviesByGenre } from '../tmdbService';

export default function MoviesPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('movieFilters');
    return savedFilters ? JSON.parse(savedFilters) : {
      selectedGenres: [],
      selectedLanguage: '',
      director: '',
      cast: '',
      ratingValue: [0, 10],
    };
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchMoviesData = async (pageNumber, newFilters = filters) => {
    setLoading(true);
    try {
      let fetchedMovies = [];
      if (isSearching && searchQuery) {
        fetchedMovies = await searchMovies(searchQuery, pageNumber);
      } else if (newFilters.director) {
        fetchedMovies = await searchMoviesByDirector(newFilters.director, pageNumber);
      } else if (newFilters.cast) {
        fetchedMovies = await searchMoviesByActor(newFilters.cast, pageNumber);
      } else if (newFilters.selectedGenres.length > 0) {
        fetchedMovies = await fetchMoviesByGenre(newFilters.selectedGenres, pageNumber);
      } else {
        fetchedMovies = await fetchMovies(pageNumber);
      }
      if (pageNumber === 1) {
        setMovies(fetchedMovies);
        setFilteredMovies(applyFilters(fetchedMovies, newFilters));
      } else {
        const newMovies = [...movies, ...fetchedMovies];
        setMovies(newMovies);
        setFilteredMovies(applyFilters(newMovies, newFilters));
      }
      setHasMore(fetchedMovies.length >= 20);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (movies, newFilters) => {
    return movies.filter(movie => {
      if (newFilters.selectedGenres.length > 0 && !newFilters.selectedGenres.every(genre => movie.genre_ids.includes(genre))) {
        return false;
      }
      if (newFilters.selectedLanguage && movie.original_language !== newFilters.selectedLanguage) {
        return false;
      }
      if (movie.vote_average < newFilters.ratingValue[0] || movie.vote_average > newFilters.ratingValue[1]) {
        return false;
      }
      return true;
    });
  };

  useEffect(() => {
    fetchMoviesData(page, filters);
  }, [page, filters]);

  useEffect(() => {
    if (!isSearching) {
      fetchMoviesData(1, filters);
    } else {
      fetchMoviesData(1, filters);
    }
  }, [isSearching, searchQuery]);

  const handleSearch = query => {
    setSearchQuery(query);
    setIsSearching(!!query);
    setPage(1);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleSortOption = sortByValue => {
    const sortedMovies = [...filteredMovies];
    switch (sortByValue) {
      case 'newest':
        sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        break;
      case 'oldest':
        sortedMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        break;
      case 'goodrate':
        sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'badrate':
        sortedMovies.sort((a, b) => a.vote_average - b.vote_average);
        break;
      case 'titleAZ':
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleZA':
        sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    setFilteredMovies(sortedMovies);
  };

  const handleApplyFilters = newFilters => {
    setFilters(newFilters);
    setPage(1);
    localStorage.setItem('movieFilters', JSON.stringify(newFilters));
  };

  const loadMoreMovies = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight && hasMore && !loading) {
      loadMoreMovies();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <>
      <Helmet>
        <title>Películas | CineXplorer</title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Películas
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <MoviesSearch onSearch={handleSearch} />
          <Stack direction="row" spacing={1}>
            <MovieFilterSidebar 
              openFilter={openFilter} 
              onOpenFilter={handleOpenFilter} 
              onCloseFilter={handleCloseFilter} 
              onApplyFilters={handleApplyFilters} 
            />
            <MovieSort setFilteredMovies={handleSortOption} />
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          {filteredMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </Grid>

        {filteredMovies.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
            No se encontraron películas que coincidan con la búsqueda.
          </Typography>
        )}

        {hasMore && (
          <Stack alignItems="center" sx={{ mt: 4 }}>
            <Button variant="contained" onClick={loadMoreMovies} disabled={loading}>
              {loading ? 'Cargando...' : 'Cargar más'}
            </Button>
          </Stack>
        )}
      </Container>
    </>
  );
}