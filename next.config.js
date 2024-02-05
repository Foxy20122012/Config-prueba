const config = require('config')
const constants = config.get('constants')

const nextConfig = {
  redirects() {
    return [
      {
        source: '/mantenimientos',
        destination: '/',
        permanent: false
      },
    ];
  },
  env: {
    ...constants,
  },
  images: {
    domains: ['www.via-asesores.com', 'gt.via-asesores.com', 'qa.via-asesores.com'],
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
