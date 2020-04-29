'use strict';

const azure = require('../clients/azure-client');
const bitstamp = require('../clients/bitstamp-client');
const config = require('config');
const moment = require('moment');
const sentry = require('../clients/sentry-client');

/**
 * Sync document.
 */

module.exports.syncDocument = async () => {
  let data = [];
  let offset = 0;
  let writeSuccess = false;
  let transactions;
  const processingDateStart = moment()
    .subtract(1, 'month')
    .startOf('month');
  const processingDateEnd = moment()
    .subtract(1, 'month')
    .endOf('month');
  const previousFile = await azure.existsBlob({
    blob: `${processingDateStart.format('YYYY-MM')}_${config.get('bitstamp.pair')}.csv`,
    container: config.get('azure.container')
  });

  // Early return assuming if it has the previous file then everything else is ok.
  if (previousFile) {
    console.log('Previous month file already processed, exiting');

    return writeSuccess;
  }

  do {
    transactions = await bitstamp.userTransactions(config.get('bitstamp.pair'), {
      offset,
      sort: 'desc'
    });

    const relevant = transactions.filter(
      transaction => moment(transaction.datetime).isAfter(processingDateStart) && moment(transaction.datetime).isBefore(processingDateEnd)
    );

    // If there is no more relevant data, save the file and exit.
    if (transactions.length > 0 && moment(transactions[0].datetime).isBefore(processingDateStart)) {
      break;
    }

    // Otherwise accumulate the data in memory.
    data = data.concat(relevant);
    offset += Number(config.get('bitstamp.offset'));
  } while (transactions.length > 0);

  if (data.length > 0) {
    await azure.createBlobByData({
      container: config.get('azure.container'),
      data: module.exports.formatData({ data }),
      name: `${processingDateStart.format('YYYY-MM')}_${config.get('bitstamp.pair')}.csv`
    });

    writeSuccess = true;
  }

  return writeSuccess;
};

/**
 * Format data.
 */

module.exports.formatData = ({ data }) => {
  return data.reduce((result, item) => result.concat(`${Object.values(item).join(',')}\n`), `${Object.keys(data[0]).join(',')}\n`);
};

/**
 * Run.
 */

module.exports.run = async () => {
  try {
    const writeSuccess = await module.exports.syncDocument();

    console.log(`Synced last month file from bitstamp account (new file: "${writeSuccess}")`);
  } catch (e) {
    console.log(`Failed to sync last month file from bitstamp account: "${e.message}"`);

    sentry.captureException(e);

    throw e;
  }
};
