/* eslint-disable camelcase */

import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Card, Table, Stack, Checkbox, TableRow, TableBody, TableCell, Container, Typography, TableContainer, TablePagination } from '@mui/material';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import { fetchMovieDetails, getImageUrl } from '../tmdbService';
import { useAuth } from '../AuthContext';

const TABLE_HEAD = [
  { id: 'cover', label: '', alignRight: false },
  { id: 'title', label: 'Título', alignRight: false },
  { id: 'language', label: 'Idioma', alignRight: false },
  { id: 'rate', label: 'Calificación', alignRight: false },
  { id: 'createdAt', label: 'Fecha de lanzamiento', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_movie) => _movie.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserList() {
  const [open, setOpen] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [moviesInList, setMoviesInList] = useState([]);
  const { isLoggedIn, authState } = useAuth();

  const { idList } = useParams();
  const [listData, setListData] = useState(null);

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!authState) return;

      try {
        const response = await axios.post('http://localhost:4000/api/users/lists/', {
          userId: authState._id
        });
        const userLists = response.data.data;

        const list = userLists.find(list => list._id === idList);
        if (list) {
          setListData(list);
        }
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    };

    fetchUserLists();
  }, [authState, idList]);

  useEffect(() => {
    const fetchMoviesData = async () => {
      if (listData) {
        const moviePromises = listData.idMovies.map(id => fetchMovieDetails(id));
        const movies = await Promise.all(moviePromises);
        setMoviesInList(movies);
      }
    };
    fetchMoviesData();
  }, [listData]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = moviesInList.map((movie) => movie.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, title) => {
    const selectedIndex = selected.indexOf(title);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, title);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      const updatedList = {
        ...listData,
        idMovies: listData.idMovies.filter(id => id !== movieId.toString()),
      };
  
      const response = await axios.post('http://localhost:4000/api/users/lists/removeMovie', {
        userId: authState._id,
        listId: idList,
        movieId: movieId.toString()
      });
  
      if (response.status === 200) {
        console.log('Película eliminada de la lista correctamente.');
      }

      setListData(updatedList);

      const updatedMovies = await Promise.all(updatedList.idMovies.map(id => fetchMovieDetails(id)));
      setMoviesInList(updatedMovies);
    } catch (error) {
      console.error('Error al eliminar la película:', error);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - moviesInList.length) : 0;

  const filteredMovies = applySortFilter(moviesInList, getComparator(order, orderBy), filterName);

  const isMovieSelected = (title) => selected.indexOf(title) !== -1;

  return (
    <>
      <Helmet>
        <title>{listData ? `Mis listas | ${listData.title}` : 'Mis listas | CineXplorer'}</title>
      </Helmet>

      {isLoggedIn ? (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              {listData ? listData.title : 'Mis listas'}
            </Typography>
          </Stack>

          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={moviesInList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                    hideSelectAllCheckbox
                  />
                  <TableBody>
                    {filteredMovies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, poster_path, title, original_language, vote_average, release_date } = row;
                      const isItemSelected = isMovieSelected(title);

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, title)} />
                          </TableCell>
                          <TableCell align="left">
                            <Link to={`/peliculas/${row.id}`}>
                              <img src={getImageUrl(poster_path, 'w200')} alt={title} style={{ width: '75px', height: 'auto' }} />
                            </Link>
                          </TableCell>
                          <TableCell align="left">{title}</TableCell>
                          <TableCell align="left">{original_language}</TableCell>
                          <TableCell align="left">{vote_average}</TableCell>
                          <TableCell align="left">{new Date(release_date).toLocaleDateString()}</TableCell>
                          <TableCell align="left">
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleDeleteMovie(row.id)}
                              aria-label="Eliminar"
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={moviesInList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      ) : (
        <Container>
          <Typography variant="h5" align="center" gutterBottom>
            Inicia sesión para ver tus listas.
          </Typography>
        </Container>
      )}
    </>
  );
}