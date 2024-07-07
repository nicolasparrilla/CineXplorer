import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Box, Stack, Button, Drawer, Divider, IconButton, Typography, Slider, MenuItem, Select, TextField } from '@mui/material';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

export const FILTER_GENRE_OPTIONS = [
  { label: 'Acción', id: 28 },
  { label: 'Animación', id: 16 },
  { label: 'Aventura', id: 12 },
  { label: 'Ciencia Ficción', id: 878 },
  { label: 'Comedia', id: 35 },
  { label: 'Crimen', id: 80 },
  { label: 'Documental', id: 99 },
  { label: 'Drama', id: 18 },
  { label: 'Familia', id: 10751 },
  { label: 'Fantasía', id: 14 },
  { label: 'Guerra', id: 10752 },
  { label: 'Historia', id: 36 },
  { label: 'Misterio', id: 9648 },
  { label: 'Música', id: 10402 },
  { label: 'Película de TV', id: 10770 },
  { label: 'Romance', id: 10749 },
  { label: 'Suspense', id: 53 },
  { label: 'Terror', id: 27 },
  { label: 'Western', id: 37 },
];

const LANGUAGE_MAP = {
  es: 'Español',
  en: 'Inglés',
  fr: 'Francés',
  de: 'Alemán',
  it: 'Italiano',
  pt: 'Portugués',
  ko: 'Coreano',
  cn: 'Chino',
  ja: 'Japonés',
  hi: 'Hindi',
  ar: 'Árabe',
  tr: 'Turco',
};

export const FILTER_LANGUAGE_OPTIONS = Object.keys(LANGUAGE_MAP);

MovieFilterSidebar.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  onApplyFilters: PropTypes.func,
};

export default function MovieFilterSidebar({ openFilter, onOpenFilter, onCloseFilter, onApplyFilters }) {
  const savedFilters = JSON.parse(localStorage.getItem('movieFilters')) || {
    selectedGenres: [],
    selectedLanguage: '',
    director: '',
    cast: '',
    ratingValue: [0, 10],
  };

  const [ratingValue, setRatingValue] = useState(savedFilters.ratingValue);
  const [selectedGenres, setSelectedGenres] = useState(savedFilters.selectedGenres);
  const [selectedLanguage, setSelectedLanguage] = useState(savedFilters.selectedLanguage);
  const [director, setDirector] = useState(savedFilters.director);
  const [cast, setCast] = useState(savedFilters.cast);

  const handleRatingChange = (event, newValue) => {
    setRatingValue(newValue);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevSelected) => {
      if (prevSelected.includes(genreId)) {
        return prevSelected.filter((selected) => selected !== genreId);
      }
      return [...prevSelected, genreId];
    });
  };

  const isGenreSelected = (genreId) => selectedGenres.includes(genreId);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleDirectorChange = (event) => {
    setDirector(event.target.value);
  };

  const handleActorChange = (event) => {
    setCast(event.target.value);
  };

  const handleApplyFilters = () => {
    const filters = {
      selectedGenres,
      selectedLanguage,
      director,
      cast,
      ratingValue,
    };
    onApplyFilters(filters);
    localStorage.setItem('movieFilters', JSON.stringify(filters));
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      selectedGenres: [],
      selectedLanguage: '',
      director: '',
      cast: '',
      ratingValue: [0, 10],
    };
    setSelectedGenres([]);
    setSelectedLanguage('');
    setDirector('');
    setCast('');
    setRatingValue([0, 10]);
    onApplyFilters(defaultFilters);
    localStorage.setItem('movieFilters', JSON.stringify(defaultFilters));
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('movieFilters'));
    if (savedFilters) {
      setRatingValue(savedFilters.ratingValue);
      setSelectedGenres(savedFilters.selectedGenres);
      setSelectedLanguage(savedFilters.selectedLanguage);
      setDirector(savedFilters.director);
      setCast(savedFilters.cast);
    }
  }, []);

  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filtrar&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 300, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filtrar
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Idioma
              </Typography>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                sx={{ minWidth: 200, width: '100%' }}
              >
                <MenuItem value="">
                  Sin selección
                </MenuItem>
                {FILTER_LANGUAGE_OPTIONS.map((language) => (
                  <MenuItem key={language} value={language}>
                    {LANGUAGE_MAP[language]}
                  </MenuItem>
                ))}
              </Select>
            </div>
            
            <Divider />

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Director
              </Typography>
              <TextField
                value={director}
                onChange={handleDirectorChange}
                placeholder="Buscar por director..."
                fullWidth
              />
            </div>
            
            <Divider />

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Actor
              </Typography>
              <TextField
                value={cast}
                onChange={handleActorChange}
                placeholder="Buscar por actor..."
                fullWidth
              />
            </div>
            
            <Divider />

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Géneros
              </Typography>
              <div>
                {FILTER_GENRE_OPTIONS.map((genre) => (
                  <Button
                    key={genre.id}
                    variant={isGenreSelected(genre.id) ? 'contained' : 'outlined'}
                    onClick={() => handleGenreChange(genre.id)}
                    sx={{
                      borderRadius: 12,
                      my: 0.5,
                      mx: 0.25,
                      marginRight: 0.75,
                      minWidth: 'auto',
                      maxWidth: 'auto',
                      fontSize: 14,
                      lineHeight: '24px',
                    }}
                  >
                    {genre.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <Divider />

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Puntuación
              </Typography>
              <Slider
                value={ratingValue}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 2.5, label: '2.5' },
                  { value: 5, label: '5' },
                  { value: 7.5, label: '7.5' },
                  { value: 10, label: '10' },
                ]}
                sx={{ width: '100%' }}
              />
            </div>
          </Stack>
        </Scrollbar>

        <Box sx={{ px: 3 }}>
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={handleClearFilters}
          >
            Borrar Filtros
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={handleApplyFilters}
          >
            Buscar
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
