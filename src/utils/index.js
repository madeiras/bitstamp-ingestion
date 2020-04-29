'use strict';

const config = require('config');

/**
 * Export `utils`.
 */

module.exports = {
  /**
   * Get resources url.
   */

  getResourcesUrl() {
    const protocol = `${config.get('azure.ssl') === 'true' ? 'https' : 'http'}://`;

    return config.get('nock.enabled')
      ? `${protocol}${config.get('azure.resourcesUrl')}/${config.get('azure.account')}`
      : `${protocol}${config.get('azure.account')}.${config.get('azure.resourcesUrl')}`;
  }
};
