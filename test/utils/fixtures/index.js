'use strict';

const azure = require('../../../src/clients/azure-client');
const config = require('config');
const moment = require('moment');

/**
 * Exports.
 */

module.exports = {
  /**
   * Generate tranaction.
   */

  generateTransaction({ datetime = moment().format('YYYY-MM-DD HH:mm:ss') } = {}) {
    return {
      usd: '-4488.79',
      btc_usd: 4712,
      order_id: 2404130869,
      datetime,
      fee: '10.78',
      btc: '0.95262922',
      type: '2',
      id: 77659028,
      eur: 0
    };
  },

  /**
   * Load blob.
   */

  async loadBlob({ data = 'foo', name = 'bar' } = {}) {
    return await azure.createBlobByData({ container: config.get('azure.container'), data, name });
  }
};
