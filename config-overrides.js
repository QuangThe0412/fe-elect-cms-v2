const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@/styles': 'src/styles',
    '@/components': 'src/components',
    '@/services': 'src/services',
  })(config);

  return config;
};
