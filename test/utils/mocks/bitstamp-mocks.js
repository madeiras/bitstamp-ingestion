'use strict';

const config = require('config');
const fixtures = require('../fixtures');
const nock = require('nock');
const url = 'https://www.bitstamp.net/api';

/**
 * Export mocked requests.
 */

module.exports = {
  /**
   * User transactions.
   */

  userTransactions: {
    succeed({ data = [fixtures.generateTransaction()], offset = 0 } = {}) {
      const regex = new RegExp(`key=\\w+&signature=\\w+&nonce=\\d+&offset=${offset}&sort=desc`);

      return nock(url)
        .filteringRequestBody(body => body.replace(regex, 'foo'))
        .post(`/v2/user_transactions/${config.get('bitstamp.pair')}/`, 'foo')
        .reply(200, data);
    }
  }
};
