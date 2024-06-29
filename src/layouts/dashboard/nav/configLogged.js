// component
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import { useAuth } from '../../../AuthContext';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Inicio',
    path: '/inicio',
    icon: <Iconify icon="fluent:home-16-filled" color="#c1c7cd" />,
  },
  {
    title: 'Películas',
    path: '/peliculas',
    icon: <Iconify icon="fluent:movies-and-tv-16-filled" color="#c1c7cd" />,
  },
  {
    title: 'Por ver',
    path: '/listas/por-ver',
    icon: <Iconify icon="iconamoon:clock-fill" color="#c1c7cd"/>,
  },
  {
    title: 'Vistas',
    path: '/listas/vistas',
    icon: <Iconify icon="mdi:movie-open-check" color="#c1c7cd"/>,
  },
  {
    title: 'Favoritas',
    path: '/listas/favoritas',
    icon: <Iconify icon="mdi:heart" color="#c1c7cd"/>,
  },
];

export default navConfig;