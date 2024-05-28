const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@/styles': 'src/assets/styles',
    '@/images': 'src/assets/images',
    '@/components': 'src/components',
    '@/containers': 'src/containers',
    '@/services': 'src/services',
    '@/models': 'src/models',
    '@/utils': 'src/utils',
    '@/store': 'src/store',
    '@/assets': 'src/assets',
    '@/constants': 'src/constants',
    '@/hooks': 'src/hooks',
  })(config);

  return config;
};
