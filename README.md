# bitstamp-ingestion

This example was created to show case a simple ingestion procedure of retrieving monthly transaction information from [Bitstamp](https://www.bitstamp.net/api/) and storing it in [Azure Storage](https://azure.microsoft.com/) as `csv` by using an app function via [serverless](https://serverless.com/framework/docs/providers/azure/).

### Development

The project comes prepared to be running with [azurite](https://github.com/Azure/Azurite/blob/master/README.md) via `docker-compose`. So in order to run the tests all you have to do is:

```bash
> docker-compose up -d
> yarn test
```

All the tests are run and automatically cleaned up at the end using `azurite` + `nock`.

### Running in Azure

First we need to create a storage account and a container, and for this I suggest the easiest way to subscribe for a free account and use the vscode extension to log in, and create a storage account.

Then we are ready to deploy our serverless function:

```
> serverless deploy
```

__NOTE__: if you have trouble connecting serverless to azure try following [these instructions](https://github.com/serverless/serverless-azure-functions#advanced-authentication) for setting up a service principal for authentication

When we have the service up and running we need to configure the following environment variables in `console` -> `resouce groups` -> `app service` -> `configuration`:

```
accessKey: 'AZURE_ACCESS_KEY',
account: 'AZURE_ACCOUNT',
container: 'AZURE_CONTAINER',
ssl: 'AZURE_SSL'
```

### Possible future work

 * Add proper validation of parameters (ajv, validator.js, etc)
 * Separate azure client to it's own repo
 * Replace event trigger by a queue with different events for each crypto pair to allow for scaling
 * Add timeout on requests for proper error handling
 * Add support for multiple handlers (kraken, coinbase, bitfinex, etc)
 * Add proper logging

### Other References

 * [Azure blob service client](https://docs.microsoft.com/en-us/javascript/api/@azure/storage-blob/blobserviceclient)
 * [Bitstamp api](https://www.bitstamp.net/api/)
 * [Serverless Azure documentation](https://www.serverless.com/framework/docs/providers/azure/)
