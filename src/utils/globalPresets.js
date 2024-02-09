const theme = 'blue'

const presets = {
  theme: `${theme}`,
  appTitle: 'ChocoChapin - ERP',
  images: {
    logo: 'https://cvecabogados.com/wp-content/uploads/2022/10/Estudio-de-abogados-en-Quito-Ecuador-1-2.jpg',
    loginFondo: 'https://recursosparapymes.com/wp-content/uploads/2022/06/mejores-herramientas-planificacion-gratuitas.jpg',
    welcomeFondo: 'https://cvecabogados.com/wp-content/uploads/2022/10/Estudio-de-abogados-en-Quito-Ecuador-1-2.jpg'
  },
  locations: {
    login: '/login',
    companiasUsuario: '/welcome',
    welcome: '/companiasUsuario',
    profile: '/miPerfil',
    welcomeTemp: '/welcome'
  },
  toaster: {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
  }
}

export default presets