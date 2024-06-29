import axios from 'axios';

const API_KEY = '0b380e08eb58960542b5d6fdc0dc4974'; // Reemplaza esto con tu clave de API de TMDB
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'; // URL base para las imágenes de TMDB

const GENRE_MAP = {
  'Acción': 28,
  'Animación': 16,
  'Aventura': 12,
  'Ciencia Ficción': 878,
  'Comedia': 35,
  'Crimen': 80,
  'Documental': 99,
  'Drama': 18,
  'Familia': 10751,
  'Fantasía': 14,
  'Guerra': 10752,
  'Historia': 36,
  'Misterio': 9648,
  'Música': 10402,
  'Película de TV': 10770,
  'Romance': 10749,
  'Suspense': 53,
  'Terror': 27,
  'Western': 37,
};

export const fetchMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const getImageUrl = (path, size = 'original') => {
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchMovieCredits = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return { cast: [], crew: [] };
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
        query,
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const searchMoviesByDirector = async (directorName, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/person`, {
      params: {
        api_key: API_KEY,
        query: directorName,
      },
    });

    const directorId = response.data.results[0]?.id; // Tomamos el primer resultado de la búsqueda del director
    if (!directorId) {
      return [];
    }

    const moviesResponse = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_people: directorId,
        page,
        language: 'es-ES',
      },
    });

    return moviesResponse.data.results;
  } catch (error) {
    console.error('Error searching movies by director:', error);
    return [];
  }
};

export const searchMoviesByActor = async (actorName, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/person`, {
      params: {
        api_key: API_KEY,
        query: actorName,
      },
    });

    const actorId = response.data.results[0]?.id; // Tomamos el primer resultado de la búsqueda del actor
    if (!actorId) {
      return [];
    }

    const moviesResponse = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_cast: actorId,
        page,
        language: 'es-ES',
      },
    });

    return moviesResponse.data.results;
  } catch (error) {
    console.error('Error searching movies by actor:', error);
    return [];
  }
};

export const fetchMoviesByRating = async (ratingValue, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
        sort_by: 'popularity.desc',
        'vote_average.gte': ratingValue[0],
        'vote_average.lte': ratingValue[1],
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by rating:', error);
    return [];
  }
};

export const searchMoviesByRating = async (query, ratingValue, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
        query,
        'vote_average.gte': ratingValue[0],
        'vote_average.lte': ratingValue[1],
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies by rating:', error);
    return [];
  }
};

export const fetchMoviesByGenre = async (genres, page = 1) => {
  try {
    const genreIds = genres.join(',');
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
        page,
        with_genres: genreIds,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
};
