'use strict';

const azure = require('../../../src/clients/azure-client');
const bitstamp = require('../../../src/clients/bitstamp-client');
const config = require('config');
const fixtures = require('../../utils/fixtures');
const mocks = require('../../utils/mocks/bitstamp-mocks');
const moment = require('moment');
const sentry = require('../../../src/clients/sentry-client');
const syncDocumentHandler = require('../../../src/handlers/sync-document-handler');

/**
 * Test `SyncDocumentHandler`.
 */

describe('SyncDocumentHandler', () => {
  describe('run()', () => {
    it('should capture thrown errors to sentry', async () => {
      jest.spyOn(sentry, 'captureException');
      jest.spyOn(azure, 'existsBlob').mockImplementationOnce(() => {
        throw new Error('foo');
      });

      try {
        await syncDocumentHandler.run();

        fail();
      } catch (e) {
        expect(e.message).toBe('foo');
        expect(sentry.captureException).toHaveBeenCalled();
      }
    });

    it('should do nothing if the monthly file to be processed already exists', async () => {
      jest.spyOn(bitstamp, 'userTransactions');

      await fixtures.loadBlob({
        name: `${moment()
          .subtract(1, 'month')
          .format('YYYY-MM')}_${config.get('bitstamp.pair')}.csv`
      });

      await syncDocumentHandler.run();

      expect(bitstamp.userTransactions).not.toHaveBeenCalled();
    });

    it('should do nothing if the returned data is not relative to the previous month', async () => {
      mocks.userTransactions.succeed();
      mocks.userTransactions.succeed({ offset: 1 });
      mocks.userTransactions.succeed({ data: [], offset: 2 });
      jest.spyOn(azure, 'createBlobByData');
      jest.spyOn(bitstamp, 'userTransactions');

      await syncDocumentHandler.run();

      expect(azure.createBlobByData).not.toHaveBeenCalled();
      expect(bitstamp.userTransactions).toHaveBeenCalledTimes(3);
    });

    it('should store the previous month activity on a csv file on azure', async () => {
      mocks.userTransactions.succeed({
        data: [
          fixtures.generateTransaction({
            datetime: moment()
              .subtract(1, 'month')
              .endOf('month')
          })
        ],
        offset: 0
      });
      mocks.userTransactions.succeed({
        data: [
          fixtures.generateTransaction({
            datetime: moment()
              .subtract(1, 'month')
              .endOf('month')
              .subtract(1, 'day')
          })
        ],
        offset: 1
      });
      mocks.userTransactions.succeed({
        data: [
          fixtures.generateTransaction({
            datetime: moment()
              .subtract(1, 'month')
              .startOf('month')
              .subtract(1, 'ms')
          })
        ],
        offset: 2
      });
      jest.spyOn(azure, 'createBlobByData');
      jest.spyOn(bitstamp, 'userTransactions');

      await syncDocumentHandler.run();

      expect(azure.createBlobByData).toHaveBeenCalled();
      expect(bitstamp.userTransactions).toHaveBeenCalledTimes(3);
    });
  });
});
