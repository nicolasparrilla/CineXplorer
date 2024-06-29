const movies = [
  {
    id: '1',
    cover: '/assets/images/movie_covers/godzilla_kong.jpg',
    title: 'Godzilla y Kong: El nuevo imperio',
    createdAt: new Date(2024, 2, 28), // Marzo 28, 2024
    rate: 67,
    director: 'Adam Wingard',
    genres: ['Acción', 'Ciencia Ficción', 'Aventura', 'Fantasía'],
    language: 'Inglés',
    description: 'Una aventura cinematográfica completamente nueva, que enfrentará al todopoderoso Kong y al temible Godzilla contra una colosal amenaza desconocida escondida dentro de nuestro mundo. La nueva y épica película profundizará en las historias de estos titanes, sus orígenes y los misterios de Isla Calavera y más allá, mientras descubre la batalla mítica que ayudó a forjar a estos seres extraordinarios y los unió a la humanidad para siempre.',
    cast: ["Rebecca Hall", "Brian Tyree Henry", "Dan Stevens", "Kaylee Hottle", "Alex Ferns", "Fala Chen", "Rachel House", "Rom Smyck", "Chantelle Jamieson"]
  },
  {
    id: '2',
    cover: '/assets/images/movie_covers/kung_fu_panda_4.jpg',
    title: 'Kung Fu Panda 4',
    createdAt: new Date(2024, 2, 7), // Marzo 7, 2024
    rate: 68,
    director: 'Mike Mitchell',
    genres: ['Acción', 'Aventura', 'Animación', 'Comedia', 'Familia'],
    language: 'Inglés',
    description: 'Po se prepara para ser el líder espiritual del Valle de la Paz, buscando un sucesor como Guerrero Dragón. Mientras entrena a un nuevo practicante de kung fu, enfrenta al villano llamado "el Camaleón", que evoca villanos del pasado, desafiando todo lo que Po y sus amigos han aprendido.',
    cast: ["Jack Black", "Awkwafina", "Viola Davis", "Dustin Hoffman", "Bryan Cranston", "James Hong", "Ian McShane", "Ke Huy Quan", "Ronny Chieng"]
  },
  {
    id: '3',
    cover: '/assets/images/movie_covers/dune_parte_dos.jpg',
    title: 'Dune: Parte dos',
    createdAt: new Date(2024, 1, 29), // Febrero 29, 2024
    rate: 83,
    director: 'Denis Villeneuve',
    genres: ['Ciencia Ficción', 'Aventura'],
    language: 'Inglés',
    description: 'Sigue el viaje mítico de Paul Atreides mientras se une a Chani y los Fremen en una guerra de venganza contra los conspiradores que destruyeron a su familia. Al enfrentarse a una elección entre el amor de su vida y el destino del universo conocido, Paul se esfuerza por evitar un futuro terrible que solo él puede prever.',
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Josh Brolin", "Austin Butler", "Florence Pugh", "Dave Bautista", "Christopher Walken"]
  },
  {
    id: '4',
    cover: '/assets/images/movie_covers/road_house.jpg',
    title: 'Road House (De profesión: duro)',
    createdAt: new Date(2024, 2, 8), // Marzo 8, 2024
    rate: 71,
    director: 'Charles Mondry',
    genres: ['Acción', 'Suspense'],
    language: 'Inglés',
    description: 'Dalton es un exluchador de la UFC en horas bajas que acepta un trabajo como portero en un conflictivo bar de carretera de los Cayos de Florida, sólo para descubrir que este paraíso no es todo lo que parece... Remake de la película de 1989 con Patrick Swayze.',
    cast: ["Jake Gyllenhaal", "Daniela Melchior", "Conor McGregor", "Billy Magnussen", "Jessica Williams", "Hannah Love Lanier", "Joaquim de Almedia", "B.K. Cannon", "J.D. Pardo"]
  },
  {
    id: '5',
    cover: '/assets/images/movie_covers/el_salario_del_miedo.jpg',
    title: 'El salario del miedo',
    createdAt: new Date(2024, 2, 29), // Marzo 29, 2024
    rate: 59,
    director: 'Julien Leclercq',
    genres: ['Acción', 'Suspense'],
    language: 'Francés',
    description: 'Para salvar a cientos de personas de la explosión de un pozo petrolífero, un equipo de expertos emprende una peligrosa travesía por el desierto con una carga de nitroglicerina.',
    cast: ["Franck Gastambide", "Alban Lenoir", "Ana Girardot", "Sofiane Zermani", "Astrid Whettnall", "Bakary Diombera", "Alka Matewa", "Rabie Kati", "Joseph Beddelem"]
  },
  {
    id: '6',
    cover: '/assets/images/movie_covers/after_the_pandemic.jpg',
    title: 'After the Pandemic',
    createdAt: new Date(2022, 2, 1), // Marzo 1, 2022
    rate: 55,
    director: 'Richard Lowry',
    genres: ['Ciencia Ficción', 'Acción'],
    language: 'Inglés',
    description: 'Ambientado en un mundo postapocalíptico donde una pandemia global transmitida por el aire ha acabado con el 90% de la población de la Tierra y solo los jóvenes e inmunes han sobrevivido como carroñeros. Para Ellie y Quinn, los desafíos diarios para mantenerse con vida se complican cuando son perseguidos por los despiadados Stalkers.',
    cast: ["Lelyn Mac", "Eve James", "Kannon Smith", "Juniper Preacher", "Derek Sneddon", "Alex McCormick", "Gu Sewen", "Virginia Fivas", "Leslie Ldmaw"]
  },
  {
    id: '7',
    cover: '/assets/images/movie_covers/el_corazon_del_cazador.jpg',
    title: 'El corazón del cazador',
    createdAt: new Date(2024, 2, 29), // Marzo 29, 2024
    rate: 57,
    director: 'Deon Meyer',
    genres: ['Acción', 'Misterio', 'Suspense'],
    language: 'Inglés',
    description: 'Un asesino retirado se ve obligado a volver a la acción cuando su amigo destapa una peligrosa conspiración en el seno del Gobierno de Sudáfrica.',
    cast: ["Bonko Khoza", "Connie Ferguson", "Masasa Mbangeni", "Tim Theron", "Peter Butler", "Nicole Fortuin", "Sisanda Henna", "Milan Murray", "Deon Coetzee"]
  },
  {
    id: '8',
    cover: '/assets/images/movie_covers/madame_web.jpg',
    title: 'Madame Web',
    createdAt: new Date(2024, 1, 15), // Febrero 15, 2024
    rate: 57,
    director: 'S.J. Clarkson',
    genres: ['Acción', 'Fantasía'],
    language: 'Inglés',
    description: 'Cassandra Webb es una paramédica en Manhattan que podría tener habilidades clarividentes. Obligada a enfrentarse a sucesos que se han revelado de su pasado, crea una relación con tres jóvenes destinadas a tener un futuro poderoso... si consiguen sobrevivir a un presente mortal.',
    cast: ["Dakota Johnson", "Sydney Sweeney", "Isabela Merced", "Celeste O'Connor", "Tahar Rahim", "Kerry Bishé", "Adam Scott", "Emma Roberts", "Mike Epps"]
  },
  {
    id: '9',
    cover: '/assets/images/movie_covers/thomas_&_friends_steam_team.jpg',
    title: 'Thomas & Friends: Steam Team to the Rescue',
    createdAt: new Date(2019, 10, 19),
    rate: 20,
    director: 'Joey So',
    genres: ['Animación', 'Comedia', 'Fantasía'],
    language: 'Inglés',
    description: 'Thomas and the steam trains spring into action when Porter and the diesel engines run into a series of accidents that throw their deliveries off track.',
    cast: ["John Hashler", "Nigel Pilington"]
  },
  {
    id: '10',
    cover: '/assets/images/movie_covers/muchachos_la_pelicula_de_la_gente.jpg',
    title: 'Muchachos, La película de la gente',
    createdAt: new Date(2023, 12, 7),
    rate: 84,
    director: 'Jesús Braceras',
    genres: ['Documental'],
    language: 'Español',
    description: '“Muchachos, la película de la gente”, narrada por Guillermo Francella y basada en un cuento de Hernán Casciari -autor de “La valija de Messi”- invita a los espectadores a sumergirse en el corazón de la hinchada argentina y volver a sufrir, reír, llorar y revivir los siete partidos del Mundial y sus festejos.',
    cast: ["Guillermo Francella"]
  }
];

export default movies;