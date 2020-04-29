'use strict';

const config = require('config');
const sentry = require('@sentry/node');

/**
 * Configure client.
 */

sentry.init(config.get('sentry'));

/**
 * Export `sentry`.
 */

module.exports = sentry;
