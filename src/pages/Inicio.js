import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import useResponsive from '../hooks/useResponsive';

export default function Inicio() {
  const navigate = useNavigate(); // Obtiene la función de navegación
  const isDesktop = useResponsive('up', 'lg');

  const handleDiscoverMovies = () => {
    navigate('/peliculas'); // Redirige a la página de películas al hacer clic en el botón
  };

  return (
    <>
      <Helmet>
        <title> Inicio | CineXplorer </title>
      </Helmet>

      <Container sx={{ mb: -10, ms: -3, me: -3 }} disableGutters maxWidth={false}>
        <Typography variant="h4" sx={{ mb: 15 }}/>

        <Grid container spacing={2}>
          <Grid xs={12} lg={6}>  
            <Grid className="Altura" sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: "center", ml:3}}>
              
              <Grid>
                <Typography variant='h1' align='center'>
                  Bienvenido a <br />
                <Typography variant='h1' align='center' sx={{ color: '#0095D5' }}>CineXplorer</Typography>
                </Typography>
                <Typography variant='h4' align='center' sx={{ mt: 1 }}>Encontrá tus películas favoritas</Typography>
              </Grid>

              <Grid sx={{ display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: "center", mt: 3 }}>
                <Button variant="contained" size='large' sx={{ mx: 2 }} onClick={handleDiscoverMovies}>Descubrir Películas</Button> 
              </Grid>
            </Grid>
          </Grid>
          
          {isDesktop ? (
            <Grid className='Ocultar' xs={5} sx={{ display: "flex", alignItems: 'center', justifyContent: "center", position: "relative" }}>
              <img src="/assets/illustrations/pochoclos.png" alt="login" />
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </>
  );
}
