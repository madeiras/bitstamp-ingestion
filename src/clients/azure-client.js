'use strict';

const config = require('config');
const mime = require('mime-types');
const ValidationFailedError = require('../errors/validation-failed-error');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const { getResourcesUrl } = require('../utils');

/**
 * `AzureClient` class.
 */

class AzureClient {
  /**
   * Constructor.
   */

  constructor({ account, key, url }) {
    const sharedKeyCredential = new StorageSharedKeyCredential(account, key);
    console.log(account, key, url);

    this.account = account;
    this.key = key;
    this.service = new BlobServiceClient(url, sharedKeyCredential);
  }

  /**
   * Create blob by data.
   */

  async createBlobByData({ container, data, name } = {}) {
    if (!container || !data || !name) {
      throw new ValidationFailedError({ container, data, name });
    }

    console.log(`Creating blob ${name} on ${container}`);

    const containerClient = this.service.getContainerClient(container);
    const blockBlobClient = containerClient.getBlockBlobClient(name, { blobHTTPHeaders: { blobContentType: mime.contentType(name) } });

    return await blockBlobClient.upload(data, data.length);
  }

  /**
   * Create container.
   */

  async createContainer({ name }) {
    const containerClient = this.service.getContainerClient(name);

    console.log(`Creating container ${name}`);

    return await containerClient.create();
  }

  /**
   * Delete blob.
   */

  async deleteBlob({ blob, container } = {}) {
    if (!blob || !container) {
      throw new ValidationFailedError({ blob, container });
    }

    const containerClient = this.service.getContainerClient(container);
    const blockBlobClient = containerClient.getBlockBlobClient(blob);

    console.log(`Deleting blob ${blob} from ${container}`);

    return await blockBlobClient.delete();
  }

  /**
   * Delete container.
   */

  async deleteContainer({ container } = {}) {
    if (!container) {
      throw new ValidationFailedError({ container });
    }

    console.log(`Deleting container ${container}`);

    return await this.service.deleteContainer(container);
  }

  /**
   * Exists blob.
   */

  async existsBlob({ blob, container } = {}) {
    if (!blob || !container) {
      throw new ValidationFailedError({ blob, container });
    }

    console.log(`Checking if blob exists (name: "${blob}")`);

    const containerClient = this.service.getContainerClient(container);
    const blockBlobClient = containerClient.getBlockBlobClient(blob);

    return await blockBlobClient.exists();
  }

  /**
   * Get blobs.
   */

  async getBlobs({ container } = {}) {
    if (!container) {
      throw new ValidationFailedError({ container });
    }

    console.log('Fetching blobs');

    const containerClient = this.service.getContainerClient(container);
    let listBlobIterator = await containerClient.listBlobsFlat();
    let blobs = [];
    let next;

    do {
      next = await listBlobIterator.next();

      if (!next.done) {
        blobs.push(next.value);
      }
    } while (!next.done);

    return blobs;
  }

  /**
   * Get containers.
   */

  async getContainers() {
    console.log('Fetching containers');

    const listContainerIterator = await this.service.listContainers();
    let containers = [];
    let next;

    do {
      next = await listContainerIterator.next();

      if (!next.done) {
        containers.push(next.value);
      }
    } while (!next.done);

    return containers;
  }
}

/**
 * Export `AzureClient`.
 */

module.exports = new AzureClient({
  account: config.get('azure.account'),
  key: config.get('azure.accessKey'),
  url: getResourcesUrl()
});
