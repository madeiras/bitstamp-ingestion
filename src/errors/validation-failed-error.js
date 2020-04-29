'use strict';

const HttpError = require('standard-http-error');

/**
 * `ValidationFailedError`.
 */

class ValidationFailedError extends HttpError {
  /**
   * Constructor.
   */

  constructor(error = []) {
    const errors = Array.isArray(error) ? error : [error];

    super(400, 'Validation Failed', { errors });
  }
}

/**
 * Export `ValidationFailedError`.
 */

module.exports = ValidationFailedError;
