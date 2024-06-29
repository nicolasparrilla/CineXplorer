import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { OutlinedInput, InputAdornment } from '@mui/material';
import Iconify from '../../../components/iconify';

const MoviesSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSearchExpand = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchCollapse = () => {
    setIsSearchExpanded(false);
  };

  return (
    <OutlinedInput
      value={searchQuery}
      onChange={handleSearchChange}
      onFocus={handleSearchExpand}
      onBlur={handleSearchCollapse}
      placeholder="Buscar película..."
      startAdornment={
        <InputAdornment position="start">
          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
        </InputAdornment>
      }
      sx={{
        backgroundColor: 'white',
        width: isSearchExpanded ? 320 : 240,
        transition: 'width 0.3s ease-in-out',
        '&.MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: 'black',
          },
        },
      }}
    />
  );
};

MoviesSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default MoviesSearch;
