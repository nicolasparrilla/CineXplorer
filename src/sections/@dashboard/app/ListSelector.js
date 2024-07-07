import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Stack, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ListSelector({ movieLists, setMovieLists, onDeleteList }) {
  const [editedListIndex, setEditedListIndex] = useState(null);
  const [editedListTitle, setEditedListTitle] = useState('');


  const handleClosePopover = () => {
    setPopoverAnchorEl(null);
    setEditedListIndex(null);
    setEditedListTitle('');
    setEditMode(false);
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
                to={`/listas/${list.id}`}
                variant="contained"
                color="primary"
                size="large"
                sx={{ height: 60, fontSize: '1.3rem', flexGrow: 1 }}
              >
                {list.title}
              </Button>
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
          </React.Fragment>
        ))}
      </Stack>
    </Card>
  );
}

ListSelector.propTypes = {
  movieLists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  setMovieLists: PropTypes.func.isRequired,
  onDeleteList: PropTypes.func.isRequired,
};