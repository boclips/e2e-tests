require('cypress-plugin-retries')
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

// In order to get some handle on why all our e2e are so flaky, it's good to get an insight into what's happening
// inside of the browser.
//
// Cypress currently doesn't give us an easy way of reporting console.[log|warn|...] messages to the CI. This does.
//
// This is inspired by https://github.com/cypress-io/cypress/issues/3199#issuecomment-466593084

let logs = '';

Cypress.on('window:before:load', window => {
  const docIframe = window.parent.document.querySelector("[id^='Your App']");

  const appWindow = docIframe.contentWindow;

  // Frankly I'm surprised this works given the src of the target iframe is on a different domain.... #cypressmagic
  ['log', 'info', 'error', 'warn', 'debug'].forEach(consoleProperty => {
    appWindow.console[consoleProperty] = function(...args) {
      args.unshift(consoleProperty);
      if (['error', 'warn'].includes(consoleProperty)) {
        const error = Error();
        args.push({ stack: error.stack });
      }

      try {
        logs += JSON.stringify(args) + '\n';
      } catch (error) {
        logs +=
          '###########################################\n' +
          'An error occurred while JSONifying the args\n' +
          `${error}\n` +
          args.join('\n') +
          '###########################################\n';
      }
    };
  });
});

// Cypress doesn't have a each test event
// so I'm using mochas events to clear log state after every test.
Cypress.mocha.getRunner().on('test', () => {
  // Every test reset your logs to be empty
  // This will make sure only logs from that test suite will be logged if a error happens
  logs = '';
});

// On a cypress fail. I add the console logs, from the start of test or after the last test fail to the
// current fail, to the end of the error.stack property.
Cypress.on('fail', error => {
  error.stack += '\nConsole Logs:\n========================\n';
  error.stack += logs;
  // clear logs after fail so we dont see duplicate logs
  logs = '';
  // still need to throw the error so tests wont be marked as a pass
  throw error;
});
