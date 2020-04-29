'use strict';

/**
 * Export default configuration.
 */

module.exports = {
  azure: {
    container: 'bitstamp-ingestion-container',
    resourcesUrl: 'blob.core.windows.net',
    ssl: 'true'
  },
  bitstamp: {
    accessKey: 'Futsrqponmlkjihgfedcba0987654321',
    accessSecret: '1234567890abcdefghijklmnopqrstuF',
    account: '123456',
    offset: '100',
    pair: 'btcusd'
  },
  nock: {
    enabled: false
  },
  sentry: {
    dsn: null
  }
};
