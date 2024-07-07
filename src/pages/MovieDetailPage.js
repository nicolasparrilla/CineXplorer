import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Container } from '@mui/material';
import { fetchMovieDetails, fetchMovieCredits, getImageUrl } from '../tmdbService';
import MovieInd from '../sections/@dashboard/movies/MovieInd';

const MovieDetailPage = () => {
  const { idMovie } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      const movieDetails = await fetchMovieDetails(idMovie);
      const movieCredits = await fetchMovieCredits(idMovie);

      setMovie(movieDetails);
      setCredits(movieCredits);
      setLoading(false);
    };

    fetchMovieData();
  }, [idMovie]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!movie) {
    return <div>No se encontró la película.</div>;
  }

  const roundedRate = Math.round(movie.vote_average * 10);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MovieInd
            id={movie.id}
            title={movie.title}
            cover={getImageUrl(movie.poster_path)}
            rate={roundedRate}
            description={movie.overview}
            director={credits.crew.find((member) => member.job === 'Director')?.name}
            language={movie.original_language}
            createdAt={new Date(movie.release_date)}
            genres={movie.genres.map((genre) => genre.name)}
            cast={credits.cast.slice(0, 10).map((actor) => actor.name)}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetailPage;
