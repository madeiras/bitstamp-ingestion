'use strict';

const client = require('../../../src/clients/azure-client');
const config = require('config');

/**
 * Add `storage` hook.
 */

afterAll(async () => {
  // Assumes there is only one container.
  const [container] = await client.getContainers();

  if (container && container.name === config.get('azure.container')) {
    return;
  }

  await client.deleteContainer({ container: config.get('azure.container') });
});

afterEach(async () => {
  const blobs = await client.getBlobs({ container: config.get('azure.container') });

  for (const blob of blobs) {
    await client.deleteBlob({
      blob: blob.name,
      container: config.get('azure.container')
    });
  }
});

beforeAll(async () => {
  // Assumes there is only one container.
  const [container] = await client.getContainers();

  if (container && container.name === config.get('azure.container')) {
    return;
  }

  await client.createContainer({ name: config.get('azure.container') });
});
