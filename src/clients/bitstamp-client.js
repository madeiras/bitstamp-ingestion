'use strict';

const Bitstamp = require('bitstamp');
const config = require('config');
const util = require('util');

/**
 * Instances.
 */

const { accessKey, accessSecret, account, host, timeout } = config.get('bitstamp');
const bitstamp = new Bitstamp(accessKey, accessSecret, account, timeout, host);

/**
 * Export `BitstampClient`.
 */

module.exports = { userTransactions: util.promisify(bitstamp.user_transactions) };
