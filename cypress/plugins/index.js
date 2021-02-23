const wp = require('@cypress/webpack-preprocessor');
let percyHealthCheck = require('@percy/cypress/task');

module.exports = (on, config) => {
  const options = {
    webpackOptions: require('../../webpack.config'),
  };
  on('file:preprocessor', wp(options));
  on('task', percyHealthCheck);
  return config
};
