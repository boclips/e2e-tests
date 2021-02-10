const wp = require('@cypress/webpack-preprocessor');
let percyHealthCheck = require('@percy/cypress/task');

module.exports = (on) => {
  on('task', percyHealthCheck);
  const options = {
    webpackOptions: require('../../webpack.config'),
  };
  on('file:preprocessor', wp(options));
};
