'use strict';

/**
 * Export custom environment variables configuration.
 */

module.exports = {
  azure: {
    accessKey: 'AZURE_ACCESS_KEY',
    account: 'AZURE_ACCOUNT',
    container: 'AZURE_CONTAINER',
    ssl: 'AZURE_SSL'
  },
  bitstamp: {
    accessKey: 'BITSTAMP_ACCESS_KEY',
    accessSecret: 'BITSTAMP_ACCESS_SECRET',
    account: 'BITSTAMP_ACCOUNT',
    offset: 'BITSTAMP_OFFSET',
    pair: 'BITSTAMP_PAIR'
  },
  sentry: {
    dsn: 'SENTRY_DSN'
  }
};
