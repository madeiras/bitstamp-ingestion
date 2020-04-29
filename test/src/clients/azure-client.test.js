'use strict';

const client = require('../../../src/clients/azure-client');
const config = require('config');
const fixtures = require('../../utils/fixtures');
const ValidationFailedError = require('../../../src/errors/validation-failed-error');

/**
 * Test `AzureClient`.
 */

describe('AzureClient', () => {
  describe('createBlobByData()', () => {
    it('should throw `ValidationFailedError` if `container`, `data`, `name` are missing', async () => {
      try {
        await client.createBlobByData();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationFailedError);
        expect(e.errors).toEqual([{ container: undefined, data: undefined, name: undefined }]);
      }
    });

    it('should create a blob', async () => {
      await client.createBlobByData({ container: config.get('azure.container'), data: 'bar', name: 'foo' });

      const blobs = await client.getBlobs({ container: config.get('azure.container') });

      expect(blobs.length).toBe(1);

      const [blob] = blobs;

      expect(blob.name).toBe('foo');
    });
  });

  describe('deleteBlob()', () => {
    it('should throw `ValidationFailedError` if `blob` and `container` are missing', async () => {
      try {
        await client.deleteBlob();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationFailedError);
        expect(e.errors).toEqual([{ blob: undefined, container: undefined }]);
      }
    });

    it('should delete a blob', async () => {
      await fixtures.loadBlob();

      let blobs = await client.getBlobs({ container: config.get('azure.container') });

      expect(blobs.length).toBe(1);

      const [blob] = blobs;

      await client.deleteBlob({ blob: blob.name, container: config.get('azure.container') });

      blobs = await client.getBlobs({ container: config.get('azure.container') });

      expect(blobs.length).toBe(0);
    });
  });

  describe('deleteContainer()', () => {
    it('should throw `ValidationFailedError` if `container` are missing', async () => {
      try {
        await client.deleteContainer();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationFailedError);
        expect(e.errors).toEqual([{ container: undefined }]);
      }
    });

    it('should delete a container', async () => {
      await client.createContainer({ name: 'foo' });

      let containers = await client.getContainers();

      // We always have a container created by default.
      expect(containers.length).toBe(2);

      await client.deleteContainer({ container: 'foo' });

      containers = await client.getContainers();

      expect(containers.length).toBe(1);
    });
  });

  describe('existsBlob()', () => {
    it('should throw `ValidationFailedError` if `blob` and `container` is missing', async () => {
      try {
        await client.existsBlob();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationFailedError);
        expect(e.errors).toEqual([{ blob: undefined, container: undefined }]);
      }
    });

    it('should return true ie the blob exists', async () => {
      await fixtures.loadBlob({ name: 'foo' });

      const existsBlob = await client.existsBlob({ blob: 'foo', container: config.get('azure.container') });

      expect(existsBlob).toBeTruthy();
    });

    it('should return false ie the blob exists', async () => {
      const existsBlob = await client.existsBlob({ blob: 'foo', container: config.get('azure.container') });

      expect(existsBlob).toBeFalsy();
    });
  });

  describe('getBlobs()', () => {
    it('should throw `ValidationFailedError` if `container` is missing', async () => {
      try {
        await client.getBlobs();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationFailedError);
        expect(e.errors).toEqual([{ container: undefined }]);
      }
    });

    it('should get all blobs in `container`', async () => {
      await fixtures.loadBlob();
      await fixtures.loadBlob({ name: 'foo' });

      const blobs = await client.getBlobs({ container: config.get('azure.container') });

      expect(blobs.length).toBe(2);
    });
  });

  describe('getContainers()', () => {
    it('should get all containers', async () => {
      const containers = await client.getContainers();

      expect(containers.length).toBe(1);

      const [container] = containers;

      expect(container.name).toBe(config.get('azure.container'));
    });
  });
});
